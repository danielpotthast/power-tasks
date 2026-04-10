// ─────────────────────────────────────────────
// Energy
// ─────────────────────────────────────────────

/** Persönlicher Energie-Stand des Nutzers für einen Tag (1 = erschöpft, 5 = volle Power) */
export type EnergyLevel = 1 | 2 | 3 | 4 | 5

/** Wie viel Energie eine Aufgabe erfordert */
export type TaskEnergyRequirement = 1 | 2 | 3 | 4 | 5

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  /** Sortierungsindex – kleinerer Wert = weiter oben */
  order: number
}

export type CategoryCreateInput = Pick<Category, 'name'>

// ─────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────

export interface Task {
  id: string
  title: string
  notes?: string
  /** Energie, die diese Aufgabe erfordert */
  energyRequired: TaskEnergyRequirement
  completed: boolean
  createdAt: number // timestamp
  completedAt?: number // timestamp
  /** ISO date string "YYYY-MM-DD" – welchem Tag die Aufgabe gehört */
  dayKey: string
  /** Optionale Kategorie-Zuordnung */
  categoryId?: string
}

export type TaskCreateInput = Pick<Task, 'title' | 'energyRequired' | 'notes' | 'categoryId'>
export type TaskUpdateInput = Partial<Pick<Task, 'title' | 'energyRequired' | 'notes' | 'completed' | 'completedAt' | 'categoryId'>>

// ─────────────────────────────────────────────
// Day
// ─────────────────────────────────────────────

/** Tages-Eintrag: Energie-Level + Snapshot der Aufgaben für die History */
export interface DayRecord {
  dayKey: string // "YYYY-MM-DD"
  energyLevel: EnergyLevel
  /** Timestamp wann der Check-in stattfand */
  checkedInAt: number
  /** Snapshot beim Reset: alle Aufgaben des Tages */
  tasks?: Task[]
  /** Timestamp des Resets */
  resetAt?: number
}

// ─────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────

export interface AppSettings {
  id: 'settings' // singleton
  /** Uhrzeit für den täglichen Reset, z.B. "04:00" */
  resetTime: string
  /** Zeitzone des Nutzers */
  timezone: string
  /** Ob Dark Mode aktiv ist */
  theme: 'light' | 'dark' | 'system'
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'settings',
  resetTime: '04:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: 'system',
}

// ─────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────

export interface EnergyMeta {
  level: EnergyLevel
  label: string
  emoji: string
  description: string
  color: string
  bgColor: string
  borderColor: string
}

export const ENERGY_META: Record<EnergyLevel, EnergyMeta> = {
  1: {
    level: 1,
    label: 'Erschöpft',
    emoji: '😴',
    description: 'Kaum Energie – nur das Nötigste',
    color: 'text-slate-500 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    borderColor: 'border-slate-300 dark:border-slate-600',
  },
  2: {
    level: 2,
    label: 'Müde',
    emoji: '🥱',
    description: 'Wenig Energie – leichte Aufgaben',
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-700',
  },
  3: {
    level: 3,
    label: 'Normal',
    emoji: '😊',
    description: 'Normale Energie – der Alltag',
    color: 'text-emerald-500 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    borderColor: 'border-emerald-200 dark:border-emerald-700',
  },
  4: {
    level: 4,
    label: 'Gut drauf',
    emoji: '💪',
    description: 'Gute Energie – anspruchsvolle Aufgaben',
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-200 dark:border-amber-700',
  },
  5: {
    level: 5,
    label: 'Volle Power',
    emoji: '🚀',
    description: 'Maximale Energie – Deep Work möglich',
    color: 'text-rose-500 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950',
    borderColor: 'border-rose-200 dark:border-rose-700',
  },
}
