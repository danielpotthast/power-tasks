import Dexie, { type EntityTable } from 'dexie'
import type { Task, DayRecord, AppSettings, Category } from '@/types'

class PowerTasksDB extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  days!: EntityTable<DayRecord, 'dayKey'>
  settings!: EntityTable<AppSettings, 'id'>
  categories!: EntityTable<Category, 'id'>

  constructor() {
    super('PowerTasksDB')

    this.version(1).stores({
      tasks: 'id, dayKey, completed, energyRequired, createdAt',
      days: 'dayKey',
      settings: 'id',
    })

    this.version(2).stores({
      tasks: 'id, dayKey, completed, energyRequired, createdAt, categoryId',
      days: 'dayKey',
      settings: 'id',
      categories: 'id, order',
    })
  }
}

export const db = new PowerTasksDB()
