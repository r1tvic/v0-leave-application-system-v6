"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { validateDateRange, calculateLeaveDays } from "@/lib/utils/validation"
import { submitLeaveApplication } from "@/app/actions/leave"

interface LeaveType {
  id: string
  name: string
  description: string
  max_days_per_year: number
}

interface LeaveBalance {
  leave_type_id: string
  remaining_days: number
}

export default function ApplyLeavePage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [selectedLeaveType, setSelectedLeaveType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null)
  const [leaveDays, setLeaveDays] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        router.push("/auth/login")
        return
      }

      const { data: types } = await supabase.from("leave_types").select("id, name, description, max_days_per_year")
      if (types) {
        setLeaveTypes(types)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [])

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

  // Fetch leave balance when leave type changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!selectedLeaveType) {
        setLeaveBalance(null)
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) return

      const { data } = await supabase
        .from("leave_balance")
        .select("remaining_days")
        .eq("student_id", userData.user.id)
        .eq("leave_type_id", selectedLeaveType)
        .eq("year", new Date().getFullYear())
        .single()

      if (data) {
        setLeaveBalance({
          leave_type_id: selectedLeaveType,
          remaining_days: data.remaining_days,
        })
      }
    }

    fetchBalance()
  }, [selectedLeaveType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!selectedLeaveType) {
      setError("Please select a leave type")
      return
    }
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
      const result = await submitLeaveApplication(selectedLeaveType, startDate, endDate, reason)

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

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
          <CardDescription>Submit a leave request for review by your manager</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="leave-type">Leave Type *</Label>
              <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.max_days_per_year} days/year)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {leaveBalance && (
                <p className="text-sm text-gray-500 mt-2">Available: {leaveBalance.remaining_days} days</p>
              )}
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
                {isSubmitting ? "Submitting..." : "Submit Application"}
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
