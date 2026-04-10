'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Pencil, Trash2, ChevronDown, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TaskForm } from './TaskForm'
import { ENERGY_META } from '@/types'
import type { Task, TaskCreateInput } from '@/types'
import { useTaskStore } from '@/lib/stores/taskStore'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { toggleTask, updateTask, deleteTask } = useTaskStore()
  const [editOpen, setEditOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const meta = ENERGY_META[task.energyRequired]

  async function handleSave(input: TaskCreateInput) {
    await updateTask(task.id, input)
    setEditOpen(false)
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className={cn(
          'group relative bg-card rounded-2xl border-2 transition-all duration-200',
          task.completed
            ? 'border-border opacity-60'
            : [meta.borderColor, 'hover:shadow-md']
        )}
      >
        <div className="flex items-start gap-3 p-3.5">
          {/* Checkbox */}
          <motion.button
            onClick={() => toggleTask(task.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
              task.completed
                ? 'bg-emerald-500 border-emerald-500'
                : [meta.borderColor, 'hover:' + meta.bgColor]
            )}
            aria-label={task.completed ? 'Als offen markieren' : 'Als erledigt markieren'}
          >
            <AnimatePresence>
              {task.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-medium leading-snug',
              task.completed && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </p>

            {/* Energy indicator */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs">{meta.emoji}</span>
              <span className={cn('text-xs', meta.color, 'font-medium')}>{meta.label}</span>

              {task.notes && (
                <button
                  onClick={() => setNotesOpen((o) => !o)}
                  className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  <StickyNote className="w-3 h-3" />
                  <ChevronDown className={cn('w-3 h-3 transition-transform', notesOpen && 'rotate-180')} />
                </button>
              )}
            </div>

            {/* Notes (expandable) */}
            <AnimatePresence>
              {notesOpen && task.notes && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden text-xs text-muted-foreground mt-2 bg-muted rounded-lg px-2.5 py-2"
                >
                  {task.notes}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={() => setEditOpen(true)}
              aria-label="Bearbeiten"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
              aria-label="Löschen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogTitle>{t.tasks.editTitle}</DialogTitle>
          <TaskForm
            initial={task}
            onSave={handleSave}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-xs rounded-3xl">
          <DialogTitle>{t.tasks.confirmDelete}</DialogTitle>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setConfirmDelete(false)}>
              {t.tasks.cancel}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl"
              onClick={async () => {
                await deleteTask(task.id)
                setConfirmDelete(false)
              }}
            >
              {t.tasks.delete}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
