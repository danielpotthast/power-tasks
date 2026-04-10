import { create } from 'zustand'
import { taskService } from '@/lib/services/taskService'
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types'

interface TaskState {
  tasks: Task[]
  loading: boolean

  loadToday: () => Promise<void>
  addTask: (input: TaskCreateInput) => Promise<void>
  updateTask: (id: string, input: TaskUpdateInput) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  loadToday: async () => {
    set({ loading: true })
    const tasks = await taskService.getToday()
    set({ tasks, loading: false })
  },

  addTask: async (input) => {
    const task = await taskService.create(input)
    set((s) => ({ tasks: [...s.tasks, task] }))
  },

  updateTask: async (id, input) => {
    await taskService.update(id, input)
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...input } : t)),
    }))
  },

  toggleTask: async (id) => {
    await taskService.toggleComplete(id)
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      ),
    }))
  },

  deleteTask: async (id) => {
    await taskService.delete(id)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
  },
}))
