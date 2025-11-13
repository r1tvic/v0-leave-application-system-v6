"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Application {
  id: string
  student_name: string
  student_email: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
}

interface PendingApplicationsListProps {
  initialApplications: Application[]
}

export default function PendingApplicationsList({ initialApplications }: PendingApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const isLoading = false

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No pending applications at this time.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{app.student_name}</h3>
                  <p className="text-sm text-gray-600">{app.student_email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {app.leave_type} • {new Date(app.start_date).toLocaleDateString()} -{" "}
                    {new Date(app.end_date).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
              <p className="text-gray-700 text-sm mb-3">{app.reason}</p>
              <Link href={`/admin/review-application/${app.id}`}>
                <Button>Review</Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
