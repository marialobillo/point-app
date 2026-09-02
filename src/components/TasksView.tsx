import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useStreak } from '../hooks/useStreak'
import { useTasks } from '../hooks/useTasks'
import { pickRandomPhrase } from '../lib/motivationalPhrases'
import { EditablePoints } from './EditablePoints'
import { MotivationalPhrase, type ActivePhrase } from './MotivationalPhrase'
import './TasksView.css'

const PHRASE_DISMISS_MS = 3500

interface ShownPhrase extends ActivePhrase {
  taskId: string
}

export function TasksView() {
  const { tasks, loading, loadError, addError, taskErrors, addTask, completeTask, editPoints } =
    useTasks()
  const { streak } = useStreak()
  const [title, setTitle] = useState('')
  const [shownPhrase, setShownPhrase] = useState<ShownPhrase | null>(null)
  const phraseKeyRef = useRef(0)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    setTitle('')
    if (trimmed) {
      addTask(trimmed)
    }
  }

  function handleComplete(taskId: string) {
    completeTask(taskId)
    phraseKeyRef.current += 1
    setShownPhrase({ text: pickRandomPhrase(), key: phraseKeyRef.current, taskId })
  }

  // Resets on every new completion (new `shownPhrase` object) and on unmount,
  // since the cleanup cancels whichever timeout belongs to the previous phrase.
  useEffect(() => {
    if (!shownPhrase) return
    const timeout = setTimeout(() => setShownPhrase(null), PHRASE_DISMISS_MS)
    return () => clearTimeout(timeout)
  }, [shownPhrase])

  // Never show a phrase for a completion that failed and reverted, without
  // touching useTasks.ts — this only reads its already-exposed taskErrors.
  const visiblePhrase =
    shownPhrase && !taskErrors[shownPhrase.taskId] ? shownPhrase : null

  const points = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points, 0)

  return (
    <section className="mx-auto w-full max-w-lg min-h-screen bg-bg px-6 py-12 text-ink">
    <div className="mb-6 flex items-center justify-between">
      <div className="text-2xl font-semibold tracking-tight text-ink">{points} pts today</div>
      <div className="text-sm font-medium text-amber">
        {streak} day{streak === 1 ? '' : 's'} streak
      </div>
    </div>

    <MotivationalPhrase phrase={visiblePhrase} />

    <form className="mt-6" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a task and press Enter"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="New task title"
        className="block w-full rounded-md bg-surface px-3 py-2 text-ink outline outline-1 -outline-offset-1 outline-amber/30 placeholder:text-ink-muted focus:outline-2 focus:-outline-offset-2 focus:outline-amber sm:text-sm"
      />
    </form>
    {addError && <p className="mt-2 text-sm text-red-400">{addError}</p>}

    {loading && <p className="mt-6 text-sm text-ink-muted">Loading today's tasks…</p>}
    {loadError && <p className="mt-6 text-sm text-red-400">{loadError}</p>}

    {!loading && !loadError && tasks.length === 0 && (
      <p className="mt-6 text-sm text-ink-muted">No tasks yet today.</p>
    )}

    <ul className="mt-6 space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between gap-3 rounded-md bg-surface px-3 py-2"
        >
          <label className="flex flex-1 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={task.completed}
              disabled={task.completed}
              onChange={() => handleComplete(task.id)}
              className="h-4 w-4 rounded border-ink-muted bg-bg text-mint accent-mint focus:outline-2 focus:outline-amber disabled:opacity-60"
            />
            <span className={task.completed ? 'text-ink-muted line-through' : 'text-ink'}>
              {task.title}
            </span>
          </label>

          <EditablePoints
            points={task.points}
            onSave={(newPoints) => editPoints(task.id, newPoints)}
          />

          {taskErrors[task.id] && (
            <p className="text-xs text-red-400">{taskErrors[task.id]}</p>
          )}
        </li>
      ))}
    </ul>
  </section>
  )
}
