import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTasks } from '../hooks/useTasks'
import { pickRandomPhrase } from '../lib/motivationalPhrases'
import { MotivationalPhrase, type ActivePhrase } from './MotivationalPhrase'
import './TasksView.css'

const PHRASE_DISMISS_MS = 3500

interface ShownPhrase extends ActivePhrase {
  taskId: string
}

export function TasksView() {
  const { tasks, loading, loadError, addError, taskErrors, addTask, completeTask } = useTasks()
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
    <section className="tasks-view">
      <div className="tasks-view__points">{points} pts today</div>
      <MotivationalPhrase phrase={visiblePhrase} />

      <form className="tasks-view__quick-add" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a task and press Enter"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="New task title"
        />
      </form>
      {addError && <p className="tasks-view__error">{addError}</p>}

      {loading && <p className="tasks-view__empty">Loading today's tasks…</p>}
      {loadError && <p className="tasks-view__error">{loadError}</p>}

      {!loading && !loadError && tasks.length === 0 && (
        <p className="tasks-view__empty">No tasks yet today.</p>
      )}

      <ul className="tasks-view__list">
        {tasks.map((task) => (
          <li key={task.id} className="tasks-view__item">
            <label className="tasks-view__item-label">
              <input
                type="checkbox"
                checked={task.completed}
                disabled={task.completed}
                onChange={() => handleComplete(task.id)}
              />
              <span className={task.completed ? 'tasks-view__item-title--done' : ''}>
                {task.title}
              </span>
            </label>
            {taskErrors[task.id] && (
              <p className="tasks-view__error">{taskErrors[task.id]}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
