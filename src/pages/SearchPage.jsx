import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { isKidsFamilyAnimationQuery, searchMoviesAndTVBroadened } from '../services/searchBroaden'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  return (
    <SearchPageInner
      key={searchParams.toString()}
      initialQuery={searchParams.get('q') ?? ''}
    />
  )
}

function SearchPageInner({ initialQuery }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const qParam = searchParams.get('q') ?? ''
  const active = Boolean(qParam.trim())

  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const value = qParam.trim()
    if (!value) return

    let cancelled = false
    const task = Promise.resolve().then(async () => {
      if (cancelled) return
      setLoading(true)
      setError('')
      try {
        const data = await searchMoviesAndTVBroadened(value)
        if (!cancelled) setResults(data.results || [])
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Search failed.')
          setResults([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })
    void task

    return () => {
      cancelled = true
    }
  }, [qParam])

  const runSearch = () => {
    const value = query.trim()
    if (value) setSearchParams({ q: value })
    else setSearchParams({})
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runSearch()
    }
  }

  const displayResults = active ? results : []
  const showLoading = active && loading
  const showError = active && error
  const showKidsHint = active && isKidsFamilyAnimationQuery(qParam)

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold text-white">Search Movies & TV</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Movies, shows, kids, animation, family…"
        className="mb-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-neutral-100 outline-none focus:border-red-500"
      />
      <p className="mb-6 text-sm text-neutral-500">
        Searches movies &amp; TV. For words like <span className="text-neutral-400">kids</span>,{' '}
        <span className="text-neutral-400">animation</span>, or{' '}
        <span className="text-neutral-400">family</span>, we also surface popular animation &amp;
        family titles.
      </p>
      {showKidsHint ? (
        <p className="mb-4 text-sm text-amber-200/90">
          Showing text matches plus popular animation &amp; family movies and TV.
        </p>
      ) : null}

      {showError ? <p className="mb-4 text-red-400">{error}</p> : null}
      {showLoading ? <p className="text-neutral-400">Loading...</p> : null}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {displayResults.map((item) => {
          const title = item.title || item.name || 'Untitled'
          return (
            <Link
              key={`${item.media_type}-${item.id}`}
              to={`/details/${item.media_type}/${item.id}`}
              className="overflow-hidden rounded-lg bg-neutral-900 transition hover:scale-105"
            >
              {item.poster_path ? (
                <img
                  src={`${IMAGE_BASE}${item.poster_path}`}
                  alt={title}
                  className="h-[260px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center bg-neutral-800 px-3 text-center text-xs text-neutral-400">
                  No Image
                </div>
              )}
              <div className="truncate px-2 py-2 text-sm text-neutral-200">{title}</div>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
