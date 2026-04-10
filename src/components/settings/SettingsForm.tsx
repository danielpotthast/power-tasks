'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { useDayStore } from '@/lib/stores/dayStore'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import type { AppSettings } from '@/types'

const themeOptions: Array<{ value: 'light' | 'dark' | 'system'; label: string }> = [
  { value: 'light', label: t.settings.themeOptions.light },
  { value: 'dark', label: t.settings.themeOptions.dark },
  { value: 'system', label: t.settings.themeOptions.system },
]

export function SettingsForm() {
  const { settings, updateSettings, initialized } = useDayStore()

  if (!initialized || !settings) return null

  return <SettingsFormInner settings={settings} updateSettings={updateSettings} />
}

function SettingsFormInner({
  settings,
  updateSettings,
}: {
  settings: AppSettings
  updateSettings: (partial: Partial<Omit<AppSettings, 'id'>>) => Promise<void>
}) {
  const [resetTime, setResetTime] = useState(settings.resetTime)
  const [theme, setTheme] = useState(settings.theme)

  async function handleThemeChange(value: 'light' | 'dark' | 'system') {
    setTheme(value)
    await updateSettings({ theme: value })
  }

  async function handleResetTimeBlur() {
    if (resetTime !== settings.resetTime) {
      await updateSettings({ resetTime })
    }
  }

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
        <pre className="text-[10px] leading-tight text-muted-foreground/70 text-center font-mono overflow-x-auto select-none">{`
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
          Fiffi, der offizielle WauFlow-Dackel 🐾
        </p>
      </div>
    </motion.div>
  )
}
