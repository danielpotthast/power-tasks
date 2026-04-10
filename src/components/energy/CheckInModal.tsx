'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EnergyPicker } from './EnergyPicker'
import { ENERGY_META, type EnergyLevel } from '@/types'
import { useDayStore } from '@/lib/stores/dayStore'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

interface CheckInModalProps {
  open: boolean
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 11) return 'Guten Morgen! 👋'
  if (hour >= 11 && hour < 14) return 'Guten Tag! ☀️'
  if (hour >= 14 && hour < 18) return 'Guten Nachmittag! 🌤️'
  if (hour >= 18 && hour < 22) return 'Guten Abend! 🌙'
  return 'Noch wach? 🦉'
}

export function CheckInModal({ open }: CheckInModalProps) {
  const [selected, setSelected] = useState<EnergyLevel | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const { checkIn } = useDayStore()

  async function handleConfirm() {
    if (!selected) return
    setLoading(true)
    await checkIn(selected)
    setLoading(false)
  }

  const selectedMeta = selected ? ENERGY_META[selected] : null

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-0 overflow-hidden"
      >
        <div className="relative">
          {/* Farbiger Header basierend auf Auswahl */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected ?? 'none'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'h-32 flex items-center justify-center text-6xl transition-all duration-500',
                selectedMeta
                  ? `gradient-energy-${selected}`
                  : 'bg-gradient-to-br from-violet-100 to-indigo-100'
              )}
            >
              {selectedMeta ? selectedMeta.emoji : '✨'}
            </motion.div>
          </AnimatePresence>

          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{getGreeting()}</h2>
              <p className="text-muted-foreground">{t.checkin.subtitle}</p>
            </div>

            <EnergyPicker value={selected} onChange={setSelected} size="lg" />

            {/* Beschreibung der Auswahl */}
            <AnimatePresence mode="wait">
              {selectedMeta && (
                <motion.p
                  key={selected}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={cn('text-center text-sm font-medium', selectedMeta.color)}
                >
                  {selectedMeta.description}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              onClick={handleConfirm}
              disabled={!selected || loading}
              className="w-full rounded-xl py-5 text-base font-semibold"
            >
              {loading ? 'Speichere...' : t.checkin.confirm}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t.checkin.adjustHint}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
