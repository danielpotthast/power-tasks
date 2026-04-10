'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ENERGY_META } from '@/types'
import { useDayStore } from '@/lib/stores/dayStore'
import { EnergyPicker } from './EnergyPicker'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

export function EnergyBadge() {
  const { today, updateEnergy } = useDayStore()
  const [open, setOpen] = useState(false)

  if (!today) return null

  const meta = ENERGY_META[today.energyLevel]

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-colors',
          meta.bgColor,
          meta.borderColor,
          meta.color
        )}
        aria-label={t.energy.change}
        aria-expanded={open}
      >
        <span>{meta.emoji}</span>
        <span className="hidden sm:inline">{meta.label}</span>
        <span className="text-xs font-bold opacity-70">{today.energyLevel}/5</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute right-0 top-full mt-2 z-20 bg-card rounded-2xl shadow-xl border border-border p-4 w-[min(320px,calc(100vw-2rem))]"
            >
              <p className="text-sm text-muted-foreground mb-3 text-center font-medium">
                {t.energy.change}
              </p>
              <EnergyPicker
                value={today.energyLevel}
                onChange={async (level) => {
                  await updateEnergy(level)
                  setOpen(false)
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
