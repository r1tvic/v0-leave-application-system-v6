import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateAdminRole() {
  try {
    // Get the user with email admin@vitc.ac.in
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()

    if (getUserError) {
      console.error("Error listing users:", getUserError)
      process.exit(1)
    }

    const adminUser = users.users.find((user) => user.email === "admin@vitc.ac.in")

    if (!adminUser) {
      console.error("Admin user not found")
      process.exit(1)
    }

    console.log("Found admin user:", adminUser.id)

    // Update the profile role to admin
    const { data, error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", adminUser.id).select()

    if (error) {
      console.error("Error updating admin role:", error)
      process.exit(1)
    }

    console.log("✓ Admin role updated successfully:", data)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

updateAdminRole()
