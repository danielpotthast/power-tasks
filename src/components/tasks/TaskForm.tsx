'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnergyPicker } from '@/components/energy/EnergyPicker'
import { useCategoryStore } from '@/lib/stores/categoryStore'
import { t } from '@/i18n'
import type { Task, TaskCreateInput, TaskEnergyRequirement } from '@/types'

interface TaskFormProps {
  initial?: Partial<Task>
  onSave: (input: TaskCreateInput) => Promise<void>
  onCancel: () => void
}

export function TaskForm({ initial, onSave, onCancel }: TaskFormProps) {
  const { categories } = useCategoryStore()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [energy, setEnergy] = useState<TaskEnergyRequirement | undefined>(initial?.energyRequired)
  const [categoryId, setCategoryId] = useState<string | undefined>(initial?.categoryId)
  const [saving, setSaving] = useState(false)

  const isValid = title.trim().length > 0 && energy !== undefined

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      energyRequired: energy!,
      categoryId,
    })
    setSaving(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 space-y-4"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="task-title">
          {t.tasks.titleLabel}
        </label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.tasks.titlePlaceholder}
          autoFocus
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="task-notes">
          {t.tasks.notesLabel}
        </label>
        <Textarea
          id="task-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.tasks.notesPlaceholder}
          rows={2}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          {t.tasks.energyLabel}
        </label>
        <EnergyPicker
          value={energy}
          onChange={(l) => setEnergy(l as TaskEnergyRequirement)}
        />
      </div>

      {/* Kategorie-Dropdown — nur wenn Kategorien vorhanden */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="task-category">
            {t.tasks.categoryLabel}
          </label>
          <select
            id="task-category"
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value || undefined)}
            className="h-8 w-full rounded-xl border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">{t.categories.none}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 rounded-xl">
          {t.tasks.cancel}
        </Button>
        <Button type="submit" disabled={!isValid || saving} className="flex-1 rounded-xl">
          {saving ? 'Speichere...' : t.tasks.save}
        </Button>
      </div>
    </motion.form>
  )
}
