import { useState } from 'react'
import { useTaskHistory } from '../hooks/useTaskHistory'
import './HistoryView.css'

export function HistoryView() {
  const { days, loading, error } = useTaskHistory()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const selectedDay = days.find((d) => d.date === selectedDate) ?? days[0] ?? null

  return (
    <section className="history-view">
      <h2 className="history-view__title">History</h2>

      {loading && <p className="history-view__empty">Loading history…</p>}
      {error && <p className="history-view__error">{error}</p>}

      {!loading && !error && days.length === 0 && (
        <p className="history-view__empty">No history yet.</p>
      )}

      {days.length > 0 && (
        <div className="history-view__layout">
          <ul className="history-view__days">
            {days.map((day) => (
              <li key={day.date}>
                <button
                  type="button"
                  className={
                    day.date === (selectedDay?.date ?? days[0].date)
                      ? 'history-view__day-button history-view__day-button--selected'
                      : 'history-view__day-button'
                  }
                  onClick={() => setSelectedDate(day.date)}
                >
                  {day.date}
                </button>
              </li>
            ))}
          </ul>

          {selectedDay && (
            <div className="history-view__day-detail">
              <div className="history-view__day-total">{selectedDay.totalPoints} pts</div>
              <ul className="history-view__task-list">
                {selectedDay.tasks.map((task) => (
                  <li key={task.id} className="history-view__task">
                    <span className={task.completed ? 'history-view__task-title--done' : ''}>
                      {task.title}
                    </span>
                    <span className="history-view__task-points">{task.points} pts</span>
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
