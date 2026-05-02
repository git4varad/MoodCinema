import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [draft, setDraft] = useState(null)

  const fromUrl =
    location.pathname === '/search'
      ? new URLSearchParams(location.search).get('q') ?? ''
      : ''

  const value = draft !== null ? draft : fromUrl

  const handleChange = (e) => {
    setDraft(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    setDraft(null)
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    else navigate('/search')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-3 transition hover:opacity-90"
        >
          <img
            src="/logo-outline.png"
            alt=""
            aria-hidden
            className="h-14 w-auto object-contain md:h-16"
          />
          <h1 className="text-transparent font-bold text-2xl tracking-wide [-webkit-text-stroke:1px_white] md:text-3xl">
            MoodCinema
          </h1>
        </Link>
        <div className="flex min-w-0 w-full flex-1 items-center justify-end gap-4 sm:w-auto sm:min-w-[280px] md:max-w-xl lg:max-w-2xl">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `shrink-0 text-sm ${isActive ? 'text-white' : 'text-neutral-300 hover:text-white'}`
            }
          >
            Home
          </NavLink>
          <form onSubmit={handleSubmit} className="relative min-w-0 flex-1">
            <input
              type="search"
              value={value}
              onChange={handleChange}
              placeholder="Search movies & TV..."
              className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pl-4 pr-11 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-red-500/70 focus:ring-2 focus:ring-red-500/35"
              aria-label="Search movies and TV"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Submit search"
            >
              <SearchIcon />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Navbar
