import { NavLink } from 'react-router-dom'

const LANGUAGES = [
  { name: 'Global Hits', slug: 'global' },
  { name: 'English', slug: 'en' },
  { name: 'Hindi', slug: 'hi' },
  { name: 'Telugu', slug: 'te' },
  { name: 'Tamil', slug: 'ta' },
  { name: 'Kannada', slug: 'kn' },
]

export default function LanguageRow() {
  return (
    <div className="mt-6 px-6">
      <h2 className="mb-3 text-xl font-semibold text-neutral-100">Browse by Language</h2>

      <div className="scrollbar-hide flex gap-4 overflow-x-scroll pb-1">
        {LANGUAGES.map((lang) => (
          <NavLink
            key={lang.slug}
            to={`/browse/language/${lang.slug}`}
            className={({ isActive }) =>
              `min-w-[150px] shrink-0 rounded-lg p-4 text-center text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-black'
                  : 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700'
              }`
            }
          >
            {lang.name}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
