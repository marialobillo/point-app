import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTasks } from '../hooks/useTasks'
import './TasksView.css'

export function TasksView() {
  const { tasks, loading, loadError, addError, taskErrors, addTask, completeTask } = useTasks()
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    setTitle('')
    if (trimmed) {
      addTask(trimmed)
    }
  }

  const points = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points, 0)

  return (
    <section className="tasks-view">
      <div className="tasks-view__points">{points} pts today</div>

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
                onChange={() => completeTask(task.id)}
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
