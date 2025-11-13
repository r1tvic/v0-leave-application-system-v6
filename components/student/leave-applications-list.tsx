"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LeaveApplication {
  id: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
}

export default function LeaveApplicationsList({
  studentId,
}: {
  studentId: string
}) {
  const [applications, setApplications] = useState<LeaveApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("leave_applications")
        .select(
          `
          id,
          start_date,
          end_date,
          reason,
          status,
          leave_types(name)
        `,
        )
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })

      if (data) {
        const formatted = data.map((item: any) => ({
          id: item.id,
          leave_type: item.leave_types?.name || "Unknown",
          start_date: item.start_date,
          end_date: item.end_date,
          reason: item.reason,
          status: item.status,
        }))
        setApplications(formatted)
      }
      setIsLoading(false)
    }

    fetchApplications()
  }, [studentId])

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No leave applications yet. Ready to apply?</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Leave Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{app.leave_type}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(app.start_date).toLocaleDateString()} - {new Date(app.end_date).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={statusColors[app.status]}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-700 text-sm mb-3">{app.reason}</p>
              {app.status === "pending" && (
                <Link href={`/student/edit-application/${app.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
