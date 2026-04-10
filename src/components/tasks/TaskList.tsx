'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, ChevronDown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { useTaskStore } from '@/lib/stores/taskStore'
import { useDayStore } from '@/lib/stores/dayStore'
import { useCategoryStore } from '@/lib/stores/categoryStore'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

// ─── Hilfsfunktion: Aufgaben nach Kategorien gruppieren ─────────────

function groupByCategory(tasks: Task[], categoryOrder: string[]) {
  const groups: Array<{ categoryId: string | undefined; categoryName: string; tasks: Task[] }> = []

  // Zuerst alle konfigurierten Kategorien (in definierter Reihenfolge)
  const sortAlpha = (a: Task, b: Task) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })

  for (const catId of categoryOrder) {
    const catTasks = tasks.filter((task) => task.categoryId === catId).sort(sortAlpha)
    if (catTasks.length > 0) {
      groups.push({ categoryId: catId, categoryName: '', tasks: catTasks })
    }
  }

  // Aufgaben ohne Kategorie ans Ende
  const uncategorized = tasks.filter((task) => !task.categoryId).sort(sortAlpha)
  if (uncategorized.length > 0) {
    groups.push({ categoryId: undefined, categoryName: t.categories.none, tasks: uncategorized })
  }

  return groups
}

// ─── Kategorie-Abschnitt ─────────────────────────────────────────────

function CategorySection({
  label,
  tasks,
}: {
  label: string
  tasks: Task[]
}) {
  const openTasks = tasks.filter((t) => !t.completed)
  const doneTasks = tasks.filter((t) => t.completed)

  return (
    <div className="space-y-1.5">
      {label && (
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-0.5 pt-1">
          {label}
        </h3>
      )}
      <AnimatePresence mode="popLayout">
        {[...openTasks, ...doneTasks].map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────

export function TaskList() {
  const { tasks, addTask } = useTaskStore()
  const { today } = useDayStore()
  const { categories } = useCategoryStore()
  const [addOpen, setAddOpen] = useState(false)
  const [hiddenVisible, setHiddenVisible] = useState(false)

  const currentEnergy = today?.energyLevel ?? 5
  const visibleTasks = tasks.filter((task) => task.energyRequired <= currentEnergy)
  const hiddenTasks = tasks.filter((task) => task.energyRequired > currentEnergy)

  const openVisible = visibleTasks.filter((t) => !t.completed)
  const completedVisible = visibleTasks.filter((t) => t.completed)

  const categoryOrder = categories.map((c) => c.id)
  const openGroups = groupByCategory(openVisible, categoryOrder).map((g) => ({
    ...g,
    categoryName: g.categoryId
      ? (categories.find((c) => c.id === g.categoryId)?.name ?? '')
      : g.categoryName,
  }))

  const hasAnything = visibleTasks.length > 0 || hiddenTasks.length > 0

  return (
    <div className="space-y-5">
      {/* Header-Zeile */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t.tasks.open} ({openVisible.length})
        </h2>
        <Button onClick={() => setAddOpen(true)} size="sm" className="rounded-xl gap-1.5 h-8">
          <Plus className="w-3.5 h-3.5" />
          {t.tasks.add}
        </Button>
      </div>

      {/* Leerer Zustand */}
      {!hasAnything && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-muted-foreground"
        >
          <div className="text-4xl mb-2">✨</div>
          <p className="text-sm">{t.tasks.empty}</p>
        </motion.div>
      )}

      {/* Offene Aufgaben — nach Kategorien gruppiert */}
      {openGroups.length > 0 && (
        <div className="space-y-3">
          {openGroups.map((group, i) => (
            <CategorySection
              key={group.categoryId ?? '__none__'}
              label={categories.length > 0 ? group.categoryName : ''}
              tasks={group.tasks}
            />
          ))}
        </div>
      )}

      {/* Versteckte Aufgaben (zu viel Energie) */}
      {hiddenTasks.length > 0 && (
        <section>
          <motion.button
            onClick={() => setHiddenVisible((v) => !v)}
            className="w-full flex items-center gap-2 py-2.5 px-3.5 rounded-xl bg-muted/60 hover:bg-muted transition-colors text-sm text-muted-foreground"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="flex-1 text-left font-medium">
              {t.tasks.hiddenTitle(hiddenTasks.length)}
            </span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', hiddenVisible && 'rotate-180')} />
          </motion.button>

          <AnimatePresence>
            {hiddenVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mt-2 opacity-60">
                  {hiddenTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-muted-foreground rounded-xl"
                  onClick={() => setHiddenVisible(false)}
                >
                  {t.tasks.hideHidden}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Erledigte Aufgaben */}
      {completedVisible.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t.tasks.completed} ({completedVisible.length})
          </h2>
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {completedVisible.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </AnimatePresence>
        </section>
      )}

      {/* Add Task Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogTitle>{t.tasks.addTitle}</DialogTitle>
          <TaskForm
            onSave={async (input) => {
              await addTask(input)
              setAddOpen(false)
            }}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
