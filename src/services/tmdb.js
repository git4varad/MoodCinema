const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

function buildUrl(path, params = {}) {
  const search = new URLSearchParams({
    api_key: API_KEY || '',
    ...params,
  })
  return `${BASE_URL}${path}?${search.toString()}`
}

async function request(path, params = {}) {
  const url = buildUrl(path, params)
  console.log('[TMDb] Request URL:', url)

  if (!API_KEY) {
    throw new Error('Missing TMDb API key. Set VITE_TMDB_API_KEY in .env.')
  }

  try {
    const res = await fetch(url)
    if (!res.ok) {
      const errorText = await res.text()
      console.error('[TMDb] HTTP Error:', res.status, errorText)
      throw new Error(`TMDb request failed with status ${res.status}`)
    }
    const data = await res.json()
    console.log('[TMDb] Response:', data)
    return data
  } catch (error) {
    console.error('[TMDb] Network/Error:', error)
    throw error
  }
}

function shuffle(array) {
  return [...array].sort(() => 0.5 - Math.random())
}

export async function fetchMoviesByGenre(
  genreId,
  type = 'movie',
  language = 'en',
) {
  const languageMap = {
    en: 'en-US',
    hi: 'en-US',
  }
  const endpoint = type === 'tv' ? '/discover/tv' : '/discover/movie'
  const genreParam = Array.isArray(genreId) ? genreId.join(',') : genreId
  const randomPage = Math.floor(Math.random() * 10) + 1
  const sort = 'popularity.desc'

  console.log('Random Page:', randomPage)
  console.log('Sort:', sort)

  if (language === 'hi') {
    const primaryData = await request(endpoint, {
      with_genres: genreParam,
      with_original_language: 'hi',
      region: 'IN',
      sort_by: 'popularity.desc',
      include_adult: false,
      page: 1,
      language: 'en-US',
    })

    if (!primaryData.results || primaryData.results.length === 0) {
      const fallbackData = await request(endpoint, {
        with_genres: genreParam,
        with_original_language: 'hi',
        region: 'IN',
        sort_by: 'popularity.desc',
        include_adult: false,
        page: 2,
        language: 'en-US',
      })
      return fallbackData.results || []
    }

    return primaryData.results || []
  }

  const params = {
    with_genres: genreParam,
    language: languageMap[language] || 'en-US',
    sort_by: sort,
    include_adult: false,
    page: randomPage,
  }

  const data = await request(endpoint, params)
  const filtered = (data.results || []).filter((item) => item.vote_count > 50)

  console.log('Language:', language)
  console.log('Total:', (data.results || []).length)
  console.log('Filtered:', filtered.length)

  return shuffle(filtered)
}

export async function searchMulti(query) {
  if (!query?.trim()) {
    return { results: [] }
  }
  return request('/search/multi', {
    query: query.trim(),
    include_adult: false,
    language: 'en-US',
    page: 1,
  })
}

export async function fetchById(id, type = 'movie') {
  return request(`/${type}/${id}`, { language: 'en-US' })
}

export async function fetchDetails(type, id) {
  return request(`/${type}/${id}`, { language: 'en-US' })
}

export async function fetchCredits(type, id) {
  return request(`/${type}/${id}/credits`, { language: 'en-US' })
}

export async function fetchVideos(type, id) {
  return request(`/${type}/${id}/videos`, { language: 'en-US' })
}
