import { Link } from 'react-router-dom'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieCard({ item }) {
  const title = item.title || item.name || 'Untitled'
  const posterPath = item.poster_path
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie')

  return (
    <Link
      to={`/details/${type}/${item.id}`}
      className="group min-w-[160px] max-w-[160px] overflow-hidden rounded-lg bg-neutral-900 transition hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]"
    >
      {posterPath ? (
        <img
          src={`${IMAGE_BASE}${posterPath}`}
          alt={title}
          className="h-[240px] w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-[240px] w-full items-center justify-center bg-neutral-800 px-3 text-center text-xs text-neutral-400">
          No Image
        </div>
      )}
      <div className="truncate px-2 py-2 text-xs text-neutral-200 transition-transform duration-200 group-hover:scale-105">
        {title}
      </div>
    </Link>
  )
}

function LoadingCards() {
  return Array.from({ length: 8 }).map((_, index) => (
    <div
      key={index}
      className="min-w-[160px] max-w-[160px] animate-pulse overflow-hidden rounded-lg bg-neutral-900"
    >
      <div className="h-[240px] w-full bg-neutral-800" />
      <div className="m-2 h-3 rounded bg-neutral-700" />
    </div>
  ))
}

function MovieRow({ title, items = [], loading = false, error = '' }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 px-4 text-left text-xl font-semibold text-neutral-100">{title}</h2>
      {error ? (
        <p className="px-4 text-left text-sm text-red-400">{error}</p>
      ) : (
        <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-4 scroll-smooth">
          {loading ? <LoadingCards /> : items.map((item) => <MovieCard key={item.id} item={item} />)}
          {!loading && items.length === 0 ? (
            <p className="py-10 text-sm text-neutral-400">No results found.</p>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default MovieRow
