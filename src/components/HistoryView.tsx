import { useState } from 'react'
import { useTaskHistory } from '../hooks/useTaskHistory'
import './HistoryView.css'

export function HistoryView() {
  const { days, loading, error } = useTaskHistory()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const selectedDay = days.find((d) => d.date === selectedDate) ?? days[0] ?? null

  return (
    <section className="mx-auto w-full max-w-lg px-6 py-12 text-ink">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink">History</h2>

      {loading && <p className="text-sm text-ink-muted">Loading history…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && days.length === 0 && (
        <p className="text-sm text-ink-muted">No history yet.</p>
      )}

      {days.length > 0 && (
        <div className="flex gap-6">
          <ul className="flex w-32 flex-shrink-0 flex-col gap-1">
            {days.map((day) => (
              <li key={day.date}>
                <button
                  type="button"
                  onClick={() => setSelectedDate(day.date)}
                  className={
                    day.date === (selectedDay?.date ?? days[0].date)
                      ? 'w-full rounded-md bg-mint px-3 py-1.5 text-left text-sm font-semibold text-bg'
                      : 'w-full rounded-md px-3 py-1.5 text-left text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink'
                  }
                >
                  {day.date}
                </button>
              </li>
            ))}
          </ul>

          {selectedDay && (
            <div className="flex-1">
              <div className="mb-3 text-lg font-semibold text-amber">
                {selectedDay.totalPoints} pts
              </div>
              <ul className="space-y-2">
                {selectedDay.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm"
                  >
                    <span className={task.completed ? 'text-ink-muted line-through' : 'text-ink'}>
                      {task.title}
                    </span>
                    <span className="text-ink-muted">{task.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
