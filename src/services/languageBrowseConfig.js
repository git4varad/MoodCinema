/** Curated TMDb titles for Global Hits (international / streaming phenomena). Verified movie/TV IDs. */
export const GLOBAL_HIT_MOVIE_IDS = [
  496243, // Parasite
  27205, // Inception
  157336, // Interstellar
  155, // The Dark Knight
  438631, // Dune (2021)
  603, // The Matrix (1999)
]

export const GLOBAL_HIT_TV_IDS = [
  110492, // Squid Game
  71446, // Money Heist
  66732, // Stranger Things
  96159, // Crash Landing on You
  69478, // Kingdom
  96580, // All of Us Are Dead
  70523, // Dark
]

/**
 * Genre strips: varied sort + page so regional rows aren't identical;
 * client still filters by genre_ids for precision.
 */
export const LANGUAGE_GENRE_ROWS = [
  { title: 'Action', genreId: 28, sortBy: 'popularity.desc', page: 1 },
  { title: 'Drama', genreId: 18, sortBy: 'vote_average.desc', page: 1 },
  { title: 'Comedy', genreId: 35, sortBy: 'primary_release_date.desc', page: 1 },
  { title: 'Thriller', genreId: 53, sortBy: 'popularity.desc', page: 2 },
  { title: 'Romance', genreId: 10749, sortBy: 'vote_count.desc', page: 1 },
]

export const BROWSE_LANGUAGE_SLUGS = {
  global: 'Global Hits',
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  kn: 'Kannada',
}

export function getBrowseTitle(slug) {
  return BROWSE_LANGUAGE_SLUGS[slug] || 'Browse'
}

export function isValidBrowseSlug(slug) {
  return Object.prototype.hasOwnProperty.call(BROWSE_LANGUAGE_SLUGS, slug)
}
