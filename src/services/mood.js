export function detectMoodToGenre(text) {
  const normalized = (text || '').toLowerCase()

  // COMEDY
  if (
    normalized.includes('funny') ||
    normalized.includes('laugh') ||
    normalized.includes('lol') ||
    normalized.includes('comedy') ||
    normalized.includes('lmao') ||
    normalized.includes('fun') ||
    normalized.includes('silly') ||
    normalized.includes('goofy') ||
    normalized.includes('light') ||
    normalized.includes('cheerful')
  ) {
    return 'comedy'
  }

  // ACTION
  if (
    normalized.includes('action') ||
    normalized.includes('fight') ||
    normalized.includes('battle') ||
    normalized.includes('war') ||
    normalized.includes('explosive') ||
    normalized.includes('fast') ||
    normalized.includes('intense') ||
    normalized.includes('adrenaline') ||
    normalized.includes('hype') ||
    normalized.includes('thrill ride')
  ) {
    return 'action'
  }

  // THRILLER
  if (
    normalized.includes('thrill') ||
    normalized.includes('suspense') ||
    normalized.includes('edge') ||
    normalized.includes('tense') ||
    normalized.includes('nervous') ||
    normalized.includes('gripping') ||
    normalized.includes('dark twist') ||
    normalized.includes('unexpected')
  ) {
    return 'thriller'
  }

  // MYSTERY
  if (
    normalized.includes('mystery') ||
    normalized.includes('detective') ||
    normalized.includes('clue') ||
    normalized.includes('investigation') ||
    normalized.includes('who did it') ||
    normalized.includes('solve') ||
    normalized.includes('case')
  ) {
    return 'mystery'
  }

  // HORROR
  if (
    normalized.includes('scary') ||
    normalized.includes('horror') ||
    normalized.includes('fear') ||
    normalized.includes('creepy') ||
    normalized.includes('ghost') ||
    normalized.includes('haunted') ||
    normalized.includes('terrifying') ||
    normalized.includes('jump scare') ||
    normalized.includes('scared')
  ) {
    return 'horror'
  }

  // ROMANCE
  if (
    normalized.includes('love') ||
    normalized.includes('romantic') ||
    normalized.includes('relationship') ||
    normalized.includes('crush') ||
    normalized.includes('date') ||
    normalized.includes('heart')
  ) {
    return 'romance'
  }

  // DRAMA
  if (
    normalized.includes('sad') ||
    normalized.includes('lonely') ||
    normalized.includes('emotional') ||
    normalized.includes('drama') ||
    normalized.includes('cry') ||
    normalized.includes('tear') ||
    normalized.includes('deep') ||
    normalized.includes('serious')
  ) {
    return 'drama'
  }

  // FEEL-GOOD / COMFORT
  if (
    normalized.includes('relax') ||
    normalized.includes('chill') ||
    normalized.includes('comfort') ||
    normalized.includes('feel good') ||
    normalized.includes('warm') ||
    normalized.includes('cozy') ||
    normalized.includes('peaceful')
  ) {
    return 'feel-good'
  }

  // FANTASY
  if (
    normalized.includes('magic') ||
    normalized.includes('fantasy') ||
    normalized.includes('dragon') ||
    normalized.includes('kingdom') ||
    normalized.includes('myth') ||
    normalized.includes('supernatural world')
  ) {
    return 'fantasy'
  }

  // SCI-FI
  if (
    normalized.includes('space') ||
    normalized.includes('future') ||
    normalized.includes('technology') ||
    normalized.includes('ai') ||
    normalized.includes('robot') ||
    normalized.includes('alien') ||
    normalized.includes('sci-fi')
  ) {
    return 'sci-fi'
  }

  // ADVENTURE
  if (
    normalized.includes('adventure') ||
    normalized.includes('journey') ||
    normalized.includes('explore') ||
    normalized.includes('quest') ||
    normalized.includes('travel') ||
    normalized.includes('treasure')
  ) {
    return 'adventure'
  }

  // CRIME
  if (
    normalized.includes('crime') ||
    normalized.includes('gang') ||
    normalized.includes('mafia') ||
    normalized.includes('heist') ||
    normalized.includes('robbery') ||
    normalized.includes('underworld')
  ) {
    return 'crime'
  }

  // DOCUMENTARY
  if (
    normalized.includes('learn') ||
    normalized.includes('real') ||
    normalized.includes('true story') ||
    normalized.includes('documentary') ||
    normalized.includes('facts') ||
    normalized.includes('history')
  ) {
    return 'documentary'
  }

  // BIOPIC
  if (
    normalized.includes('biography') ||
    normalized.includes('biopic') ||
    normalized.includes('real person') ||
    normalized.includes('life story')
  ) {
    return 'biography'
  }

  // ANIMATION
  if (
    normalized.includes('animated') ||
    normalized.includes('cartoon') ||
    normalized.includes('anime') ||
    normalized.includes('pixar') ||
    normalized.includes('kids')
  ) {
    return 'animation'
  }

  // FAMILY
  if (
    normalized.includes('family') ||
    normalized.includes('kids') ||
    normalized.includes('wholesome') ||
    normalized.includes('all ages')
  ) {
    return 'family'
  }

  // ROM-COM
  if (
    normalized.includes('romcom') ||
    normalized.includes('rom-com') ||
    (normalized.includes('love') && normalized.includes('funny'))
  ) {
    return 'romantic comedy'
  }

  // DARK
  if (
    normalized.includes('dark') ||
    normalized.includes('disturbing') ||
    normalized.includes('twisted') ||
    normalized.includes('gritty')
  ) {
    return 'dark'
  }

  // PSYCHOLOGICAL
  if (
    normalized.includes('mind') ||
    normalized.includes('psychological') ||
    normalized.includes('brain') ||
    normalized.includes('complex') ||
    normalized.includes('thought')
  ) {
    return 'psychological'
  }

  // SUPERHERO
  if (
    normalized.includes('superhero') ||
    normalized.includes('marvel') ||
    normalized.includes('dc') ||
    normalized.includes('powers') ||
    normalized.includes('hero') ||
    normalized.includes('villain')
  ) {
    return 'superhero'
  }

  // SLICE OF LIFE
  if (
    normalized.includes('daily life') ||
    normalized.includes('realistic') ||
    normalized.includes('slow') ||
    normalized.includes('life') ||
    normalized.includes('ordinary')
  ) {
    return 'slice-of-life'
  }

  // SPORTS
  if (
    normalized.includes('sports') ||
    normalized.includes('football') ||
    normalized.includes('cricket') ||
    normalized.includes('match') ||
    normalized.includes('team') ||
    normalized.includes('tournament')
  ) {
    return 'sports'
  }

  // MUSICAL
  if (
    normalized.includes('music') ||
    normalized.includes('songs') ||
    normalized.includes('dance') ||
    normalized.includes('musical')
  ) {
    return 'musical'
  }

  // WAR
  if (
    normalized.includes('army') ||
    normalized.includes('war') ||
    normalized.includes('soldier') ||
    normalized.includes('battlefield')
  ) {
    return 'war'
  }

  // HISTORICAL
  if (
    normalized.includes('history') ||
    normalized.includes('period') ||
    normalized.includes('ancient') ||
    normalized.includes('past') ||
    normalized.includes('king')
  ) {
    return 'historical'
  }

  // WESTERN
  if (
    normalized.includes('cowboy') ||
    normalized.includes('wild west') ||
    normalized.includes('gunslinger')
  ) {
    return 'western'
  }

  // NOIR
  if (
    normalized.includes('noir') ||
    normalized.includes('detective dark') ||
    normalized.includes('black and white crime')
  ) {
    return 'noir'
  }

  // SATIRE
  if (
    normalized.includes('satire') ||
    normalized.includes('parody') ||
    normalized.includes('mock')
  ) {
    return 'satire'
  }

  // TEEN
  if (
    normalized.includes('teen') ||
    normalized.includes('high school') ||
    normalized.includes('college') ||
    normalized.includes('youth')
  ) {
    return 'teen'
  }

  // SURVIVAL
  if (
    normalized.includes('survive') ||
    normalized.includes('survival') ||
    normalized.includes('alone') ||
    normalized.includes('island') ||
    normalized.includes('disaster')
  ) {
    return 'survival'
  }

  // DISASTER
  if (
    normalized.includes('earthquake') ||
    normalized.includes('tsunami') ||
    normalized.includes('apocalypse') ||
    normalized.includes('end of world')
  ) {
    return 'disaster'
  }

  // ZOMBIE
  if (
    normalized.includes('zombie') ||
    normalized.includes('undead') ||
    normalized.includes('infection')
  ) {
    return 'zombie'
  }

  // default fallback
  return 'drama'
}
