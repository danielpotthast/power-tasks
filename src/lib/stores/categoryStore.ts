import { create } from 'zustand'
import { categoryService } from '@/lib/services/categoryService'
import type { Category, CategoryCreateInput } from '@/types'

interface CategoryState {
  categories: Category[]
  loading: boolean

  load: () => Promise<void>
  addCategory: (input: CategoryCreateInput) => Promise<void>
  renameCategory: (id: string, name: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  reorderCategories: (orderedIds: string[]) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  load: async () => {
    set({ loading: true })
    const categories = await categoryService.getAll()
    set({ categories, loading: false })
  },

  addCategory: async (input) => {
    const category = await categoryService.create(input)
    set((s) => ({ categories: [...s.categories, category] }))
  },

  renameCategory: async (id, name) => {
    await categoryService.rename(id, name)
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)),
    }))
  },

  deleteCategory: async (id) => {
    await categoryService.delete(id)
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
  },

  reorderCategories: async (orderedIds) => {
    await categoryService.reorder(orderedIds)
    const sorted = [...get().categories].sort(
      (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
    )
    set({ categories: sorted })
  },
}))
