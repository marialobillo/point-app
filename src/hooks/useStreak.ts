import { useEffect, useState } from 'react'
import { lastNDaysRange, listTasksInRange, todayLocalDate, TaskError } from '../lib/tasks'

const STREAK_WINDOW_DAYS = 60

function shiftDate(date: string, deltaDays: number): string {
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  d.setDate(d.getDate() + deltaDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function computeStreak(completedDates: Set<string>, today: string): number {
  let anchor = completedDates.has(today) ? today : shiftDate(today, -1)
  let streak = 0

  while (completedDates.has(anchor)) {
    streak += 1
    anchor = shiftDate(anchor, -1)
  }

  return streak
}

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { fromDate, toDate } = lastNDaysRange(STREAK_WINDOW_DAYS)
    const today = todayLocalDate()

    listTasksInRange(fromDate, toDate)
      .then((tasks) => {
        const completedDates = new Set(
          tasks.filter((t) => t.completed).map((t) => t.task_date),
        )
        setStreak(computeStreak(completedDates, today))
      })
      .catch((err) => setError(err instanceof TaskError ? err.message : 'Failed to load streak'))
      .finally(() => setLoading(false))
  }, [])

  return { streak, loading, error }
}
