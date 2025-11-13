import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PendingApplicationsList from "@/components/admin/pending-applications-list"
import AllApplicationsView from "@/components/admin/all-applications-view"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect("/auth/login")
  }

  // Fetch summary statistics
  const { count: pendingCount } = await supabase
    .from("leave_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: approvedCount } = await supabase
    .from("leave_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved")

  const { count: totalApplications } = await supabase
    .from("leave_applications")
    .select("id", { count: "exact", head: true })

  const { data: pendingApplications } = await supabase
    .from("leave_applications")
    .select(
      `
      id,
      start_date,
      end_date,
      reason,
      status,
      leave_types(name),
      profiles(full_name, email)
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  const formattedApplications = (pendingApplications || []).map((item: any) => ({
    id: item.id,
    student_name: item.profiles?.full_name || "Unknown",
    student_email: item.profiles?.email || "Unknown",
    leave_type: item.leave_types?.name || "Unknown",
    start_date: item.start_date,
    end_date: item.end_date,
    reason: item.reason,
    status: item.status,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">{pendingCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{approvedCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{totalApplications || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PendingApplicationsList initialApplications={formattedApplications} />
        </div>
        <div>
          <AllApplicationsView />
        </div>
      </div>
    </div>
  )
}
