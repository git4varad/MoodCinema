import { Link } from 'react-router-dom'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieCard({ item }) {
  const title = item.title || item.name || 'Untitled'
  const posterPath = item.poster_path
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie')

  return (
    <Link
      to={`/details/${type}/${item.id}`}
      className="group relative min-w-[12rem] max-w-[12rem] overflow-hidden rounded-lg transition duration-300"
    >
      {posterPath ? (
        <div className="relative">
          <img
            src={`${IMAGE_BASE}${posterPath}`}
            alt={title}
            className="h-[270px] w-48 rounded-lg object-cover shadow-lg transition duration-300 group-hover:z-10 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-lg bg-black/60 opacity-0 transition group-hover:opacity-100" />
        </div>
      ) : (
        <div className="flex h-[270px] w-48 items-center justify-center rounded-lg bg-neutral-800 px-3 text-center text-xs text-neutral-400">
          No Image
        </div>
      )}
      <div className="truncate pt-2 text-xs text-neutral-100 transition-transform duration-200 group-hover:scale-105">
        {title}
      </div>
    </Link>
  )
}

function LoadingCards() {
  return Array.from({ length: 8 }).map((_, index) => (
    <div
      key={index}
      className="min-w-[12rem] max-w-[12rem] animate-pulse"
    >
      <div className="h-[270px] w-48 rounded-lg bg-neutral-800" />
      <div className="m-2 h-3 rounded bg-neutral-700" />
    </div>
  ))
}

function MovieRow({ title, items = [], loading = false, error = '' }) {
  return (
    <section className="mt-8">
      <h2 className="mt-8 px-6 text-2xl font-semibold text-neutral-100">{title}</h2>
      {error ? (
        <p className="px-6 text-left text-sm text-red-400">{error}</p>
      ) : (
        <div className="scrollbar-hide flex gap-5 overflow-x-scroll px-6 pb-4 pt-3 scroll-smooth">
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
