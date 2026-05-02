import { useEffect, useState } from 'react'
import LanguageRow from '../components/LanguageRow'
import MoodInput from '../components/MoodInput'
import MovieRow from '../components/MovieRow'
import { useHomeBrowse } from '../context/HomeBrowseContext'
import { devMovies, devTV } from '../services/devCorner'
import { fetchById } from '../services/tmdb'

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

function Home() {
  const {
    rows,
    loadingRows,
    rowErrors,
    extraHindi,
    activeGenre,
    marvelShows,
    handleMoodSearch,
  } = useHomeBrowse()

  const [devCorner, setDevCorner] = useState([])
  const [devCornerLoading, setDevCornerLoading] = useState(true)
  const [devCornerError, setDevCornerError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDevCorner() {
      setDevCornerLoading(true)
      setDevCornerError('')
      try {
        const movieResults = await Promise.all(
          devMovies.map((id) => fetchById(id, 'movie')),
        )
        const tvResults = await Promise.all(devTV.map((id) => fetchById(id, 'tv')))
        const movies = movieResults
          .filter((item) => item?.id)
          .map((m) => ({ ...m, media_type: 'movie' }))
        const tv = tvResults
          .filter((item) => item?.id)
          .map((t) => ({ ...t, media_type: 'tv' }))
        if (!cancelled) {
          setDevCorner([...movies, ...tv])
        }
      } catch (err) {
        if (!cancelled) {
          setDevCornerError(err.message || 'Could not load Developer Corner.')
          setDevCorner([])
        }
      } finally {
        if (!cancelled) setDevCornerLoading(false)
      }
    }

    loadDevCorner()
    return () => {
      cancelled = true
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
  const uniqueDevCorner = devCorner.filter((item) => !existingIds.has(item.id))
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
      <LanguageRow />
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
      <section className="mt-10 border-t border-gray-800 pt-4">
        <MovieRow
          title="🔥 Developer Corner"
          items={uniqueDevCorner}
          loading={devCornerLoading}
          error={devCornerError}
        />
        <p className="px-6 text-sm text-gray-400">
          Marvel, Investigation &amp; Personal Picks
        </p>
      </section>
    </main>
  )
}

export default Home
