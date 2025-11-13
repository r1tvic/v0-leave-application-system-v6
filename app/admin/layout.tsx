import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", data.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/student/dashboard")
  }

  const handleLogout = async () => {
    "use server"
    const supabaseServer = await createClient()
    await supabaseServer.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Leave Management - Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{profile?.full_name || "Admin"}</span>
            <form action={handleLogout}>
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
