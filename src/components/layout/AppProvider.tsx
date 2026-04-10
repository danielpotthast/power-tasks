'use client'

import { useEffect, useRef } from 'react'
import { useDayStore } from '@/lib/stores/dayStore'
import { useTaskStore } from '@/lib/stores/taskStore'
import { useCategoryStore } from '@/lib/stores/categoryStore'
import { dayService } from '@/lib/services/dayService'
import { CheckInModal } from '@/components/energy/CheckInModal'
import { useTheme } from '@/lib/hooks/useTheme'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { initialize, checkInRequired, initialized, settings } = useDayStore()
  const { loadToday } = useTaskStore()
  const { load: loadCategories } = useCategoryStore()
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useTheme(settings?.theme)

  useEffect(() => {
    initialize()
    loadToday()
    loadCategories()
  }, [])

  // Automatischer Reset-Timer: prüft täglich zur eingestellten Uhrzeit
  useEffect(() => {
    if (!settings) return

    function scheduleNextReset() {
      if (!settings) return
      const [hours, minutes] = settings.resetTime.split(':').map(Number)
      const now = new Date()
      const nextReset = new Date()
      nextReset.setHours(hours, minutes, 0, 0)

      // Wenn Reset-Zeit heute schon vorbei, plane für morgen
      if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1)
      }

      const msUntilReset = nextReset.getTime() - now.getTime()

      resetTimerRef.current = setTimeout(async () => {
        await dayService.performReset()
        await initialize() // Neu initialisieren → checkInRequired wird true
        await loadToday()
        scheduleNextReset() // Nächsten Reset einplanen
      }, msUntilReset)
    }

    scheduleNextReset()

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [settings?.resetTime])

  return (
    <>
      {initialized && <CheckInModal open={checkInRequired} />}
      {children}
    </>
  )
}
