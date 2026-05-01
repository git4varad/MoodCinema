import { useState } from 'react'

function MoodInput({ onSearch }) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const value = input.trim()
      console.log('[MoodCinema] Mood input:', value)
      if (value) {
        onSearch(value)
      }
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your mood.. sad, happy, lonely"
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/40"
      />
    </div>
  )
}

export default MoodInput
