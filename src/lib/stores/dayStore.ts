import { create } from 'zustand'
import { dayService } from '@/lib/services/dayService'
import { settingsService } from '@/lib/services/settingsService'
import type { DayRecord, EnergyLevel, AppSettings } from '@/types'

interface DayState {
  today: DayRecord | null
  settings: AppSettings | null
  checkInRequired: boolean
  initialized: boolean

  initialize: () => Promise<void>
  checkIn: (level: EnergyLevel) => Promise<void>
  updateEnergy: (level: EnergyLevel) => Promise<void>
  updateSettings: (partial: Partial<Omit<AppSettings, 'id'>>) => Promise<void>
  setCheckInRequired: (value: boolean) => void
}

export const useDayStore = create<DayState>((set) => ({
  today: null,
  settings: null,
  checkInRequired: false,
  initialized: false,

  initialize: async () => {
    const [today, settings] = await Promise.all([
      dayService.getToday(),
      settingsService.get(),
    ])

    const checkInRequired = await dayService.isCheckInRequired(settings.resetTime)

    set({
      today: today ?? null,
      settings,
      checkInRequired,
      initialized: true,
    })
  },

  checkIn: async (level) => {
    const record = await dayService.checkIn(level)
    set({ today: record, checkInRequired: false })
  },

  updateEnergy: async (level) => {
    await dayService.updateEnergy(level)
    set((s) => ({
      today: s.today ? { ...s.today, energyLevel: level } : null,
    }))
  },

  updateSettings: async (partial) => {
    const updated = await settingsService.update(partial)
    set({ settings: updated })
  },

  setCheckInRequired: (value) => set({ checkInRequired: value }),
}))
