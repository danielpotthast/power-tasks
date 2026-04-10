import { db } from '@/lib/db'
import type { Category, CategoryCreateInput } from '@/types'
import { nanoid } from 'nanoid'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const all = await db.categories.toArray()
    return all.sort((a, b) => a.order - b.order)
  },

  async create(input: CategoryCreateInput): Promise<Category> {
    const all = await db.categories.count()
    const category: Category = {
      id: nanoid(),
      name: input.name.trim(),
      order: all, // ans Ende
    }
    await db.categories.add(category)
    return category
  },

  async rename(id: string, name: string): Promise<void> {
    await db.categories.update(id, { name: name.trim() })
  },

  /** Löschen: categoryId bei betroffenen Tasks entfernen */
  async delete(id: string): Promise<void> {
    await db.transaction('rw', [db.categories, db.tasks], async () => {
      await db.categories.delete(id)
      // Tasks behalten, categoryId auf undefined setzen
      const affected = await db.tasks.where('categoryId').equals(id).toArray()
      await Promise.all(
        affected.map((t) => db.tasks.update(t.id, { categoryId: undefined }))
      )
    })
  },

  /** Neue Reihenfolge speichern – ids in gewünschter Reihenfolge übergeben */
  async reorder(orderedIds: string[]): Promise<void> {
    await db.transaction('rw', db.categories, async () => {
      await Promise.all(
        orderedIds.map((id, index) => db.categories.update(id, { order: index }))
      )
    })
  },
}
