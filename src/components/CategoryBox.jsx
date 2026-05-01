const GENRE_OPTIONS = ['action', 'comedy', 'drama', 'romance', 'thriller', 'horror']

function CategoryBox({ activeGenre, onSelectGenre }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {GENRE_OPTIONS.map((genre) => {
        const active = activeGenre === genre
        return (
          <button
            key={genre}
            type="button"
            onClick={() => onSelectGenre(genre)}
            className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${
              active
                ? 'border-red-500 bg-red-500 text-white'
                : 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:border-neutral-400'
            }`}
          >
            {genre}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryBox
