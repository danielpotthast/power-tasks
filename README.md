# WauFlow

Energie-basierte Tagesplanung für das Smartphone. Aufgaben werden nach dem persönlichen Energie-Level des Tages gefiltert – wer erschöpft ist, sieht nur leichte Aufgaben.

## Kernkonzept

Einmal täglich (nach dem konfigurierten Reset, Standard 04:00 Uhr) gibt der Nutzer seinen Energie-Stand für den Tag ein (Skala 1–5). Aufgaben, die mehr Energie erfordern als vorhanden, werden ausgeblendet. Der Stand ist jederzeit anpassbar.

## Features

- **Tages-Check-in** – Modal beim ersten Öffnen, persistenter Indikator im Header zum Anpassen
- **Energie-Filterung** – Aufgaben über dem Level ausgeblendet, auf Wunsch einmalig aufklappbar
- **Kategorien** – Nutzerdefiniert, Drag & Drop-Sortierung, optionale Zuordnung pro Aufgabe
- **History** – Vergangene Tage mit erledigten/offenen Aufgaben und Energie-Level
- **Tages-Reset** – Automatisch zur eingestellten Uhrzeit, Aufgaben werden archiviert
- **Dark Mode** – System, Hell oder Dunkel wählbar, wird sofort angewendet
- **Offline-first** – Alle Daten lokal im Browser (IndexedDB), kein Backend nötig

## Tech Stack

| Schicht | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Sprache | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui (base-ui) |
| State | Zustand |
| Datenbank | Dexie.js (IndexedDB) |
| Animationen | Framer Motion |
| Drag & Drop | @dnd-kit |
| Datumsverarbeitung | date-fns v4 |

## Projektstruktur

```
src/
├── app/                    # Next.js Seiten
│   ├── page.tsx            # Heute-Ansicht
│   ├── history/page.tsx    # Rückblick
│   └── settings/page.tsx   # Einstellungen
├── components/
│   ├── energy/             # CheckInModal, EnergyBadge, EnergyPicker
│   ├── tasks/              # TaskList, TaskCard, TaskForm, TodayHeader
│   ├── history/            # HistoryView
│   ├── settings/           # SettingsForm, CategoryManager
│   └── layout/             # AppHeader, AppProvider
├── lib/
│   ├── db/                 # Dexie-Schema (v2)
│   ├── hooks/              # useTheme
│   ├── services/           # taskService, dayService, categoryService, settingsService
│   └── stores/             # taskStore, dayStore, categoryStore (Zustand)
├── types/                  # Zentrale TypeScript-Typen
└── i18n/                   # Übersetzungen (de.ts, erweiterbar)
```

## Architektur-Prinzipien

**API-ready:** Der Service-Layer (`lib/services/`) abstrahiert den Datenzugriff vollständig. Heute steht Dexie/IndexedDB dahinter – für eine native App oder ein Backend reicht es, die Services auszutauschen, ohne die UI anzufassen.

**Datenmodell:**
```
Task        { id, title, notes?, energyRequired (1–5), completed, dayKey, categoryId? }
DayRecord   { dayKey, energyLevel (1–5), checkedInAt, tasks? (Snapshot), resetAt? }
Category    { id, name, order }
AppSettings { resetTime, timezone, theme }
```

**Dexie Schema-Versionen:** v1 (initial) → v2 (categoryId auf Tasks, categories-Tabelle). Bei Schema-Änderungen immer neue `.version()` anlegen, nie bestehende ändern.

**shadcn/ui:** Nutzt `@base-ui/react`, nicht Radix. Die Props-API unterscheidet sich – z.B. kein `onPointerDownOutside` auf `DialogContent`.

**Dark Mode:** Wird client-seitig über `useTheme` Hook gesteuert, der `class="dark"` auf `<html>` setzt. `next-themes` ist nicht im Einsatz.

## Lokale Entwicklung

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Produktions-Build
```

## Lokalisierung

Alle UI-Strings in `src/i18n/de.ts`. Neue Sprachen: Datei anlegen, in `src/i18n/index.ts` einbinden, Sprachauswahl in Settings ergänzen.

## Mögliche nächste Schritte

- PWA-Manifest + Service Worker für Home-Screen-Installation
- Backend als Ersatz für IndexedDB (Supabase, tRPC o.ä.)
- Englische Übersetzung (`src/i18n/en.ts`)
- Wiederkehrende Aufgaben
- Native App (React Native mit geteiltem Service-Layer)
