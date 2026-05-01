import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCredits, fetchDetails, fetchVideos } from '../services/tmdb'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieDetails() {
  const { type, id } = useParams()
  const [details, setDetails] = useState(null)
  const [cast, setCast] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [detailsData, creditsData, videosData] = await Promise.all([
          fetchDetails(type, id),
          fetchCredits(type, id),
          fetchVideos(type, id),
        ])
        setDetails(detailsData)
        setCast((creditsData.cast || []).slice(0, 10))
        setVideos(videosData.results || [])
      } catch (err) {
        setError(err.message || 'Could not load details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [type, id])

  const trailer = useMemo(
    () =>
      videos.find(
        (video) => video.site === 'YouTube' && video.type.toLowerCase() === 'trailer',
      ),
    [videos],
  )

  if (loading) {
    return <main className="px-4 py-10 text-neutral-300">Loading details...</main>
  }

  if (error || !details) {
    return <main className="px-4 py-10 text-red-400">{error || 'No details found.'}</main>
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
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
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            {details.title || details.name}
          </h1>
          <p className="mb-4 text-sm text-neutral-300">{details.overview || 'No overview available.'}</p>
          <p className="mb-2 text-sm text-neutral-200">
            <span className="font-semibold text-white">Rating:</span>{' '}
            {details.vote_average?.toFixed(1) || 'N/A'}
          </p>
          <p className="mb-4 text-sm text-neutral-200">
            <span className="font-semibold text-white">Genres:</span>{' '}
            {(details.genres || []).map((genre) => genre.name).join(', ') || 'N/A'}
          </p>

          <h2 className="mb-2 text-lg font-semibold text-white">Cast</h2>
          <p className="mb-6 text-sm text-neutral-300">
            {cast.length > 0 ? cast.map((person) => person.name).join(', ') : 'Cast not available.'}
          </p>

          {trailer ? (
            <div>
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
        </div>
      </div>
    </main>
  )
}

export default MovieDetails
