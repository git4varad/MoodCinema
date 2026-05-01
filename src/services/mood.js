function includesAny(text, keywords) {
  return keywords.some((word) => text.includes(word))
}

export function detectMoodToGenre(text) {
  const normalized = (text || '').toLowerCase()

  if (
    includesAny(normalized, [
      'sad',
      'lonely',
      'emotional',
      'drama',
      'cry',
      'tear',
      'deep',
      'serious',
    ])
  ) {
    return ['drama', 'romance']
  }

  if (includesAny(normalized, ['bored', 'thrill', 'thrill ride'])) {
    return ['thriller', 'action']
  }

  if (includesAny(normalized, ['happy', 'funny', 'laugh', 'lol', 'lmao'])) {
    return ['comedy']
  }

  const rules = [
    {
      keywords: ['action', 'fight', 'battle', 'war', 'explosive', 'fast', 'intense', 'adrenaline', 'hype'],
      genres: ['action', 'thriller'],
    },
    {
      keywords: ['thrill', 'suspense', 'edge', 'tense', 'nervous', 'gripping', 'dark twist', 'unexpected'],
      genres: ['thriller', 'mystery'],
    },
    {
      keywords: ['mystery', 'detective', 'clue', 'investigation', 'who did it', 'solve', 'case'],
      genres: ['mystery', 'crime'],
    },
    {
      keywords: ['scary', 'horror', 'fear', 'creepy', 'ghost', 'haunted', 'terrifying', 'jump scare', 'scared'],
      genres: ['horror', 'thriller'],
    },
    {
      keywords: ['love', 'romantic', 'relationship', 'crush', 'date', 'heart'],
      genres: ['romance', 'drama'],
    },
    {
      keywords: ['relax', 'chill', 'comfort', 'feel good', 'warm', 'cozy', 'peaceful'],
      genres: ['feel-good', 'comedy'],
    },
    {
      keywords: ['magic', 'fantasy', 'dragon', 'kingdom', 'myth', 'supernatural world'],
      genres: ['fantasy', 'adventure'],
    },
    {
      keywords: ['space', 'future', 'technology', 'ai', 'robot', 'alien', 'sci-fi'],
      genres: ['sci-fi', 'action'],
    },
    {
      keywords: ['adventure', 'journey', 'explore', 'quest', 'travel', 'treasure'],
      genres: ['adventure', 'action'],
    },
    {
      keywords: ['crime', 'gang', 'mafia', 'heist', 'robbery', 'underworld'],
      genres: ['crime', 'thriller'],
    },
    {
      keywords: ['learn', 'real', 'true story', 'documentary', 'facts', 'history'],
      genres: ['documentary', 'biography'],
    },
    {
      keywords: ['biography', 'biopic', 'real person', 'life story'],
      genres: ['biography', 'drama'],
    },
    {
      keywords: ['animated', 'cartoon', 'anime', 'pixar', 'kids'],
      genres: ['animation', 'family'],
    },
    {
      keywords: ['family', 'kids', 'wholesome', 'all ages'],
      genres: ['family', 'comedy'],
    },
    {
      keywords: ['romcom', 'rom-com'],
      genres: ['romantic comedy', 'comedy'],
    },
    {
      keywords: ['dark', 'disturbing', 'twisted', 'gritty'],
      genres: ['dark', 'psychological'],
    },
    {
      keywords: ['mind', 'psychological', 'brain', 'complex', 'thought'],
      genres: ['psychological', 'thriller'],
    },
    {
      keywords: ['superhero', 'marvel', 'dc', 'powers', 'hero', 'villain'],
      genres: ['superhero', 'action'],
    },
    {
      keywords: ['daily life', 'realistic', 'slow', 'life', 'ordinary'],
      genres: ['slice-of-life', 'drama'],
    },
    {
      keywords: ['sports', 'football', 'cricket', 'match', 'team', 'tournament'],
      genres: ['sports', 'drama'],
    },
    {
      keywords: ['music', 'songs', 'dance', 'musical'],
      genres: ['musical', 'romance'],
    },
    {
      keywords: ['army', 'war', 'soldier', 'battlefield'],
      genres: ['war', 'action'],
    },
    {
      keywords: ['history', 'period', 'ancient', 'past', 'king'],
      genres: ['historical', 'drama'],
    },
    {
      keywords: ['cowboy', 'wild west', 'gunslinger'],
      genres: ['western', 'action'],
    },
    {
      keywords: ['noir', 'detective dark', 'black and white crime'],
      genres: ['noir', 'mystery'],
    },
    {
      keywords: ['satire', 'parody', 'mock'],
      genres: ['satire', 'comedy'],
    },
    {
      keywords: ['teen', 'high school', 'college', 'youth'],
      genres: ['teen', 'romance'],
    },
    {
      keywords: ['survive', 'survival', 'alone', 'island', 'disaster'],
      genres: ['survival', 'thriller'],
    },
    {
      keywords: ['earthquake', 'tsunami', 'apocalypse', 'end of world'],
      genres: ['disaster', 'action'],
    },
    {
      keywords: ['zombie', 'undead', 'infection'],
      genres: ['zombie', 'horror'],
    },
    {
      keywords: ['fun', 'silly', 'goofy', 'light', 'cheerful', 'comedy'],
      genres: ['comedy'],
    },
  ]

  for (const rule of rules) {
    if (includesAny(normalized, rule.keywords)) {
      return rule.genres
    }
  }

  return ['drama']
}
