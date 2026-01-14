/**
 * Migration Script: Transfer All Courses from industry-data.ts to Supabase
 * 
 * This script reads all courses from lib/industry-data.ts and inserts them into Supabase
 * 
 * Usage:
 * 1. Make sure you have .env.local with Supabase credentials
 * 2. Run: node scripts/migrate-courses-to-supabase.js
 * 
 * Requirements:
 * - npm install dotenv @supabase/supabase-js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local')
  console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read and parse industry-data.ts
function extractCoursesFromFile() {
  const filePath = path.join(__dirname, '../lib/industry-data.ts')
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found at ${filePath}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  
  // Extract the industryCourses array using regex
  const arrayMatch = fileContent.match(/export const industryCourses[^=]*=\s*(\[[\s\S]*?\]);/)
  
  if (!arrayMatch) {
    console.error('❌ Error: Could not find industryCourses array in file')
    process.exit(1)
  }

  // Evaluate the array (in a safe way)
  // Note: This is a simple approach. For production, use a proper TypeScript parser
  try {
    // Remove TypeScript type annotations and export statement
    let arrayString = arrayMatch[1]
    
    // Replace TypeScript-specific syntax
    arrayString = arrayString
      .replace(/:\s*IndustryCourse\[\]/g, '')
      .replace(/id:\s*(\d+)/g, '"id": $1')
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"')
    
    // Fix array syntax
    arrayString = arrayString.trim()
    if (!arrayString.startsWith('[')) arrayString = '[' + arrayString
    if (!arrayString.endsWith(']')) arrayString = arrayString + ']'
    
    const courses = JSON.parse(arrayString)
    return courses
  } catch (error) {
    console.error('❌ Error parsing courses:', error.message)
    console.error('   Trying alternative method...')
    
    // Alternative: Manual extraction using regex
    return extractCoursesManually(fileContent)
  }
}

function extractCoursesManually(content) {
  const courses = []
  const courseRegex = /\{\s*id:\s*(\d+),\s*title:\s*"([^"]+)",\s*company:\s*"([^"]+)",\s*location:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*duration:\s*"([^"]+)",\s*students:\s*(\d+),\s*rating:\s*([\d.]+),\s*price:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*tags:\s*\[([^\]]+)\],\s*contact:\s*"([^"]+)",\s*website:\s*"([^"]+)"\s*\}/g
  
  let match
  while ((match = courseRegex.exec(content)) !== null) {
    const tags = match[13].split(',').map(t => t.trim().replace(/"/g, ''))
    
    courses.push({
      id: parseInt(match[1]),
      title: match[2],
      company: match[3],
      location: match[4],
      type: match[5],
      duration: match[6],
      students: parseInt(match[7]),
      rating: parseFloat(match[8]),
      price: match[9],
      image: match[10],
      description: match[11],
      tags: tags,
      contact: match[14],
      website: match[15]
    })
  }
  
  return courses
}

// Map course data to Supabase format
function mapCourseToSupabase(course) {
  return {
    title: course.title,
    company_name: course.company,
    location: course.location,
    type: course.type,
    duration: course.duration,
    price: course.price,
    image_url: course.image,
    description: course.description,
    tags: course.tags,
    contact: course.contact,
    website: course.website,
    rating: course.rating,
    student_count: course.students,
    is_active: true
  }
}

// Get company ID by name
async function getCompanyId(companyName) {
  const { data, error } = await supabase
    .from('companies')
    .select('id')
    .eq('name', companyName)
    .single()
  
  if (error || !data) {
    console.warn(`⚠️  Warning: Company "${companyName}" not found in database`)
    return null
  }
  
  return data.id
}

// Main migration function
async function migrateCourses() {
  console.log('🚀 Starting course migration...\n')
  
  // Extract courses from file
  console.log('📖 Reading courses from lib/industry-data.ts...')
  const courses = extractCoursesFromFile()
  console.log(`✅ Found ${courses.length} courses\n`)
  
  // Check if courses already exist
  const { data: existingCourses } = await supabase
    .from('courses')
    .select('title')
    .limit(1)
  
  if (existingCourses && existingCourses.length > 0) {
    console.log('⚠️  Warning: Courses already exist in database')
    console.log('   Do you want to continue? (This will add duplicate courses)')
    console.log('   To clear existing courses, run: DELETE FROM public.courses; in Supabase SQL Editor\n')
  }
  
  let successCount = 0
  let errorCount = 0
  const errors = []
  
  // Insert courses in batches
  const batchSize = 5
  for (let i = 0; i < courses.length; i += batchSize) {
    const batch = courses.slice(i, i + batchSize)
    
    console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1} (courses ${i + 1}-${Math.min(i + batchSize, courses.length)})...`)
    
    for (const course of batch) {
      try {
        const courseData = mapCourseToSupabase(course)
        
        // Get company ID
        const companyId = await getCompanyId(course.company)
        if (companyId) {
          courseData.company_id = companyId
        }
        
        // Insert course
        const { data, error } = await supabase
          .from('courses')
          .insert(courseData)
          .select()
        
        if (error) {
          throw error
        }
        
        console.log(`  ✅ Inserted: ${course.title}`)
        successCount++
      } catch (error) {
        console.error(`  ❌ Error inserting "${course.title}":`, error.message)
        errorCount++
        errors.push({ course: course.title, error: error.message })
      }
    }
    
    // Small delay between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary')
  console.log('='.repeat(50))
  console.log(`✅ Successfully inserted: ${successCount} courses`)
  console.log(`❌ Errors: ${errorCount} courses`)
  console.log(`📝 Total processed: ${courses.length} courses`)
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.forEach(({ course, error }) => {
      console.log(`   - ${course}: ${error}`)
    })
  }
  
  // Verify migration
  console.log('\n🔍 Verifying migration...')
  const { data: insertedCourses, error: verifyError } = await supabase
    .from('courses')
    .select('id, title, company_name')
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (!verifyError && insertedCourses) {
    console.log(`✅ Found ${insertedCourses.length} courses in database (showing latest 10)`)
    insertedCourses.forEach(c => {
      console.log(`   - ${c.title} (${c.company_name})`)
    })
  }
  
  console.log('\n✨ Migration complete!')
}

// Run migration
migrateCourses().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

