"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { approveOrRejectApplication } from "@/app/actions/leave"

interface Application {
  id: string
  student_name: string
  student_email: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
  admin_comments: string | null
}

export default function ReviewApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [adminComments, setAdminComments] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchApplication = async () => {
      const { data } = await supabase
        .from("leave_applications")
        .select(
          `
          id,
          start_date,
          end_date,
          reason,
          status,
          admin_comments,
          leave_types(name),
          profiles(full_name, email)
        `,
        )
        .eq("id", applicationId)
        .single()

      if (data) {
        const formatted: Application = {
          id: data.id,
          student_name: data.profiles?.full_name || "Unknown",
          student_email: data.profiles?.email || "Unknown",
          leave_type: data.leave_types?.name || "Unknown",
          start_date: data.start_date,
          end_date: data.end_date,
          reason: data.reason,
          status: data.status,
          admin_comments: data.admin_comments,
        }
        setApplication(formatted)
        setAdminComments(data.admin_comments || "")
      }
      setIsLoading(false)
    }

    fetchApplication()
  }, [applicationId])

  const handleApprove = async () => {
    await updateApplicationStatus("approved")
  }

  const handleReject = async () => {
    await updateApplicationStatus("rejected")
  }

  const updateApplicationStatus = async (newStatus: "approved" | "rejected") => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await approveOrRejectApplication(applicationId, newStatus, adminComments)

      if (!result.success) {
        throw new Error(result.error || "An error occurred")
      }

      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!application) {
    return <div>Application not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Review Leave Application</CardTitle>
          <CardDescription>Review and approve or reject this leave request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Student Name</p>
              <p className="font-semibold">{application.student_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{application.student_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Leave Type</p>
              <p className="font-semibold">{application.leave_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-semibold">{new Date(application.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="font-semibold">{new Date(application.end_date).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Reason for Leave</p>
            <p className="bg-gray-50 p-3 rounded">{application.reason}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Admin Comments</label>
            <Textarea
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              placeholder="Add comments about this application"
            />
          </div>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

          {application.status === "pending" && (
            <div className="flex gap-3">
              <Button onClick={handleApprove} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Processing..." : "Approve"}
              </Button>
              <Button onClick={handleReject} disabled={isSubmitting} variant="destructive">
                {isSubmitting ? "Processing..." : "Reject"}
              </Button>
              <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
