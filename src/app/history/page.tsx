import { HistoryView } from '@/components/history/HistoryView'
import { t } from '@/i18n'

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t.history.title}</h1>
      <HistoryView />
    </div>
  )
}
