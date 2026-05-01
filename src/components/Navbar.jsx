import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-black/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold tracking-tight text-red-500">
          MoodCinema
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-white' : 'text-neutral-300 hover:text-white'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? 'text-white' : 'text-neutral-300 hover:text-white'
            }
          >
            Search
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
