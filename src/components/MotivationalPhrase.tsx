import { useEffect, useState } from 'react'
import './MotivationalPhrase.css'

const EXIT_DURATION_MS = 220

export interface ActivePhrase {
  text: string
  key: number
}

export function MotivationalPhrase({ phrase }: { phrase: ActivePhrase | null }) {
  const [displayedText, setDisplayedText] = useState<string | null>(null)
  const [displayedKey, setDisplayedKey] = useState<number | null>(null)
  const [prevKey, setPrevKey] = useState<number | null>(null)

  if (phrase && phrase.key !== prevKey) {
    setPrevKey(phrase.key)
    setDisplayedText(phrase.text)
    setDisplayedKey(phrase.key)
  } else if (!phrase && prevKey !== null) {
    setPrevKey(null)
  }

  useEffect(() => {
    if (!phrase && displayedText) {
      const timeout = setTimeout(() => setDisplayedText(null), EXIT_DURATION_MS)
      return () => clearTimeout(timeout)
    }
  }, [phrase, displayedText])

  if (!displayedText) return null

  return (
    <div
      key={displayedKey}
      className={`motivational-phrase${!phrase ? ' motivational-phrase--exiting' : ''}`}
      role="status"
    >
      {displayedText}
    </div>
  )
}
