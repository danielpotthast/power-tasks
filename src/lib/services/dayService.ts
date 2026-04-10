/**
 * Day Service – verwaltet Tages-Check-ins, Energie und Reset-Logik.
 */

import { db } from '@/lib/db'
import { taskService } from './taskService'
import type { DayRecord, EnergyLevel } from '@/types'
import { format, setHours, setMinutes } from 'date-fns'

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export const dayService = {
  /** Heutigen Tag laden oder undefined wenn noch kein Check-in */
  async getToday(): Promise<DayRecord | undefined> {
    return db.days.get(todayKey())
  },

  /** Bestimmten Tag aus History laden */
  async getDay(dayKey: string): Promise<DayRecord | undefined> {
    return db.days.get(dayKey)
  },

  /** Alle Tage für History (neueste zuerst) */
  async getHistory(limit = 30): Promise<DayRecord[]> {
    const all = await db.days.toArray()
    return all
      .filter((d) => d.dayKey < todayKey()) // nur vergangene Tage
      .sort((a, b) => b.dayKey.localeCompare(a.dayKey))
      .slice(0, limit)
  },

  /** Check-in: Energie für heute setzen */
  async checkIn(energyLevel: EnergyLevel): Promise<DayRecord> {
    const dayKey = todayKey()
    const existing = await db.days.get(dayKey)

    const record: DayRecord = {
      dayKey,
      energyLevel,
      checkedInAt: Date.now(),
      tasks: existing?.tasks,
      resetAt: existing?.resetAt,
    }

    await db.days.put(record)
    return record
  },

  /** Energie im Tagesverlauf anpassen */
  async updateEnergy(energyLevel: EnergyLevel): Promise<void> {
    const dayKey = todayKey()
    await db.days.update(dayKey, { energyLevel })
  },

  /**
   * Tages-Reset ausführen:
   * - Snapshot der heutigen Aufgaben in DayRecord speichern
   * - Danach ist der neue Tag "leer" (Check-in steht aus)
   */
  async performReset(): Promise<void> {
    const dayKey = todayKey()
    const tasks = await taskService.snapshotDay(dayKey)
    const existing = await db.days.get(dayKey)

    if (existing) {
      await db.days.update(dayKey, {
        tasks,
        resetAt: Date.now(),
      })
    }
  },

  /**
   * Prüft ob heute bereits ein Check-in stattgefunden hat,
   * NACH dem konfigurierten Reset-Zeitpunkt.
   * Gibt true zurück wenn Check-in noch aussteht.
   *
   * Beim allerersten App-Start (keine History, keine Tasks) → kein Modal,
   * damit der Nutzer zuerst Aufgaben anlegen kann.
   */
  async isCheckInRequired(resetTime: string): Promise<boolean> {
    // Allererster Start: noch keine History und keine Tasks vorhanden
    const [historyCount, taskCount] = await Promise.all([
      db.days.count(),
      db.tasks.count(),
    ])
    if (historyCount === 0 && taskCount === 0) return false

    const today = await dayService.getToday()

    // Noch kein Check-in heute
    if (!today) return true

    // Check: Ist der Check-in vor dem Reset-Zeitpunkt heute?
    const [hours, minutes] = resetTime.split(':').map(Number)
    const resetMoment = setMinutes(setHours(new Date(), hours), minutes)

    const checkedInDate = new Date(today.checkedInAt)
    return checkedInDate < resetMoment
  },
}
