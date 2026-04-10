'use client'

import { motion } from 'framer-motion'
import { ENERGY_META, type EnergyLevel } from '@/types'
import { cn } from '@/lib/utils'

interface EnergyPickerProps {
  value?: EnergyLevel
  onChange: (level: EnergyLevel) => void
  /**
   * 'sm'  – kompakt (z.B. im Dropdown-Popover)
   * 'lg'  – groß (z.B. im Check-in Modal)
   */
  size?: 'sm' | 'lg'
}

const levels: EnergyLevel[] = [1, 2, 3, 4, 5]

export function EnergyPicker({ value, onChange, size = 'sm' }: EnergyPickerProps) {
  return (
    // grid statt flex → alle 5 Zellen immer gleich breit, kein Überlauf auf Mobile
    <div
      className="grid grid-cols-5 gap-1.5 w-full"
      role="radiogroup"
      aria-label="Energie-Level wählen"
    >
      {levels.map((level) => {
        const meta = ENERGY_META[level]
        const isSelected = value === level

        return (
          <motion.button
            key={level}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Level ${level}: ${meta.label}`}
            onClick={() => onChange(level)}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.93 }}
            className={cn(
              // Volle Breite der Grid-Zelle, kein min-width Problem
              'relative w-full flex flex-col items-center justify-center',
              'rounded-2xl border-2 transition-all duration-200 cursor-pointer',
              'gap-1 select-none',
              size === 'sm' ? 'py-2.5' : 'py-4',
              isSelected
                ? [meta.bgColor, meta.borderColor, 'shadow-md']
                : 'bg-card border-border'
            )}
          >
            <span className={size === 'sm' ? 'text-xl' : 'text-3xl'}>
              {meta.emoji}
            </span>

            {/* Level-Zahl – immer sichtbar */}
            <span className={cn(
              'font-bold leading-none',
              size === 'sm' ? 'text-xs' : 'text-sm',
              isSelected ? meta.color : 'text-muted-foreground/60'
            )}>
              {level}
            </span>

            {/* Label – nur bei 'lg' */}
            {size === 'lg' && (
              <span className={cn(
                'text-xs font-medium text-center leading-tight px-0.5',
                isSelected ? meta.color : 'text-muted-foreground'
              )}>
                {meta.label}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
