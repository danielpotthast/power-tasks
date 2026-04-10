/**
 * Task Service – API-ready Interface.
 * Heute: IndexedDB via Dexie. Morgen: einfach durch API-Calls ersetzen.
 */

import { db } from '@/lib/db'
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'

function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export const taskService = {
  /** Alle Aufgaben eines Tages laden */
  async getByDay(dayKey: string): Promise<Task[]> {
    return db.tasks.where('dayKey').equals(dayKey).sortBy('createdAt')
  },

  /** Heutige Aufgaben */
  async getToday(): Promise<Task[]> {
    return taskService.getByDay(todayKey())
  },

  /** Neue Aufgabe erstellen */
  async create(input: TaskCreateInput): Promise<Task> {
    const task: Task = {
      id: nanoid(),
      title: input.title,
      notes: input.notes,
      energyRequired: input.energyRequired,
      categoryId: input.categoryId,
      completed: false,
      createdAt: Date.now(),
      dayKey: todayKey(),
    }
    await db.tasks.add(task)
    return task
  },

  /** Aufgabe aktualisieren */
  async update(id: string, input: TaskUpdateInput): Promise<void> {
    await db.tasks.update(id, input)
  },

  /** Aufgabe als erledigt/offen markieren */
  async toggleComplete(id: string): Promise<void> {
    const task = await db.tasks.get(id)
    if (!task) return
    await db.tasks.update(id, {
      completed: !task.completed,
      completedAt: !task.completed ? Date.now() : undefined,
    })
  },

  /** Aufgabe löschen */
  async delete(id: string): Promise<void> {
    await db.tasks.delete(id)
  },

  /** Alle Aufgaben eines Tages als Snapshot für History laden */
  async snapshotDay(dayKey: string): Promise<Task[]> {
    return db.tasks.where('dayKey').equals(dayKey).toArray()
  },
}
