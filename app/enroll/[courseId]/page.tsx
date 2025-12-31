"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ArrowLeft, CreditCard, User, Mail, Phone, Calendar, CheckCircle, Clock, Users, Star, ChevronDown } from "lucide-react"
import Navbar from "../../../src/components/Navbar"
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
}

export default function EnrollmentPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCourse, setIsLoadingCourse] = useState(true)
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    experience: "beginner",
    goals: "",
    paymentMethod: "card"
  })

  // Fetch course data from API
  useEffect(() => {
    async function fetchCourse() {
      console.log('📚 Fetching course:', resolvedParams.courseId)
      setIsLoadingCourse(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/courses?id=${resolvedParams.courseId}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch course (${response.status})`)
        }
        
        const data = await response.json()
        console.log('✅ Course data received:', data)
        setCourseData(data)
      } catch (err: any) {
        console.error('❌ Error fetching course:', err)
        setError(err.message || 'Failed to load course details.')
        setCourseData(null)
      } finally {
        setIsLoadingCourse(false)
      }
    }
    fetchCourse()
  }, [resolvedParams.courseId])

  // Pre-fill form with user data from Clerk
  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.emailAddresses[0]?.emailAddress || prev.email,
      }))
    }
  }, [isLoaded, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert("Please sign in to enroll in a course.")
      router.push("/login")
      return
    }

    if (!courseData?.id) {
      alert("Course data not loaded. Please wait and try again.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      console.log('📝 Submitting enrollment for course:', courseData.id)
      
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseData.id, // Use the actual UUID from courseData
        }),
      })

      console.log('📡 Enrollment API response status:', response.status)

      const data = await response.json()
      console.log('📋 Enrollment API response:', data)

      if (!response.ok) {
        console.error('❌ Enrollment failed:', data)
        throw new Error(data.error || data.details || 'Failed to enroll')
      }

      console.log('✅ Enrollment successful:', data.enrollment)

      // Success - redirect to student dashboard
      alert("Enrollment successful! You can now access the course from your dashboard.")
      router.push("/student-dashboard")
    } catch (error: any) {
      console.error('❌ Enrollment error:', error)
      setError(error.message || "Failed to enroll. Please try again.")
      alert(error.message || "Failed to enroll. Please try again. Check console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isLoadingCourse || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading course details...</div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl text-center p-4 bg-gray-800 rounded-lg">
          <p>Error: {error || "Course data could not be loaded."}</p>
          <p className="text-sm text-gray-400 mt-2">Please try refreshing the page.</p>
          <Link 
            href="/courses"
            className="mt-4 inline-block text-purple-400 hover:text-purple-300"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/courses/${courseData.id}`}
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Course
          </Link>
          <h1 className="text-4xl font-bold mb-2">Enroll in Course</h1>
          <p className="text-gray-400">Complete your enrollment for {courseData.title}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enrollment Form */}
          <div className="space-y-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter your job title"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-2">
                    Experience Level
                  </label>
                  <div className="relative">
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                      className="w-full px-4 py-3 pr-10 rounded-xl text-white focus:outline-none transition-all duration-300 backdrop-blur-xl border appearance-none cursor-pointer"
                      style={{ 
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderColor: 'rgba(168,85,247,0.3)',
                        boxShadow: '0 0 15px rgba(196,181,253,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(196,181,253,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(196,181,253,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(196,181,253,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(196,181,253,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                  >
                      <option value="beginner" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Beginner</option>
                      <option value="intermediate" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Intermediate</option>
                      <option value="advanced" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Advanced</option>
                  </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-5 h-5" style={{ color: '#c084fc' }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="goals" className="block text-sm font-medium mb-2">
                    Learning Goals
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="What do you hope to achieve from this course?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Payment Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 flex items-center">
                        <CreditCard size={20} className="mr-2" />
                        Credit/Debit Card
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === "bank"}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isLoaded || !user || isLoadingCourse || !courseData}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-base"
                >
                  {isSubmitting ? "Enrolling..." : isLoadingCourse ? "Loading..." : `Complete Enrollment - ${courseData.price}`}
                </button>
                {!user && isLoaded && (
                  <p className="text-sm text-yellow-400 mt-2 text-center">
                    Please sign in to enroll in this course.
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-400 mt-2 text-center">
                    {error}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Course Summary */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Course Summary</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">{courseData.title}</h3>
                  <p className="text-gray-400">Company: {courseData.company_name || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="mr-2 text-purple-400" />
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users size={16} className="mr-2 text-purple-400" />
                    <span>{courseData.student_count} students</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star size={16} className="mr-2 text-purple-400" />
                    <span>{courseData.rating} rating</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="mr-2 text-purple-400" />
                    <span>Starts TBD</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Location:</p>
                  <p className="text-sm">{courseData.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-sm">Lifetime access to course materials</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-sm">Live interactive sessions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-sm">Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-sm">1-on-1 mentoring sessions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-sm">Project portfolio development</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-sm">Career guidance and support</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Course Fee:</span>
                  <span className="font-semibold">{courseData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registration Fee:</span>
                  <span className="font-semibold">$50</span>
                </div>
                <div className="flex justify-between">
                  <span>Study Materials:</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="pt-3 border-t border-gray-700">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-purple-400">
                      {(() => {
                        // Extract numeric value from price string (handles ₹, $, commas)
                        const priceStr = courseData.price.replace(/[₹$,]/g, '');
                        const courseFee = parseInt(priceStr) || 0;
                        
                        // Detect currency symbol from original price
                        const currencySymbol = courseData.price.includes('₹') ? '₹' : courseData.price.includes('$') ? '$' : '₹';
                        
                        // Registration fee is always $50, convert to same currency as course
                        const registrationFeeUSD = 50;
                        let registrationFee = registrationFeeUSD;
                        
                        // Convert $50 to ₹ if course is in Indian Rupees (using approximate rate: 1 USD = 83 INR)
                        if (currencySymbol === '₹') {
                          registrationFee = Math.round(registrationFeeUSD * 83); // Convert $50 to ₹
                        }
                        
                        const total = courseFee + registrationFee;
                        
                        // Format with commas for Indian Rupees, simple format for USD
                        if (currencySymbol === '₹') {
                          return `${currencySymbol}${total.toLocaleString('en-IN')}`;
                        } else {
                          return `${currencySymbol}${total.toLocaleString('en-US')}`;
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}