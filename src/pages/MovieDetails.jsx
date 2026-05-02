import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDetails, getSeasonDetails } from '../services/tmdb'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
const PROFILE_BASE = 'https://image.tmdb.org/t/p/w200'

function BackIconButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800/90 text-white shadow-lg ring-1 ring-white/10 transition hover:bg-neutral-700 hover:text-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden
      >
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>
    </button>
  )
}

function MovieDetails() {
  const navigate = useNavigate()
  const { type, id } = useParams()

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }
  const [details, setDetails] = useState(null)
  const [seasonData, setSeasonData] = useState(null)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const detailsData = await getDetails(id, type)
        setDetails(detailsData)
        setSelectedSeason(1)
        setExpanded(false)
        setSeasonData(null)
      } catch (err) {
        setError(err.message || 'Could not load details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [type, id])

  useEffect(() => {
    const loadSeason = async () => {
      if (type !== 'tv' || !id || !selectedSeason) return
      try {
        const data = await getSeasonDetails(id, selectedSeason)
        setSeasonData(data)
      } catch (err) {
        console.error('[MoodCinema] Season details error:', err)
        setSeasonData(null)
      }
    }
    loadSeason()
  }, [type, id, selectedSeason])

  const trailer = useMemo(
    () =>
      (details?.videos?.results || []).find(
        (video) => video.site === 'YouTube' && video.type.toLowerCase() === 'trailer',
      ),
    [details],
  )

  const cast = useMemo(
    () => details?.credits?.cast?.slice(0, 10) || [],
    [details],
  )
  const providers =
    details?.['watch/providers']?.results?.IN?.flatrate ||
    details?.['watch/providers']?.results?.US?.flatrate ||
    []
  const validEpisodes = seasonData?.episodes || []
  const expectedEpisodeCount =
    details?.seasons?.find((season) => season.season_number === selectedSeason)
      ?.episode_count || seasonData?.episode_count || 0
  const sortedEpisodes = [...validEpisodes].sort(
    (a, b) => (a.episode_number || 0) - (b.episode_number || 0),
  )
  const detailedOverview = useMemo(() => {
    const baseOverview = details?.overview?.trim() || ''
    const title = details?.title || details?.name || 'This story'
    const firstSentence = baseOverview.split('. ')[0] || ''

    if (!baseOverview) {
      return 'No detailed storyline available for this title.'
    }

    if (baseOverview.length >= 520) {
      return baseOverview
    }

    return `${baseOverview} In this storyline, ${title} develops beyond its surface premise and explores the motivations of the central characters in greater depth. ${firstSentence ? `Starting from ${firstSentence.toLowerCase()},` : 'As events progress,'} the narrative grows through emotional turns, difficult choices, and shifting relationships that continuously raise the stakes. The plot builds momentum through conflict and consequence, creating a layered journey where each decision changes what follows. By the later arc, the story becomes more intense and character-driven, delivering a payoff that connects the personal and larger world around the protagonists.`
  }, [details])

  useEffect(() => {
    if (!details?.number_of_seasons || !seasonData) return
    if (expectedEpisodeCount > 0 && validEpisodes.length < expectedEpisodeCount) {
      console.warn('Incomplete season data:', selectedSeason)
    }
  }, [details, seasonData, expectedEpisodeCount, validEpisodes.length, selectedSeason])

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <BackIconButton onClick={goBack} />
        <p className="text-neutral-300">Loading details...</p>
      </main>
    )
  }

  if (error || !details) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <BackIconButton onClick={goBack} />
        <p className="text-red-400">{error || 'No details found.'}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <BackIconButton onClick={goBack} />
      {details.backdrop_path ? (
        <img
          src={`${IMAGE_BASE.replace('/w500', '/original')}${details.backdrop_path}`}
          alt={details.title || details.name}
          className="mb-6 h-[300px] w-full rounded-xl object-cover"
        />
      ) : null}

      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div>
          {details.poster_path ? (
            <img
              src={`${IMAGE_BASE}${details.poster_path}`}
              alt={details.title || details.name}
              className="w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-xl bg-neutral-800 text-neutral-300">
              No Poster
            </div>
          )}
        </div>
        <div className="rounded-xl bg-gradient-to-t from-black via-neutral-900 to-black p-6">
          <h1 className="mb-2 text-3xl font-bold text-white">
            {details.title || details.name}
          </h1>

          {details.tagline ? (
            <p className="mt-2 italic text-gray-400">{details.tagline}</p>
          ) : null}

          <div className="mt-4 max-w-3xl">
            <p className="text-sm leading-relaxed text-gray-300">
              {expanded
                ? detailedOverview
                : `${detailedOverview.slice(0, 460)}${detailedOverview.length > 460 ? '...' : ''}`}
            </p>
            {detailedOverview.length > 460 ? (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 text-sm text-blue-400"
              >
                {expanded ? 'Show Less' : 'Read More'}
              </button>
            ) : null}
          </div>

          <div className="mt-5 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
              Title Details
            </h2>
            <div className="mt-2 space-y-1 text-sm text-gray-400">
              <p>
                Genre:{' '}
                {(details.genres || []).map((genre) => genre.name).join(', ') || 'N/A'}
              </p>
              <p>
                Runtime:{' '}
                {details.runtime || details.episode_run_time?.[0]
                  ? `${details.runtime || details.episode_run_time?.[0]} mins`
                  : 'N/A'}
              </p>
              <p>
                Release Date:{' '}
                {details.release_date || details.first_air_date || 'N/A'}
              </p>
            </div>
          </div>

          {details.number_of_seasons ? (
            <div className="mb-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
              <h2 className="text-xl font-semibold text-white">TV Details</h2>
              <p className="mt-2 text-sm text-neutral-300">
                Seasons: {details.number_of_seasons}
              </p>
              <p className="text-sm text-neutral-300">
                Episodes: {details.number_of_episodes}
              </p>
            </div>
          ) : null}

          {trailer ? (
            <div className="mb-8">
              <h2 className="mb-2 text-lg font-semibold text-white">Trailer</h2>
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  title="Trailer"
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">Trailer not available.</p>
          )}

          <h2 className="mt-6 text-xl font-semibold text-white">Where to Watch</h2>
          <div className="mt-3 flex gap-4">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <div
                  key={provider.provider_id}
                  className="rounded-lg bg-neutral-900 p-2"
                  title={provider.provider_name}
                >
                  <img
                    src={`${PROFILE_BASE}${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-400">Watch provider info not available.</p>
            )}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Cast</h2>
        <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
          {cast.length > 0 ? (
            cast.map((actor) => (
              <div key={actor.id} className="min-w-24 text-center">
                <img
                  src={
                    actor.profile_path
                      ? `${PROFILE_BASE}${actor.profile_path}`
                      : 'https://via.placeholder.com/150?text=No+Image'
                  }
                  alt={actor.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
                <p className="mt-2 text-xs text-neutral-200">{actor.name}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-400">Cast not available.</p>
          )}
        </div>
      </section>

      {details.number_of_seasons ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Season {selectedSeason} ({validEpisodes.length} episodes)
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: details.number_of_seasons }).map((_, index) => {
              const seasonNumber = index + 1
              return (
                <button
                  key={seasonNumber}
                  type="button"
                  onClick={() => setSelectedSeason(seasonNumber)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selectedSeason === seasonNumber
                      ? 'border-white bg-white text-black'
                      : 'border-neutral-600 text-neutral-300'
                  }`}
                >
                  Season {seasonNumber}
                </button>
              )
            })}
          </div>

          <div className="mt-4 space-y-4">
            {sortedEpisodes.length ? (
              sortedEpisodes.map((ep) => (
                <div key={ep.id} className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
                  <h3 className="font-semibold text-white">
                    {ep.episode_number}. {ep.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-300">
                    {ep.overview || 'No episode overview available.'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-400">Episode details not available.</p>
            )}
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default MovieDetails
