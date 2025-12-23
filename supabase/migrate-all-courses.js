// Node.js script to migrate all courses from industry-data.ts to Supabase
// Run with: node supabase/migrate-all-courses.js

// Note: This requires your .env.local to be loaded
// You may need to install dotenv: npm install dotenv

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Import your course data
// Since it's TypeScript, you'll need to either:
// 1. Convert to JSON first, or
// 2. Use ts-node to run this

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Example course data structure
const courses = [
  {
    title: "PLC Programming & Automation",
    company_name: "Siemens",
    location: "Mumbai, India",
    type: "Industrial Training",
    duration: "6 weeks",
    price: "₹45,000",
    description: "Comprehensive PLC programming training covering Siemens S7-1200 and TIA Portal software with hands-on automation projects.",
    tags: ["PLC", "Automation", "Siemens", "Industrial"],
    contact: "+91 98765 43210",
    website: "https://siemens.com",
    rating: 4.8,
    student_count: 245,
    is_active: true
  },
  // Add more courses here...
]

async function migrateCourses() {
  console.log('Starting migration...')
  
  for (const course of courses) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
    
    if (error) {
      console.error(`Error inserting ${course.title}:`, error.message)
    } else {
      console.log(`✅ Inserted: ${course.title}`)
    }
  }
  
  console.log('Migration complete!')
}

migrateCourses()

