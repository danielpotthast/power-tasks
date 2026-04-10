import { TaskList } from '@/components/tasks/TaskList'
import { TodayHeader } from '@/components/tasks/TodayHeader'

export default function TodayPage() {
  return (
    <div className="space-y-6">
      <TodayHeader />
      <TaskList />
    </div>
  )
}
