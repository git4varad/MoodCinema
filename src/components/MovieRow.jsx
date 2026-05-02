import { useRef } from 'react'
import { Link } from 'react-router-dom'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieCard({ item }) {
  const title = item.title || item.name || 'Untitled'
  const posterPath = item.poster_path
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie')
  const dateStr = item.release_date || item.first_air_date || ''
  const year = dateStr ? String(dateStr).slice(0, 4) : ''
  const rating =
    typeof item.vote_average === 'number' && item.vote_average > 0
      ? item.vote_average.toFixed(1)
      : null

  return (
    <Link
      to={`/details/${type}/${item.id}`}
      aria-label={title}
      className="group/card relative z-0 block min-w-[12rem] max-w-[12rem] shrink-0 hover:z-30 focus-visible:z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <div
        className="origin-center transform-gpu rounded-lg [transform-style:preserve-3d] transition-[transform,box-shadow] duration-300 ease-out group-hover/card:[transform:translate3d(0,0,3.5rem)_scale(1.1)] group-hover/card:shadow-[0_24px_60px_-8px_rgba(0,0,0,0.9)] group-focus-within/card:[transform:translate3d(0,0,3.5rem)_scale(1.1)] group-focus-within/card:shadow-[0_24px_60px_-8px_rgba(0,0,0,0.9)]"
      >
        {posterPath ? (
          <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10 shadow-xl shadow-black/50">
            <img
              src={`${IMAGE_BASE}${posterPath}`}
              alt=""
              className="h-[270px] w-48 rounded-lg object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent" />
            {rating ? (
              <div className="absolute right-2 top-2 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-amber-300 shadow-sm ring-1 ring-white/10">
                ★ {rating}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex h-[270px] w-48 items-center justify-center rounded-lg bg-neutral-800 px-3 text-center text-xs text-neutral-400 ring-1 ring-white/10">
            No Image
          </div>
        )}
        <div className="space-y-1 pt-2.5">
          <div className="line-clamp-2 text-sm font-medium leading-snug text-neutral-50">{title}</div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
            {year ? <span className="tabular-nums">{year}</span> : null}
            <span className="rounded border border-white/15 bg-white/5 px-1.5 py-px font-medium uppercase tracking-wide text-neutral-400">
              {type === 'tv' ? 'Series' : 'Film'}
            </span>
          </div>
        </div>
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
  const rowRef = useRef(null)

  const scrollLeft = () => {
    rowRef.current?.scrollBy({
      left: -500,
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    rowRef.current?.scrollBy({
      left: 500,
      behavior: 'smooth',
    })
  }

  return (
    <section className="mt-8">
      <h2 className="mt-8 px-6 text-2xl font-semibold text-neutral-100">{title}</h2>
      {error ? (
        <p className="px-6 text-left text-sm text-red-400">{error}</p>
      ) : (
        <div className="group/row relative">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll row left"
            className="absolute left-0 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white opacity-0 transition hover:bg-black group-hover/row:opacity-100"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll row right"
            className="absolute right-0 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white opacity-0 transition hover:bg-black group-hover/row:opacity-100"
          >
            ▶
          </button>
          <div
            ref={rowRef}
            className="relative z-0 scrollbar-hide flex gap-5 overflow-x-scroll px-6 pb-10 pt-6 scroll-smooth perspective-[1200px]"
          >
            {loading ? <LoadingCards /> : items.map((item) => <MovieCard key={item.id} item={item} />)}
            {!loading && items.length === 0 ? (
              <p className="py-10 text-sm text-neutral-400">No results found.</p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}

export default MovieRow
