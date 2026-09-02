import { useEffect, useRef, useState } from 'react'

export function EditablePoints({
  points,
  onSave,
}: {
  points: number
  onSave: (points: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(points))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function startEditing() {
    setDraft(String(points))
    setEditing(true)
  }

  function commit() {
    const parsed = Number(draft)
    if (draft.trim() !== '' && Number.isFinite(parsed) && parsed !== points) {
      onSave(parsed)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          } else if (e.key === 'Escape') {
            setEditing(false)
          }
        }}
        className="w-16 rounded bg-bg px-2 py-1 text-sm text-ink outline outline-1 -outline-offset-1 outline-amber focus:outline-2"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      aria-label={`Edit points, currently ${points}`}
      className="rounded px-2 py-1 text-sm font-medium text-ink-muted hover:bg-bg hover:text-amber"
    >
      {points} pts
    </button>
  )
}