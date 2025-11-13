"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ApplicationSummary {
  status: string
  count: number
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
}

export default function AllApplicationsView() {
  const [summary, setSummary] = useState<ApplicationSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      const supabase = createClient()
      const { data } = await supabase.rpc("get_application_summary")

      if (data) {
        setSummary(data)
      } else {
        // Fallback: fetch counts manually
        const statuses = ["pending", "approved", "rejected", "cancelled"]
        const counts = await Promise.all(
          statuses.map(async (status) => {
            const { count } = await supabase
              .from("leave_applications")
              .select("id", { count: "exact", head: true })
              .eq("status", status)
            return { status, count: count || 0 }
          }),
        )
        setSummary(counts)
      }
      setIsLoading(false)
    }

    fetchSummary()
  }, [])

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Application Status Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {summary.map((item) => (
            <div key={item.status} className="flex justify-between items-center">
              <Badge className={statusColors[item.status]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
              <span className="font-semibold text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
