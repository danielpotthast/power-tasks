'use client'

import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategoryStore } from '@/lib/stores/categoryStore'
import { useTaskStore } from '@/lib/stores/taskStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

// ─── Einzelne sortierbare Kategorie-Zeile ───────────────────────────

function SortableRow({ category }: { category: Category }) {
  const { renameCategory, deleteCategory } = useCategoryStore()
  const { tasks, updateTask } = useTaskStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  async function handleRename() {
    if (name.trim() && name.trim() !== category.name) {
      await renameCategory(category.id, name.trim())
    }
    setEditing(false)
  }

  async function handleDelete() {
    await deleteCategory(category.id)
    // Tasks im Store synchron aktualisieren
    tasks
      .filter((t) => t.categoryId === category.id)
      .forEach((task) => updateTask(task.id, { categoryId: undefined }))
  }

  function startEdit() {
    setName(category.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 bg-card rounded-xl border border-border px-3 py-2.5 transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-primary/30 z-10'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none p-1 -ml-1"
        aria-label="Verschieben"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Name / Edit-Feld */}
      {editing ? (
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="h-7 text-sm rounded-lg flex-1"
        />
      ) : (
        <span className="flex-1 text-sm font-medium truncate">{category.name}</span>
      )}

      {/* Aktions-Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {editing ? (
          <>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-emerald-600" onClick={handleRename}>
              <Check className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => setEditing(false)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </>
        ) : confirmDelete ? (
          <>
            <span className="text-xs text-destructive mr-1">Löschen?</span>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-destructive" onClick={handleDelete}>
              <Check className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => setConfirmDelete(false)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={startEdit} aria-label={t.categories.rename}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)} aria-label={t.categories.delete}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Haupt-Komponente ────────────────────────────────────────────────

export function CategoryManager() {
  const { categories, load, addCategory, reorderCategories } = useCategoryStore()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const addInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Touch + Pointer Sensor — funktioniert auf Mobile & Desktop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(categories, oldIndex, newIndex)
    reorderCategories(reordered.map((c) => c.id))
  }

  async function handleAdd() {
    if (!newName.trim()) return
    await addCategory({ name: newName.trim() })
    setNewName('')
    setAdding(false)
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">{t.categories.title}</h2>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 rounded-xl h-8"
          onClick={() => {
            setAdding(true)
            setTimeout(() => addInputRef.current?.focus(), 50)
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          {t.categories.add}
        </Button>
      </div>

      {/* Neues Kategorie-Eingabefeld */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2">
              <Input
                ref={addInputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t.categories.namePlaceholder}
                className="rounded-xl text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd()
                  if (e.key === 'Escape') setAdding(false)
                }}
              />
              <Button size="icon" className="rounded-xl flex-shrink-0" onClick={handleAdd} disabled={!newName.trim()}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-xl flex-shrink-0" onClick={() => setAdding(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sortierbare Liste */}
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">{t.categories.empty}</p>
      ) : (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">{t.categories.dragHint}</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence>
                {categories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <SortableRow category={cat} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
