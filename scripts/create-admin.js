import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminAccount() {
  try {
    console.log("Creating admin account...")

    // Create the user with auth.admin.createUser()
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@vitc.ac.in",
      password: "admin",
      email_confirm: true, // Auto-confirm email
    })

    if (error) {
      console.error("Error creating user:", error.message)
      process.exit(1)
    }

    const userId = data.user.id
    console.log("User created with ID:", userId)

    // Create profile with admin role
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      full_name: "Admin",
      role: "admin",
    })

    if (profileError) {
      console.error("Error creating profile:", profileError.message)
      process.exit(1)
    }

    console.log("✓ Admin account created successfully!")
    console.log("Email: admin@vitc.ac.in")
    console.log("Password: admin")
  } catch (err) {
    console.error("Unexpected error:", err)
    process.exit(1)
  }
}

createAdminAccount()
