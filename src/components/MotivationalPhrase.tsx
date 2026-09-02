import { useEffect, useState } from 'react'

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
      role="status"
      className={
        phrase
          ? 'mt-4 animate-phrase-in rounded-md bg-mint px-3 py-2 text-sm font-medium text-bg'
          : 'mt-4 rounded-md bg-mint px-3 py-2 text-sm font-medium text-bg opacity-0 transition-all duration-[220ms] ease-out -translate-y-1'
      }
    >
      {displayedText}
    </div>
  )
}