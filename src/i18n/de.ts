export const de = {
  app: {
    name: 'WauFlow',
    tagline: 'Aufgaben passend zu deiner Power.',
  },

  checkin: {
    subtitle: 'Wie viel Energie hast du heute?',
    confirm: 'Los geht\'s',
    adjustHint: 'Du kannst die Energie jederzeit noch anpassen.',
    saving: 'Speichere…',
    greetingMorning: 'Guten Morgen! 👋',
    greetingNoon: 'Guten Tag! ☀️',
    greetingAfternoon: 'Guten Nachmittag! 🌤️',
    greetingEvening: 'Guten Abend! 🌙',
    greetingNight: 'Noch wach? 🦉',
  },

  energy: {
    label: 'Energie heute',
    change: 'Energie anpassen',
    levels: {
      1: { label: 'Erschöpft', description: 'Kaum Energie – nur das Nötigste', emoji: '😴' },
      2: { label: 'Müde', description: 'Wenig Energie – leichte Aufgaben', emoji: '🥱' },
      3: { label: 'Normal', description: 'Normale Energie – der Alltag', emoji: '😊' },
      4: { label: 'Gut drauf', description: 'Gute Energie – anspruchsvolle Aufgaben', emoji: '💪' },
      5: { label: 'Volle Power', description: 'Maximale Energie – Deep Work', emoji: '🚀' },
    },
  },

  tasks: {
    today: 'Heute',
    empty: 'Keine Aufgaben für heute. Füge eine hinzu!',
    add: 'Aufgabe hinzufügen',
    addTitle: 'Neue Aufgabe',
    editTitle: 'Aufgabe bearbeiten',
    titleLabel: 'Titel',
    titlePlaceholder: 'Was möchtest du erledigen?',
    notesLabel: 'Notizen (optional)',
    notesPlaceholder: 'Weitere Details...',
    energyLabel: 'Benötigte Energie',
    categoryLabel: 'Kategorie',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    confirmDelete: 'Aufgabe wirklich löschen?',

    hiddenTitle: (count: number) =>
      count === 1
        ? '1 Aufgabe braucht mehr Energie'
        : `${count} Aufgaben brauchen mehr Energie`,
    showHidden: 'Trotzdem anzeigen',
    hideHidden: 'Ausblenden',

    completed: 'Erledigt',
    open: 'Offen',
    saving: 'Speichere…',
    edit: 'Bearbeiten',
    ariaMarkDone: 'Als erledigt markieren',
    ariaMarkOpen: 'Als offen markieren',
    noEnergyYet: 'Wie fit bist du heute?',
  },

  history: {
    title: 'Rückblick',
    noHistory: 'Noch keine vergangenen Tage.',
    backToToday: 'Zurück zu heute',
    completedCount: (n: number) => `${n} erledigt`,
    openCount: (n: number) => `${n} offen`,
    energyWas: 'Energie war:',
    noTasks: 'Keine Aufgaben an diesem Tag.',
    completedSection: (n: number) => `Erledigt (${n})`,
    openSection: (n: number) => `Nicht erledigt (${n})`,
    ariaOlderDay: 'Älterer Tag',
    ariaNewerDay: 'Neuerer Tag',
  },

  categories: {
    title: 'Kategorien',
    empty: 'Noch keine Kategorien.',
    add: 'Kategorie hinzufügen',
    namePlaceholder: 'Name der Kategorie',
    rename: 'Umbenennen',
    delete: 'Löschen',
    confirmDelete: 'Kategorie löschen? Aufgaben bleiben erhalten.',
    confirmDeleteShort: 'Löschen?',
    none: 'Keine Kategorie',
    dragHint: 'Halten & ziehen zum Sortieren',
    ariaDrag: 'Verschieben',
  },

  settings: {
    title: 'Einstellungen',
    resetTime: 'Tages-Reset um',
    resetTimeDescription: 'Zu dieser Uhrzeit wird die Aufgabenliste für den neuen Tag freigegeben.',
    theme: 'Design',
    themeOptions: { light: 'Hell', dark: 'Dunkel', system: 'System' },
    save: 'Speichern',
    saved: 'Gespeichert!',
  },

  nav: {
    today: 'Heute',
    history: 'Rückblick',
    settings: 'Einstellungen',
  },
} as const

export type Translations = typeof de
