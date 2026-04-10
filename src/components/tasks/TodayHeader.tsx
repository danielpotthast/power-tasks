'use client'

import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { useDayStore } from '@/lib/stores/dayStore'
import { useTaskStore } from '@/lib/stores/taskStore'
import { ENERGY_META } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DachshundIcon } from '@/components/icons/DachshundIcon'
import { t } from '@/i18n'

export function TodayHeader() {
  const { today } = useDayStore()
  const { tasks } = useTaskStore()

  const currentEnergy = today?.energyLevel
  const meta = currentEnergy ? ENERGY_META[currentEnergy] : null

  const visibleTasks = currentEnergy
    ? tasks.filter((t) => t.energyRequired <= currentEnergy)
    : tasks
  const completedCount = visibleTasks.filter((t) => t.completed).length
  const totalCount = visibleTasks.length
  const allDone = totalCount > 0 && completedCount === totalCount
  const progress = totalCount > 0 ? completedCount / totalCount : 0

  const today_date = format(new Date(), 'EEEE, d. MMMM', { locale: de })

  return (
    <motion.div
      layout
      className={cn(
        'rounded-3xl p-5 border-2 transition-all duration-500',
        meta ? [meta.bgColor, meta.borderColor] : 'bg-muted border-border'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            {today_date}
          </p>
          <h1 className="text-xl font-bold text-foreground">
            {meta ? `${meta.emoji} ${meta.label}` : t.tasks.noEnergyYet}
          </h1>
        </div>

        <AnimatePresence mode="sync" initial={false}>
          {allDone ? (
            <motion.div
              key="wau"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="shrink-0 flex flex-col items-center gap-0.5"
            >
              <DachshundIcon className="w-12 h-9 text-foreground" />
              <p className="text-xs font-bold text-foreground tracking-wide">Wau!</p>
            </motion.div>
          ) : totalCount > 0 ? (
            <motion.div
              key="ring"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="shrink-0 flex flex-col items-center gap-1"
            >
              <ProgressRing progress={progress} color={meta?.color ?? 'text-primary'} />
              <p className="text-xs text-muted-foreground">
                {completedCount}/{totalCount}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
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
