import { db } from '@/lib/db'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'

export const settingsService = {
  async get(): Promise<AppSettings> {
    const settings = await db.settings.get('settings')
    return settings ?? DEFAULT_SETTINGS
  },

  async update(partial: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings> {
    const current = await settingsService.get()
    const updated: AppSettings = { ...current, ...partial }
    await db.settings.put(updated)
    return updated
  },
}
