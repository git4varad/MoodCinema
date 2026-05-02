import { discoverPopularByGenre, searchMulti } from './tmdb'

/** TMDB genre IDs (movies & TV share these for Animation + Family). */
const GENRE_ANIMATION = 16
const GENRE_FAMILY = 10751

export function isKidsFamilyAnimationQuery(raw) {
  const q = raw.trim().toLowerCase()
  if (q.length < 2) return false
  return (
    /\b(kids?|kid'?s|children|child|family|families|animation|animated|cartoons?|cartoon|disney|pixar|family[- ]friendly|for kids|all ages)\b/.test(
      q,
    ) || /\b(pg|g rated|parental)\b/i.test(q)
  )
}

function dedupeMedia(items) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie')
    if (type !== 'movie' && type !== 'tv') continue
    const key = `${type}-${item.id}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ ...item, media_type: type })
  }
  return out
}

/**
 * Text search plus, for kids/family-style queries, popular Animation & Family movies and TV.
 */
export async function searchMoviesAndTVBroadened(query) {
  const q = query?.trim() ?? ''
  if (!q) return { results: [] }

  const base = await searchMulti(q)
  const fromSearch = dedupeMedia(base.results || [])

  if (!isKidsFamilyAnimationQuery(q)) {
    return { results: fromSearch }
  }

  const perGenre = 10
  const safe = async (fn) => {
    try {
      return await fn()
    } catch {
      return []
    }
  }
  const [animMovies, familyMovies, animTv, familyTv] = await Promise.all([
    safe(() => discoverPopularByGenre('movie', GENRE_ANIMATION, { page: 1, limit: perGenre })),
    safe(() => discoverPopularByGenre('movie', GENRE_FAMILY, { page: 1, limit: perGenre })),
    safe(() => discoverPopularByGenre('tv', GENRE_ANIMATION, { page: 1, limit: perGenre })),
    safe(() => discoverPopularByGenre('tv', GENRE_FAMILY, { page: 1, limit: perGenre })),
  ])

  const fromDiscover = [...animMovies, ...familyMovies, ...animTv, ...familyTv]
  const merged = dedupeMedia([...fromSearch, ...fromDiscover])
  return { results: merged }
}
