'use client'

import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { useDayStore } from '@/lib/stores/dayStore'
import { useTaskStore } from '@/lib/stores/taskStore'
import { ENERGY_META } from '@/types'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TodayHeader() {
  const { today } = useDayStore()
  const { tasks } = useTaskStore()

  const currentEnergy = today?.energyLevel
  const meta = currentEnergy ? ENERGY_META[currentEnergy] : null

  const visibleTasks = currentEnergy
    ? tasks.filter((t) => t.energyRequired <= currentEnergy)
    : tasks
  const completedCount = visibleTasks.filter((t) => t.completed).length
  const totalCount = visibleTasks.filter((t) => !t.completed).length + completedCount
  const progress = totalCount > 0 ? completedCount / totalCount : 0

  const today_date = format(new Date(), 'EEEE, d. MMMM', { locale: de })

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-3xl p-5 border-2 transition-all duration-500',
        meta ? [meta.bgColor, meta.borderColor] : 'bg-muted border-border'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            {today_date}
          </p>
          <h1 className="text-xl font-bold text-foreground">
            Dein Tag{meta ? ` – ${meta.emoji} ${meta.label}` : ''}
          </h1>
          {meta && (
            <p className="text-sm text-muted-foreground mt-0.5">{meta.description}</p>
          )}
        </div>

        {/* Progress Ring */}
        {totalCount > 0 && (
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <ProgressRing progress={progress} color={meta?.color ?? 'text-primary'} />
            <p className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </p>
          </div>
        )}
      </div>

    </motion.div>
  )
}

function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const r = 18
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - progress)

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth="3" className="text-foreground" />
      <motion.circle
        cx="24" cy="24" r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        className={color}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      />
    </svg>
  )
}
