'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { dayService } from '@/lib/services/dayService'
import { ENERGY_META, type DayRecord } from '@/types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function HistoryView() {
  const [history, setHistory] = useState<DayRecord[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dayService.getHistory(60).then((h) => {
      setHistory(h)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <div className="text-4xl mb-2 animate-pulse">⏳</div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <div className="text-4xl mb-3">📅</div>
        <p>{t.history.noHistory}</p>
      </div>
    )
  }

  const selected = history[selectedIndex]
  const meta = ENERGY_META[selected.energyLevel]
  const tasks = selected.tasks ?? []
  const completedTasks = tasks.filter((t) => t.completed)
  const openTasks = tasks.filter((t) => !t.completed)

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          disabled={selectedIndex >= history.length - 1}
          onClick={() => setSelectedIndex((i) => i + 1)}
          aria-label="Älterer Tag"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Day selector strip */}
        <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none py-1">
          {history.slice(0, 14).map((day, idx) => {
            const d = parseISO(day.dayKey)
            const dayMeta = ENERGY_META[day.energyLevel]
            const isSelected = idx === selectedIndex
            return (
              <motion.button
                key={day.dayKey}
                onClick={() => setSelectedIndex(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl border-2 text-xs transition-all',
                  isSelected
                    ? [dayMeta.bgColor, dayMeta.borderColor]
                    : 'bg-muted/60 border-transparent hover:border-border'
                )}
              >
                <span className="font-medium text-muted-foreground">
                  {format(d, 'EEE', { locale: de })}
                </span>
                <span className={cn('font-bold', isSelected ? dayMeta.color : '')}>
                  {format(d, 'd')}
                </span>
                <span className="text-base">{dayMeta.emoji}</span>
              </motion.button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          disabled={selectedIndex <= 0}
          onClick={() => setSelectedIndex((i) => i - 1)}
          aria-label="Neuerer Tag"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected Day Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.dayKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Day Header */}
          <div className={cn('rounded-3xl p-5 border-2', meta.bgColor, meta.borderColor)}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              {format(parseISO(selected.dayKey), 'EEEE, d. MMMM yyyy', { locale: de })}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {meta.emoji} {meta.label}
                </h2>
                <p className="text-sm text-muted-foreground">{t.history.energyWas} {selected.energyLevel}/5</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="rounded-xl">
                  ✅ {t.history.completedCount(completedTasks.length)}
                </Badge>
                {openTasks.length > 0 && (
                  <Badge variant="outline" className="rounded-xl">
                    ⏳ {t.history.openCount(openTasks.length)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Tasks */}
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">{t.history.noTasks}</p>
          ) : (
            <div className="space-y-3">
              {completedTasks.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Erledigt ({completedTasks.length})
                  </h3>
                  <div className="space-y-1.5">
                    {completedTasks.map((task) => {
                      const taskMeta = ENERGY_META[task.energyRequired]
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 bg-card rounded-xl px-3.5 py-2.5 border border-border"
                        >
                          <span className="text-emerald-500 text-sm">✓</span>
                          <span className="flex-1 text-sm line-through text-muted-foreground">{task.title}</span>
                          <span className="text-xs">{taskMeta.emoji}</span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {openTasks.length > 0 && (
                <>
                  {completedTasks.length > 0 && <Separator />}
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Nicht erledigt ({openTasks.length})
                    </h3>
                    <div className="space-y-1.5">
                      {openTasks.map((task) => {
                        const taskMeta = ENERGY_META[task.energyRequired]
                        return (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 bg-card/60 rounded-xl px-3.5 py-2.5 border border-border opacity-60"
                          >
                            <span className="text-sm text-muted-foreground">○</span>
                            <span className="flex-1 text-sm">{task.title}</span>
                            <span className="text-xs">{taskMeta.emoji}</span>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
