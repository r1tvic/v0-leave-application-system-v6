"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { validateDateRange, calculateLeaveDays } from "@/lib/utils/validation"
import { updateLeaveApplication } from "@/app/actions/leave"
import { createClient } from "@/lib/supabase/client"

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

interface EditApplicationFormProps {
  application: LeaveApplication
  leaveTypeId: string
  userId: string
}

export default function EditApplicationForm({ application, leaveTypeId, userId }: EditApplicationFormProps) {
  const [startDate, setStartDate] = useState(application.start_date)
  const [endDate, setEndDate] = useState(application.end_date)
  const [reason, setReason] = useState(application.reason)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null)
  const [leaveDays, setLeaveDays] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      const { data: balance } = await supabase
        .from("leave_balance")
        .select("remaining_days")
        .eq("student_id", userId)
        .eq("leave_type_id", leaveTypeId)
        .eq("year", new Date().getFullYear())
        .single()

      if (balance) {
        setLeaveBalance(balance)
      }
    }

    fetchLeaveBalance()
  }, [userId, leaveTypeId, supabase])

  // Update leave days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate)
      if (!validation) {
        const days = calculateLeaveDays(startDate, endDate)
        setLeaveDays(days)
      }
    }
  }, [startDate, endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!startDate || !endDate) {
      setError("Please select both start and end dates")
      return
    }
    if (!reason.trim()) {
      setError("Please provide a reason for your leave")
      return
    }

    const dateValidation = validateDateRange(startDate, endDate)
    if (dateValidation) {
      setError(dateValidation)
      return
    }

    // Check if requested days exceed available balance
    if (leaveBalance && leaveDays > leaveBalance.remaining_days) {
      setError(`You only have ${leaveBalance.remaining_days} days available for this leave type`)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateLeaveApplication(application.id, startDate, endDate, reason)

      if (!result.success) {
        setError(result.error || "An error occurred")
        setIsSubmitting(false)
        return
      }

      router.push("/student/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Leave Application</CardTitle>
          <CardDescription>Update your leave request for {application.leave_types?.name || "Unknown"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Leave Type</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded text-gray-700">
                {application.leave_types?.name || "Unknown"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            {leaveDays > 0 && (
              <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                Total leave days: {leaveDays}
                {leaveBalance && leaveDays <= leaveBalance.remaining_days && (
                  <span className="ml-1 text-green-600">✓ Within balance</span>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="reason">Reason for Leave *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for your leave request"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{reason.length}/500 characters</p>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Application"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
