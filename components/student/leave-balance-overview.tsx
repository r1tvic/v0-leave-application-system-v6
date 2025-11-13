"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeaveBalance {
  leave_type: string
  total_days: number
  used_days: number
  remaining_days: number
}

export default function LeaveBalanceOverview({
  studentId,
}: {
  studentId: string
}) {
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBalances = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("leave_balance")
        .select(
          `
          total_days,
          used_days,
          remaining_days,
          leave_type_id,
          leave_types(name)
        `,
        )
        .eq("student_id", studentId)
        .eq("year", new Date().getFullYear())

      if (data) {
        const formatted = data.map((item: any) => ({
          leave_type: item.leave_types?.name || "Unknown",
          total_days: item.total_days,
          used_days: item.used_days,
          remaining_days: item.remaining_days,
        }))
        setBalances(formatted)
      }
      setIsLoading(false)
    }

    fetchBalances()
  }, [studentId])

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {balances.map((balance) => (
            <div key={balance.leave_type} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">{balance.leave_type}</span>
                <span className="text-sm text-gray-600">
                  {balance.remaining_days} / {balance.total_days} days
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${(balance.remaining_days / balance.total_days) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Used: {balance.used_days} days</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
