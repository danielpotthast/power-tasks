'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { useDayStore } from '@/lib/stores/dayStore'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

const themeOptions: Array<{ value: 'light' | 'dark' | 'system'; label: string }> = [
  { value: 'light', label: t.settings.themeOptions.light },
  { value: 'dark', label: t.settings.themeOptions.dark },
  { value: 'system', label: t.settings.themeOptions.system },
]

export function SettingsForm() {
  const { settings, updateSettings, initialized } = useDayStore()
  const [resetTime, setResetTime] = useState('04:00')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  useEffect(() => {
    if (settings) {
      setResetTime(settings.resetTime)
      setTheme(settings.theme)
    }
  }, [settings])

  // Theme: sofort beim Klick speichern
  async function handleThemeChange(value: 'light' | 'dark' | 'system') {
    setTheme(value)
    await updateSettings({ theme: value })
  }

  // Reset-Zeit: beim Verlassen des Feldes speichern
  async function handleResetTimeBlur() {
    if (resetTime !== settings?.resetTime) {
      await updateSettings({ resetTime })
    }
  }

  if (!initialized) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Reset Time */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
        <div>
          <h2 className="font-semibold text-base">{t.settings.resetTime}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.settings.resetTimeDescription}</p>
        </div>
        <Input
          type="time"
          value={resetTime}
          onChange={(e) => setResetTime(e.target.value)}
          onBlur={handleResetTimeBlur}
          className="rounded-xl w-36 font-mono"
        />
      </div>

      {/* Theme */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
        <h2 className="font-semibold text-base">{t.settings.theme}</h2>
        <div className="flex gap-2">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleThemeChange(opt.value)}
              className={cn(
                'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                theme === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-muted-foreground/40'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-muted/60 rounded-2xl p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-medium">🔒 Datenschutz</p>
        <p>Alle Daten werden ausschließlich lokal in deinem Browser gespeichert.</p>
      </div>

      {/* Fiffi */}
      <div className="rounded-2xl border border-dashed border-border p-5 space-y-2">
        <pre className="text-[10px] leading-tight text-muted-foreground/70 font-mono overflow-x-auto select-none">{`
                            __
     ,                    ," e\`--o
    ((                   (  | __,'
     \\~----------------' \\_;/
      (                      /
      /) ._______________.  )
     (( (               (( (
      \`\`-'               \`\`-'
        `}</pre>
        <p className="text-xs text-center text-muted-foreground/50 italic">
          Fiffi, der offizielle Power-Tasks-Dackel 🐾
        </p>
      </div>
    </motion.div>
  )
}
