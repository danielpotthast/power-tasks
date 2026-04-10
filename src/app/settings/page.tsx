import { SettingsForm } from '@/components/settings/SettingsForm'
import { CategoryManager } from '@/components/settings/CategoryManager'
import { t } from '@/i18n'

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t.settings.title}</h1>
      <CategoryManager />
      <SettingsForm />
    </div>
  )
}
