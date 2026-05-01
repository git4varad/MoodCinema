export function detectMoodToGenre(text) {
  text = (text || '').toLowerCase()

  if (text.includes('sad') || text.includes('lonely') || text.includes('depressed')) {
    return ['drama', 'romance']
  }

  if (
    text.includes('happy') ||
    text.includes('fun') ||
    text.includes('chill') ||
    text.includes('comedy') ||
    text.includes('funny') ||
    text.includes('laugh') ||
    text.includes('lol')
  ) {
    return ['comedy']
  }

  if (text.includes('love') || text.includes('crush') || text.includes('relationship')) {
    return ['romance']
  }

  if (text.includes('bored') || text.includes('thrill') || text.includes('exciting')) {
    return ['thriller', 'action']
  }

  if (text.includes('scared') || text.includes('horror')) {
    return ['horror']
  }

  if (text.includes('superhero') || text.includes('marvel') || text.includes('dc')) {
    return ['superhero']
  }

  if (text.includes('crime') || text.includes('detective') || text.includes('investigation')) {
    return ['crime', 'thriller']
  }

  return ['drama']
}
