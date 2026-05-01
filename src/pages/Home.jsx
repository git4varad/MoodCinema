import { useEffect, useState } from 'react'
import MoodInput from '../components/MoodInput'
import MovieRow from '../components/MovieRow'
import { GENRE_MAP } from '../services/genres'
import { detectMoodToGenre } from '../services/mood'
import { fetchMoviesByGenre } from '../services/tmdb'

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

  const loadRows = async (genre) => {
    const genreId = GENRE_MAP[genre] || GENRE_MAP.drama
    console.log('[MoodCinema] Selected genre:', genre)
    setLoadingRows({
      enMovies: true,
      enTv: true,
      hiMovies: true,
      hiTv: true,
    })
    setRowErrors(INITIAL_ERRORS)

    const calls = [
      fetchMoviesByGenre(genreId, 'movie', 'en'),
      fetchMoviesByGenre(genreId, 'tv', 'en'),
      fetchMoviesByGenre(genreId, 'movie', 'hi'),
      fetchMoviesByGenre(genreId, 'tv', 'hi'),
    ]

    const [enMovies, enTv, hiMovies, hiTv] = await Promise.allSettled(calls)

    setRows({
      enMovies: enMovies.status === 'fulfilled' ? enMovies.value.results || [] : [],
      enTv: enTv.status === 'fulfilled' ? enTv.value.results || [] : [],
      hiMovies: hiMovies.status === 'fulfilled' ? hiMovies.value.results || [] : [],
      hiTv: hiTv.status === 'fulfilled' ? hiTv.value.results || [] : [],
    })

    setRowErrors({
      enMovies:
        enMovies.status === 'rejected' ? 'Could not load English movies.' : '',
      enTv: enTv.status === 'rejected' ? 'Could not load English TV shows.' : '',
      hiMovies: hiMovies.status === 'rejected' ? 'Could not load Hindi movies.' : '',
      hiTv: hiTv.status === 'rejected' ? 'Could not load Hindi web series.' : '',
    })

    setLoadingRows(INITIAL_LOADING)
  }

  const handleMoodSearch = (text) => {
    const detected = detectMoodToGenre(text)
    console.log('[MoodCinema] Mood input:', text)
    console.log('[MoodCinema] Detected genre:', detected)
    loadRows(detected)
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadRows('crime')
    }, 0)

    return () => clearTimeout(timerId)
  }, [])

  return (
    <main className="mx-auto w-full max-w-7xl px-2 py-10">
      <section className="mb-4 flex flex-col items-center px-2">
        <h1 className="mb-6 text-center text-4xl font-bold text-white md:text-6xl">
          What are you in the mood for?
        </h1>
        <MoodInput onSearch={handleMoodSearch} />
      </section>

      <MovieRow
        title="English Movies"
        items={rows.enMovies}
        loading={loadingRows.enMovies}
        error={rowErrors.enMovies}
      />
      <MovieRow
        title="English TV Shows"
        items={rows.enTv}
        loading={loadingRows.enTv}
        error={rowErrors.enTv}
      />
      <MovieRow
        title="Hindi Movies"
        items={rows.hiMovies}
        loading={loadingRows.hiMovies}
        error={rowErrors.hiMovies}
      />
      <MovieRow
        title="Hindi TV Shows"
        items={rows.hiTv}
        loading={loadingRows.hiTv}
        error={rowErrors.hiTv}
      />
    </main>
  )
}

export default Home
