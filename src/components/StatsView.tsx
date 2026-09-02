import { useState } from 'react'
import { useTaskStats } from '../hooks/useTaskStats'
import type { StatsPeriod } from '../lib/tasks'

const PERIODS: { value: StatsPeriod; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

export function StatsView() {
  const [period, setPeriod] = useState<StatsPeriod>('week')
  const { completedCount, totalPoints, loading, error } = useTaskStats(period)

  return (
    <section className="mx-auto w-full max-w-lg px-6 py-12 text-ink">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink">Stats</h2>

      <div className="flex gap-1 rounded-md bg-surface p-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            disabled={period === p.value}
            className={
              period === p.value
                ? 'flex-1 rounded px-3 py-1.5 text-sm font-semibold text-bg bg-mint'
                : 'flex-1 rounded px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink'
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-6 text-sm text-ink-muted">Loading stats…</p>}
      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-md bg-surface px-4 py-3">
            <div className="text-2xl font-semibold text-ink">{completedCount}</div>
            <div className="text-sm text-ink-muted">tasks completed</div>
          </div>
          <div className="rounded-md bg-surface px-4 py-3">
            <div className="text-2xl font-semibold text-amber">{totalPoints}</div>
            <div className="text-sm text-ink-muted">points earned</div>
          </div>
        </div>
      )}
    </section>
  )
}
