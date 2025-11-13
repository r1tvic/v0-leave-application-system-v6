import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data?.user) {
    // Get user profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

    if (profile?.role === "admin") {
      redirect("/admin/dashboard")
    } else {
      redirect("/student/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Leave Application System</h1>
        <p className="text-gray-600 mb-8">Manage your leave requests efficiently and transparently</p>
        <div className="flex flex-col gap-3">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up" className="w-full">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
