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
      <span className="editable-points">
        <input
          ref={inputRef}
          type="number"
          className="editable-points__input"
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
        />
      </span>
    )
  }

  return (
    <button
      type="button"
      className="editable-points__value"
      onClick={startEditing}
      aria-label={`Edit points, currently ${points}`}
    >
      {points} pts
    </button>
  )
}
