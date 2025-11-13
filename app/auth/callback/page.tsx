"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      try {
        // Get the current session to verify email confirmation
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Email confirmed, redirect to dashboard
          router.replace("/student/dashboard")
        } else {
          // No user session, redirect to login
          router.replace("/auth/login")
        }
      } catch (error) {
        console.error("Error in auth callback:", error)
        router.replace("/auth/login")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verifying Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Please wait while we verify your email address...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
