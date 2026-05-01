import { useCallback, useEffect, useState } from 'react'
import MoodInput from '../components/MoodInput'
import MovieRow from '../components/MovieRow'
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

function Home() {
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [loadingRows, setLoadingRows] = useState(INITIAL_LOADING)
  const [rowErrors, setRowErrors] = useState(INITIAL_ERRORS)
  const [devPicks, setDevPicks] = useState([])
  const [extraHindi, setExtraHindi] = useState([])
  const [activeGenre, setActiveGenre] = useState('crime')
  const [currentMood, setCurrentMood] = useState('drama')
  const [marvelShows, setMarvelShows] = useState([])

  const dedupeById = (items) => {
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

  const handleMoodSearch = (text) => {
    const detectedGenres = detectMoodToGenre(text)
    const primaryMood = detectedGenres[0] || 'drama'
    console.log('[MoodCinema] Mood input:', text)
    console.log('[MoodCinema] Detected genre:', detectedGenres)
    setActiveGenre(primaryMood)
    setCurrentMood(primaryMood)
    loadRows([primaryMood])
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      setActiveGenre('crime')
      setCurrentMood('crime')
      loadRows(['crime'])
    }, 0)

    return () => clearTimeout(timerId)
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
        const marvelTvIds = [85271, 88396, 88329, 92749] // WandaVision, Falcon/Winter Soldier, Hawkeye, Moon Knight
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

  const featured =
    rows.enMovies[0] || rows.enTv[0] || rows.hiMovies[0] || rows.hiTv[0] || null
  const existingIds = new Set([
    ...rows.enMovies.map((m) => m.id),
    ...rows.enTv.map((m) => m.id),
    ...rows.hiMovies.map((m) => m.id),
    ...rows.hiTv.map((m) => m.id),
  ])
  const uniqueDevPicks = devPicks.filter((item) => !existingIds.has(item.id))
  const moodGenreToTmdb = {
    comedy: [35],
    romance: [10749, 18],
    thriller: [53],
    action: [28],
    crime: [80, 53],
    horror: [27, 53],
    drama: [18],
    'sci-fi': [878, 28],
    superhero: [28, 878],
  }

  const allowedHindiGenres = moodGenreToTmdb[activeGenre] || [18]
  const curatedHindiByMood = extraHindi.filter((movie) => {
    const genreIds = movie.genre_ids || []
    return allowedHindiGenres.some((genreId) => genreIds.includes(genreId))
  })

  const combinedHindi = [...rows.hiMovies, ...curatedHindiByMood]
  const uniqueHindi = dedupeById(combinedHindi)
  const finalHindiMovies = uniqueHindi.slice(0, 20)
  const finalEnglishTv =
    activeGenre === 'superhero'
      ? dedupeById([...marvelShows, ...rows.enTv])
      : rows.enTv
  const featuredTitle = featured?.title || featured?.name || 'MoodCinema Picks'
  const featuredOverview =
    featured?.overview || 'Discover curated titles picked based on your mood.'
  const featuredBackdrop = featured?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
    : null

  return (
    <main className="mx-auto w-full max-w-[1600px] pb-10">
      <section className="relative h-[60vh] w-full overflow-hidden bg-neutral-950">
        {featuredBackdrop ? (
          <img
            src={featuredBackdrop}
            className="h-full w-full object-cover"
            alt={featuredTitle}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-neutral-900 to-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-6 right-6 md:left-10">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            {featuredTitle}
          </h1>
          <p className="max-w-2xl text-sm text-gray-300 md:text-base">{featuredOverview}</p>
          <div className="mt-5 max-w-2xl">
            <MoodInput onSearch={handleMoodSearch} />
          </div>
        </div>
      </section>

      <MovieRow
        title="English Movies"
        items={rows.enMovies}
        loading={loadingRows.enMovies}
        error={rowErrors.enMovies}
      />
      <MovieRow
        title="English TV Shows"
        items={finalEnglishTv}
        loading={loadingRows.enTv}
        error={rowErrors.enTv}
      />
      <MovieRow
        title="Hindi Movies"
        items={finalHindiMovies}
        loading={loadingRows.hiMovies}
        error={rowErrors.hiMovies}
      />
      <MovieRow
        title="Hindi TV Shows"
        items={rows.hiTv}
        loading={loadingRows.hiTv}
        error={rowErrors.hiTv}
      />
      <section>
        <MovieRow
          title="⭐ Developer Picks for You"
          items={uniqueDevPicks}
          loading={false}
          error=""
        />
        <p className="px-6 text-sm text-gray-400">Curated based on your mood</p>
      </section>
    </main>
  )
}

export default Home
