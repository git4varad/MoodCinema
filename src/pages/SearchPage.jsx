import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchMulti } from '../services/tmdb'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])

  const runSearch = async () => {
    const value = query.trim()
    if (!value) return
    setLoading(true)
    setError('')
    try {
      const data = await searchMulti(value)
      const filtered = (data.results || []).filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv',
      )
      setResults(filtered)
    } catch (err) {
      setError(err.message || 'Search failed.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runSearch()
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold text-white">Search Movies & TV</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search any movie or show..."
        className="mb-6 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-neutral-100 outline-none focus:border-red-500"
      />

      {error ? <p className="mb-4 text-red-400">{error}</p> : null}
      {loading ? <p className="text-neutral-400">Loading...</p> : null}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {results.map((item) => {
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

export default SearchPage
