/* eslint-disable react-refresh/only-export-components -- context module exports Provider + hook */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { moodDevPicks } from '../services/devPicks'
import { GENRE_MAP } from '../services/genres'
import { hindiComedyIds, hindiPopularIds } from '../services/hindiPicks'
import { detectMoodToGenre } from '../services/mood'
import { fetchById, fetchMoviesByGenre } from '../services/tmdb'

const INITIAL_ROWS = {
  enMovies: [],
  enTv: [],
  hiMovies: [],
  hiTv: [],
}

const INITIAL_LOADING = {
  enMovies: false,
  enTv: false,
  hiMovies: false,
  hiTv: false,
}

const INITIAL_ERRORS = {
  enMovies: '',
  enTv: '',
  hiMovies: '',
  hiTv: '',
}

const HomeBrowseContext = createContext(null)

let crimeBootstrapScheduled = false

function dedupeById(items) {
  const unique = []
  const seen = new Set()
  for (const movie of items) {
    if (!seen.has(movie.id)) {
      seen.add(movie.id)
      unique.push(movie)
    }
  }
  return unique
}

export function HomeBrowseProvider({ children }) {
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [loadingRows, setLoadingRows] = useState(INITIAL_LOADING)
  const [rowErrors, setRowErrors] = useState(INITIAL_ERRORS)
  const [devPicks, setDevPicks] = useState([])
  const [extraHindi, setExtraHindi] = useState([])
  const [activeGenre, setActiveGenre] = useState('crime')
  const [currentMood, setCurrentMood] = useState('drama')
  const [marvelShows, setMarvelShows] = useState([])

  const loadRows = useCallback(async (genresInput) => {
    const genres = Array.isArray(genresInput) ? genresInput : [genresInput]
    console.log('Selected Genres:', genres)

    setLoadingRows({
      enMovies: true,
      enTv: true,
      hiMovies: true,
      hiTv: true,
    })
    setRowErrors(INITIAL_ERRORS)

    const getGenreIdsByType = (mediaType) => {
      const ids = genres.flatMap((genre) => {
        const typeSpecificKey = `${genre}_${mediaType}`
        const mapped =
          GENRE_MAP[typeSpecificKey] !== undefined
            ? GENRE_MAP[typeSpecificKey]
            : GENRE_MAP[genre]

        if (mapped === undefined) return []
        return Array.isArray(mapped) ? mapped : [mapped]
      })

      const unique = [...new Set(ids)]
      return unique.length > 0 ? unique : [GENRE_MAP.drama]
    }

    const fetchForRow = async (type, language) => {
      const genreIds = getGenreIdsByType(type)
      console.log(`Genre IDs (${type}/${language}):`, genreIds)
      const results = await Promise.all(
        genreIds.map((genreId) => fetchMoviesByGenre(genreId, type, language)),
      )
      const combined = results.flat()
      return dedupeById(combined)
    }

    const [enMovies, enTv, hiMovies, hiTv] = await Promise.allSettled([
      fetchForRow('movie', 'en'),
      fetchForRow('tv', 'en'),
      fetchForRow('movie', 'hi'),
      fetchForRow('tv', 'hi'),
    ])

    setRows({
      enMovies: enMovies.status === 'fulfilled' ? enMovies.value : [],
      enTv: enTv.status === 'fulfilled' ? enTv.value : [],
      hiMovies: hiMovies.status === 'fulfilled' ? hiMovies.value : [],
      hiTv: hiTv.status === 'fulfilled' ? hiTv.value : [],
    })

    setRowErrors({
      enMovies:
        enMovies.status === 'rejected' ? 'Could not load English movies.' : '',
      enTv: enTv.status === 'rejected' ? 'Could not load English TV shows.' : '',
      hiMovies: hiMovies.status === 'rejected' ? 'Could not load Hindi movies.' : '',
      hiTv: hiTv.status === 'rejected' ? 'Could not load Hindi web series.' : '',
    })

    setLoadingRows(INITIAL_LOADING)
  }, [])

  const handleMoodSearch = useCallback(
    (text) => {
      const detectedGenres = detectMoodToGenre(text)
      const primaryMood = detectedGenres[0] || 'drama'
      console.log('[MoodCinema] Mood input:', text)
      console.log('[MoodCinema] Detected genre:', detectedGenres)
      setActiveGenre(primaryMood)
      setCurrentMood(primaryMood)
      loadRows([primaryMood])
    },
    [loadRows],
  )

  useEffect(() => {
    if (crimeBootstrapScheduled) return
    crimeBootstrapScheduled = true
    setTimeout(() => {
      setActiveGenre('crime')
      setCurrentMood('crime')
      loadRows(['crime'])
    }, 0)
  }, [loadRows])

  useEffect(() => {
    let ignore = false

    async function loadDevPicks() {
      if (!currentMood) return

      try {
        const picks = moodDevPicks[currentMood] || moodDevPicks.drama
        if (!picks) return

        const movies = await Promise.all(
          picks.movies.map((id) => fetchById(id, 'movie')),
        )
        const tv = await Promise.all(picks.tv.map((id) => fetchById(id, 'tv')))

        if (!ignore) {
          const combined = [
            ...movies.map((item) => ({ ...item, media_type: 'movie' })),
            ...tv.map((item) => ({ ...item, media_type: 'tv' })),
          ]
          setDevPicks(combined)
        }
      } catch (error) {
        console.error('[MoodCinema] Dev picks load failed:', error)
        if (!ignore) {
          setDevPicks([])
        }
      }
    }

    loadDevPicks()

    return () => {
      ignore = true
    }
  }, [currentMood])

  useEffect(() => {
    let ignore = false

    async function loadHindiExtras() {
      try {
        const comedy = await Promise.allSettled(
          hindiComedyIds.map((id) => fetchById(id, 'movie')),
        )
        const popular = await Promise.allSettled(
          hindiPopularIds.map((id) => fetchById(id, 'movie')),
        )

        const resolvedComedy = comedy
          .filter((entry) => entry.status === 'fulfilled' && entry.value?.id)
          .map((entry) => ({ ...entry.value, media_type: 'movie' }))
        const resolvedPopular = popular
          .filter((entry) => entry.status === 'fulfilled' && entry.value?.id)
          .map((entry) => ({ ...entry.value, media_type: 'movie' }))

        const mergedExtras = [...resolvedComedy, ...resolvedPopular]
        console.log('[MoodCinema] Hindi curated fetched:', mergedExtras.length)

        if (!ignore) {
          setExtraHindi(mergedExtras)
        }
      } catch (error) {
        console.error('[MoodCinema] Hindi curated picks load failed:', error)
        if (!ignore) {
          setExtraHindi([])
        }
      }
    }

    loadHindiExtras()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadMarvelShows() {
      try {
        const marvelTvIds = [85271, 88396, 88329, 92749]
        const results = await Promise.allSettled(
          marvelTvIds.map((tvId) => fetchById(tvId, 'tv')),
        )
        const valid = results
          .filter((entry) => entry.status === 'fulfilled' && entry.value?.id)
          .map((entry) => ({ ...entry.value, media_type: 'tv' }))

        if (!ignore) {
          setMarvelShows(valid)
        }
      } catch (error) {
        console.error('[MoodCinema] Marvel shows load failed:', error)
        if (!ignore) {
          setMarvelShows([])
        }
      }
    }

    loadMarvelShows()

    return () => {
      ignore = true
    }
  }, [])

  const value = {
    rows,
    loadingRows,
    rowErrors,
    devPicks,
    extraHindi,
    activeGenre,
    currentMood,
    marvelShows,
    handleMoodSearch,
  }

  return (
    <HomeBrowseContext.Provider value={value}>{children}</HomeBrowseContext.Provider>
  )
}

export function useHomeBrowse() {
  const ctx = useContext(HomeBrowseContext)
  if (!ctx) {
    throw new Error('useHomeBrowse must be used within HomeBrowseProvider')
  }
  return ctx
}
