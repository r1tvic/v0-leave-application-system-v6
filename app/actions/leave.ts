"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitLeaveApplication(leaveTypeId: string, startDate: string, endDate: string, reason: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error("Not authenticated")
    }

    // Verify user is a student
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "student") {
      throw new Error("Only students can apply for leave")
    }

    // Check leave balance
    const { data: balance } = await supabase
      .from("leave_balance")
      .select("remaining_days")
      .eq("student_id", user.id)
      .eq("leave_type_id", leaveTypeId)
      .eq("year", new Date().getFullYear())
      .single()

    // Calculate leave days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const leaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    if (balance && leaveDays > balance.remaining_days) {
      throw new Error(`You only have ${balance.remaining_days} days available for this leave type`)
    }

    const supabaseAdmin = await createClient()

    // Insert leave application using admin client
    const { error: insertError } = await supabaseAdmin.from("leave_applications").insert({
      student_id: user.id,
      leave_type_id: leaveTypeId,
      start_date: startDate,
      end_date: endDate,
      reason,
      status: "pending",
    })

    if (insertError) {
      console.error("[v0] Insert error:", insertError.message)
      throw new Error("Failed to submit leave application. Please try again.")
    }

    revalidatePath("/student/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Leave submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while submitting your leave application",
    }
  }
}

export async function updateLeaveApplication(
  applicationId: string,
  startDate: string,
  endDate: string,
  reason: string,
) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error("Not authenticated")
    }

    // Get the application
    const { data: application, error: fetchError } = await supabase
      .from("leave_applications")
      .select("*")
      .eq("id", applicationId)
      .single()

    if (fetchError || !application) {
      throw new Error("Application not found")
    }

    // Check if user owns this application
    if (application.student_id !== user.id) {
      throw new Error("Unauthorized")
    }

    // Check if application is still pending
    if (application.status !== "pending") {
      throw new Error("Only pending applications can be edited")
    }

    // Calculate leave days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const leaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // Check leave balance
    const { data: balance } = await supabase
      .from("leave_balance")
      .select("remaining_days")
      .eq("student_id", user.id)
      .eq("leave_type_id", application.leave_type_id)
      .eq("year", new Date().getFullYear())
      .single()

    if (balance && leaveDays > balance.remaining_days) {
      throw new Error(`You only have ${balance.remaining_days} days available for this leave type`)
    }

    const { error: updateError } = await supabase
      .from("leave_applications")
      .update({
        start_date: startDate,
        end_date: endDate,
        reason,
      })
      .eq("id", applicationId)

    if (updateError) {
      console.error("[v0] Update error:", updateError.message)
      throw new Error("Failed to update leave application. Please try again.")
    }

    revalidatePath("/student/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Leave update error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while updating your leave application",
    }
  }
}

export async function approveOrRejectApplication(
  applicationId: string,
  status: "approved" | "rejected",
  adminComments: string,
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error("Not authenticated")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      throw new Error("Only admins can approve or reject applications")
    }

    const { error: updateError } = await supabase
      .from("leave_applications")
      .update({
        status,
        admin_comments: adminComments,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", applicationId)

    if (updateError) {
      console.error("[v0] Admin update error:", updateError.message)
      throw new Error("Failed to update application status")
    }

    if (status === "approved") {
      const { data: application } = await supabase
        .from("leave_applications")
        .select("student_id, leave_type_id, start_date, end_date")
        .eq("id", applicationId)
        .single()

      if (application) {
        const start = new Date(application.start_date)
        const end = new Date(application.end_date)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const leaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        await supabase
          .from("leave_balance")
          .update({
            remaining_days: supabase.raw(`remaining_days - ${leaveDays}`),
          })
          .eq("student_id", application.student_id)
          .eq("leave_type_id", application.leave_type_id)
          .eq("year", new Date().getFullYear())
      }
    }

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Admin action error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
