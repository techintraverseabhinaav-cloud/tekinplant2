"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Clock, Users, Star, MapPin, Calendar, BookOpen, CheckCircle, Play, Download, Building, Mail, Globe } from "lucide-react"
import Navbar from "../../../src/components/Navbar"
import Image from "next/image"
import Link from "next/link"

interface Course {
  id: string
  title: string
  company_name: string
  location: string
  type: string
  duration: string
  price: string
  image_url: string
  description: string
  tags: string[]
  rating: number
  student_count: number
  instructor_id: string | null
  syllabus: string[]
  requirements: string[]
  outcomes: string[]
  contact: string | null
  website: string | null
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  // Fetch course data from API
  useEffect(() => {
    async function fetchCourse() {
      console.log('📚 Fetching course:', resolvedParams.id)
      setIsLoading(true)
      setError(null)
      
      // Validate UUID format
      if (!uuidRegex.test(resolvedParams.id)) {
        console.error('❌ Invalid course ID format:', resolvedParams.id)
        setError(`Invalid course ID format. Expected UUID, got: "${resolvedParams.id}". Please select a course from the courses page.`)
        setIsLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/courses?id=${resolvedParams.id}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ API Error Response:', errorData)
          console.error('❌ Status Code:', response.status)
          
          // Build detailed error message
          let errorMessage = errorData.error || `Failed to fetch course (${response.status})`
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`
          }
          if (errorData.hint) {
            errorMessage += ` (${errorData.hint})`
          }
          if (errorData.code) {
            console.error('❌ Error Code:', errorData.code)
          }
          
          throw new Error(errorMessage)
        }
        
        const data = await response.json()
        console.log('✅ Course data received:', data)
        
        if (!data || !data.id) {
          throw new Error('Invalid course data received from server')
        }
        
        setCourseData(data)
      } catch (err: any) {
        console.error('❌ Error fetching course:', err)
        console.error('❌ Error stack:', err.stack)
        setError(err.message || 'Failed to load course details.')
        setCourseData(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourse()
  }, [resolvedParams.id])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('slide-up')) {
            entry.target.classList.add('slide-up-visible')
          }
        }
      })
    }, { threshold: 0.1 })
    
    const elements = document.querySelectorAll('.slide-up')
    elements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [courseData]) // Re-run when course data loads

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading course details...</div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-red-500 text-xl text-center p-6 bg-gray-800 rounded-lg max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Error Loading Course</h2>
          <p className="mb-2">{error || "Course data could not be loaded."}</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400">Troubleshooting steps:</p>
            <ul className="text-sm text-gray-400 text-left list-disc list-inside space-y-1">
              <li>Check if the course ID is correct</li>
              <li>Verify your database connection</li>
              <li>Check the browser console for detailed error messages</li>
              <li>Visit <Link href="/api/test-db" className="text-purple-400 hover:underline">/api/test-db</Link> to test database connection</li>
            </ul>
          </div>
          <div className="mt-6 space-x-4">
            <Link 
              href="/courses"
              className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Back to Courses
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Fallback values for potentially null fields
  const courseSyllabus = courseData.syllabus || []
  const courseRequirements = courseData.requirements || []
  const courseOutcomes = courseData.outcomes || []
  const courseContact = courseData.contact || "N/A"
  const courseWebsite = courseData.website || "#"

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#000000' }}>
      <Navbar />
      
      {/* Course Header */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[1px]" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)' }}></div>
        <div className="slide-up relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="slide-up text-4xl lg:text-5xl font-normal mb-6" style={{ transitionDelay: '0.1s' }}>
                  <span className="text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{courseData.title}</span>
                </h1>
                <div className="slide-up flex flex-wrap items-center gap-6 mb-6" style={{ transitionDelay: '0.2s' }}>
                  <span className="flex items-center text-white/70">
                    <Building size={20} className="mr-2" style={{ color: '#c084fc' }} />
                    {courseData.company_name || 'N/A'}
                  </span>
                  <span className="flex items-center text-white/70">
                    <MapPin size={20} className="mr-2" style={{ color: '#c084fc' }} />
                    {courseData.location}
                  </span>
                </div>
                <p className="slide-up text-xl text-white/70 leading-relaxed" style={{ transitionDelay: '0.3s' }}>
                  {courseData.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="slide-up rounded-xl p-4 text-center backdrop-blur-xl border transition-all duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(168,85,247,0.25)', transitionDelay: '0.4s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(196,181,253,0.4), 0 0 30px rgba(196,181,253,0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">{courseData.duration}</div>
                  <div className="text-sm text-white/70 mt-1">Duration</div>
                </div>
                <div className="slide-up rounded-xl p-4 text-center backdrop-blur-xl border transition-all duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(168,85,247,0.25)', transitionDelay: '0.5s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(196,181,253,0.4), 0 0 30px rgba(196,181,253,0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">{courseData.student_count}</div>
                  <div className="text-sm text-white/70 mt-1">Students</div>
                </div>
                <div className="slide-up rounded-xl p-4 text-center backdrop-blur-xl border transition-all duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(168,85,247,0.25)', transitionDelay: '0.6s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(196,181,253,0.4), 0 0 30px rgba(196,181,253,0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">{courseData.rating}</div>
                  <div className="text-sm text-white/70 mt-1">Rating</div>
                </div>
                <div className="slide-up rounded-xl p-4 text-center backdrop-blur-xl border transition-all duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(168,85,247,0.25)', transitionDelay: '0.7s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(196,181,253,0.4), 0 0 30px rgba(196,181,253,0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">{courseData.price}</div>
                  <div className="text-sm text-white/70 mt-1">Price</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="slide-up rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(168,85,247,0.25)', transitionDelay: '0.8s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(196,181,253,0.5), 0 0 40px rgba(196,181,253,0.3)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div className="flex flex-wrap gap-4 mb-6 border-b" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
                  {[
                    { id: "overview", label: "Overview", icon: BookOpen },
                    { id: "syllabus", label: "Syllabus", icon: CheckCircle },
                    { id: "requirements", label: "Requirements", icon: CheckCircle },
                    { id: "outcomes", label: "Learning Outcomes", icon: CheckCircle }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 pb-4 px-2 border-b-2 transition-all duration-300 ${
                        activeTab === tab.id
                          ? "border-purple-400 text-white"
                          : "border-transparent text-white/70 hover:text-white"
                      }`}
                      style={activeTab === tab.id ? { borderColor: '#c084fc' } : {}}
                    >
                      <tab.icon size={20} style={{ color: activeTab === tab.id ? '#c084fc' : 'rgba(255,255,255,0.7)' }} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">About This Program</h3>
                        <p className="text-white/70 leading-relaxed">
                          {courseData.description}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">Company & Contact</h3>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm border" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(168,85,247,0.25)', color: '#c084fc' }}>
                            {(courseData.company_name || 'N/A').split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{courseData.company_name || 'N/A'}</div>
                            <div className="text-white/70">{courseData.location}</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {courseContact !== "N/A" && (
                            <div className="flex items-center space-x-2 text-white/70">
                              <Mail size={16} style={{ color: '#c084fc' }} />
                              <span>{courseContact}</span>
                            </div>
                          )}
                          {courseWebsite !== "#" && courseWebsite !== "N/A" && (
                            <div className="flex items-center space-x-2">
                              <Globe size={16} style={{ color: '#c084fc' }} />
                              <a href={courseWebsite} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" style={{ color: '#c084fc' }}>
                                {courseWebsite}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "syllabus" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-white">Course Syllabus</h3>
                      {courseSyllabus.length > 0 ? (
                        <div className="space-y-4">
                          {courseSyllabus.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold backdrop-blur-sm border flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(168,85,247,0.25)', color: '#c084fc' }}>
                                {index + 1}
                              </div>
                              <span className="text-white/70 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/70">Syllabus details will be available soon.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "requirements" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-white">Prerequisites & Requirements</h3>
                      {courseRequirements.length > 0 ? (
                        <div className="space-y-4">
                          {courseRequirements.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                              <span className="text-white/70 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/70">No specific requirements listed.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "outcomes" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-white">What You'll Learn</h3>
                      {courseOutcomes.length > 0 ? (
                        <div className="space-y-4">
                          {courseOutcomes.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                              <span className="text-white/70 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/70">Learning outcomes will be available soon.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="slide-up rounded-2xl p-6 backdrop-blur-xl border sticky top-24 transition-all duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(168,85,247,0.25)', transitionDelay: '0.9s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(196,181,253,0.5), 0 0 40px rgba(196,181,253,0.3)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div className="aspect-video rounded-xl overflow-hidden mb-6 border" style={{ borderColor: 'rgba(168,85,247,0.25)' }}>
                  <Image
                    src={courseData.image_url || '/placeholder.svg'}
                    alt={courseData.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>

                <div className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">
                  {courseData.price}
                </div>

                <Link
                  href={`/enroll/${resolvedParams.id}`}
                  className="w-full px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 backdrop-blur-sm border border-purple-400/40 mb-4 block text-center text-sm"
                  style={{ background: 'linear-gradient(to right, #a78bfa, #c084fc, #a78bfa)', color: '#ffffff', boxShadow: '0 0 20px rgba(196,181,253,0.4), 0 0 40px rgba(196,181,253,0.2)' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(196,181,253,0.6), 0 0 50px rgba(196,181,253,0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(196,181,253,0.4), 0 0 40px rgba(196,181,253,0.2)'}
                >
                  Enroll Now
                </Link>

                <button className="w-full px-4 py-2 rounded-xl font-semibold transition-all duration-300 mb-6 border backdrop-blur-sm text-sm"                 style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(168,85,247,0.3)', color: '#ffffff' }} onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)'
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'
                }}>
                  Add to Wishlist
                </button>

                <div className="space-y-4 text-sm pt-4 border-t" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white">{courseData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Students:</span>
                    <span className="text-white">{courseData.student_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Rating:</span>
                    <span className="flex items-center text-white">
                      <Star size={16} className="mr-1" style={{ color: '#fbbf24' }} />
                      {courseData.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Type:</span>
                    <span className="text-white">{courseData.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
