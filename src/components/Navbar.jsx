import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
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
