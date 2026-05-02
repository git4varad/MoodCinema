import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import MovieRow from '../components/MovieRow'
import {
  BROWSE_LANGUAGE_SLUGS,
  GLOBAL_HIT_MOVIE_IDS,
  GLOBAL_HIT_TV_IDS,
  LANGUAGE_GENRE_ROWS,
  getBrowseTitle,
  isValidBrowseSlug,
} from '../services/languageBrowseConfig'
import {
  fetchByIdSafe,
  fetchByLanguageAndGenre,
  fetchDiscoverMovieByOriginalLanguage,
  fetchDiscoverTVByOriginalLanguage,
} from '../services/tmdb'

function dedupeById(items) {
  const unique = []
  const seen = new Set()
  for (const item of items) {
    if (!item?.id || seen.has(item.id)) continue
    seen.add(item.id)
    unique.push(item)
  }
  return unique
}

async function discoverRegionalTV(lang) {
  try {
    return await fetchDiscoverTVByOriginalLanguage(lang, { page: 1 })
  } catch {
    return []
  }
}

async function discoverRegionalMovie(lang) {
  try {
    return await fetchDiscoverMovieByOriginalLanguage(lang, { page: 1 })
  } catch {
    return []
  }
}

export default function LanguageBrowse() {
  const { code } = useParams()
  const slug = code ?? ''

  const [globalMovies, setGlobalMovies] = useState([])
  const [globalTv, setGlobalTv] = useState([])
  const [genreSections, setGenreSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const pageTitle = useMemo(() => getBrowseTitle(slug), [slug])

  useEffect(() => {
    if (!isValidBrowseSlug(slug)) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        if (slug === 'global') {
          const [
            movieRaw,
            tvRaw,
            koTv,
            jaTv,
            esTv,
            koMv,
            jaMv,
            esMv,
          ] = await Promise.all([
            Promise.all(GLOBAL_HIT_MOVIE_IDS.map((id) => fetchByIdSafe(id, 'movie'))),
            Promise.all(GLOBAL_HIT_TV_IDS.map((id) => fetchByIdSafe(id, 'tv'))),
            discoverRegionalTV('ko'),
            discoverRegionalTV('ja'),
            discoverRegionalTV('es'),
            discoverRegionalMovie('ko'),
            discoverRegionalMovie('ja'),
            discoverRegionalMovie('es'),
          ])
          if (!cancelled) {
            const curatedMovies = movieRaw
              .filter(Boolean)
              .map((m) => ({ ...m, media_type: 'movie' }))
            const regionalMovies = [
              ...koMv.slice(0, 14),
              ...jaMv.slice(0, 14),
              ...esMv.slice(0, 14),
            ]
            const movies = dedupeById([...curatedMovies, ...regionalMovies])
            const curatedTv = tvRaw
              .filter(Boolean)
              .map((t) => ({ ...t, media_type: 'tv' }))
            const regionalTv = [
              ...koTv.slice(0, 14),
              ...jaTv.slice(0, 14),
              ...esTv.slice(0, 14),
            ]
            const tv = dedupeById([...curatedTv, ...regionalTv])
            setGlobalMovies(movies)
            setGlobalTv(tv)
            setGenreSections([])
            if (movies.length === 0 && tv.length === 0) {
              setError('Could not load Global Hits. Check your connection or try again.')
            } else {
              setError('')
            }
          }
          return
        }

        const langCode = slug
        const rows = await Promise.all(
          LANGUAGE_GENRE_ROWS.map(async (row) => {
            try {
              const raw = await fetchByLanguageAndGenre(row.genreId, langCode, {
                page: row.page,
                sortBy: row.sortBy,
              })
              const today = new Date().toISOString().slice(0, 10)
              const releasedOnly =
                ['hi', 'te', 'ta', 'kn'].includes(langCode)
                  ? raw.filter((m) => !m.release_date || m.release_date <= today)
                  : raw
              const withGenre = releasedOnly.filter(
                (m) => Array.isArray(m.genre_ids) && m.genre_ids.includes(row.genreId),
              )
              const pool = withGenre.length >= 5 ? withGenre : releasedOnly
              return {
                key: `${langCode}-${row.genreId}-${row.sortBy}-${row.page}`,
                title: row.title,
                items: dedupeById(pool).slice(0, 20),
              }
            } catch {
              return {
                key: `${langCode}-${row.genreId}-empty`,
                title: row.title,
                items: [],
              }
            }
          }),
        )
        if (!cancelled) {
          setGlobalMovies([])
          setGlobalTv([])
          setGenreSections(rows)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Something went wrong.')
          setGlobalMovies([])
          setGlobalTv([])
          setGenreSections([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (!isValidBrowseSlug(slug)) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] pb-12 pt-4">
      <div className="mb-8 px-6">
        <Link
          to="/"
          className="text-sm text-neutral-400 transition hover:text-white"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {pageTitle}
        </h1>
        {slug === 'global' ? (
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">
            Curated worldwide picks, plus popular movies and series from Korea, Japan &amp; Spain
            (by original language).
          </p>
        ) : (
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">
            {['hi', 'te', 'ta', 'kn'].includes(slug)
              ? 'Genre rows using titles already released in this language (no upcoming-only placeholders).'
              : 'Genre rows for this language — fixed picks, separate from your mood home feed.'}
          </p>
        )}
      </div>

      {error ? (
        <p className="px-6 text-sm text-red-400">{error}</p>
      ) : null}

      {slug === 'global' ? (
        <>
          <MovieRow
            title="Global Movies — hits + Korea, Japan &amp; Spain"
            items={globalMovies}
            loading={loading}
            error=""
          />
          <MovieRow
            title="Global TV — hits + Korea, Japan &amp; Spain"
            items={globalTv}
            loading={loading}
            error=""
          />
        </>
      ) : (
        genreSections.map((section) => (
          <MovieRow
            key={section.key}
            title={`${BROWSE_LANGUAGE_SLUGS[slug]} · ${section.title}`}
            items={section.items}
            loading={loading}
            error=""
          />
        ))
      )}
    </main>
  )
}
