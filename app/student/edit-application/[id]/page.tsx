import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import EditApplicationForm from "@/components/student/edit-application-form"

interface LeaveApplication {
  id: string
  leave_type_id: string
  start_date: string
  end_date: string
  reason: string
  status: string
  leave_types?: {
    name: string
  }
}

interface LeaveBalance {
  remaining_days: number
}

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: applicationId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: application, error } = await supabase
    .from("leave_applications")
    .select(
      `
      id,
      leave_type_id,
      start_date,
      end_date,
      reason,
      status,
      leave_types(name)
    `,
    )
    .eq("id", applicationId)
    .eq("student_id", user.id)
    .single()

  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded">Application not found</div>
      </div>
    )
  }

  if (application.status !== "pending") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-50 text-gray-700 p-4 rounded">
          This application cannot be edited as it is {application.status}.
        </div>
      </div>
    )
  }

  return (
    <EditApplicationForm
      application={application as LeaveApplication}
      leaveTypeId={application.leave_type_id}
      userId={user.id}
    />
  )
}
