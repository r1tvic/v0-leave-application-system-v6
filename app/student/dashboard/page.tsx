import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LeaveBalanceOverview from "@/components/student/leave-balance-overview"
import LeaveApplicationsList from "@/components/student/leave-applications-list"

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/student/apply-leave">
          <Button size="lg">Apply for Leave</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeaveApplicationsList studentId={data.user.id} />
        </div>
        <div>
          <LeaveBalanceOverview studentId={data.user.id} />
        </div>
      </div>
    </div>
  )
}
