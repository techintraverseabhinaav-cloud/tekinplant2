"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { Search, Clock, Users, Star, MapPin, Building, Filter, ArrowRight } from "lucide-react"
import Navbar from "../../src/components/Navbar"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { industryCourses, industryStats } from "../../lib/industry-data"

function CoursesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [location, setLocation] = useState("All Locations")
  const searchParams = useSearchParams()

  // Get unique categories and locations for filters
  const categories = ["All Categories", ...new Set(industryCourses.map(course => course.type))]
  const locations = ["All Locations", ...new Set(industryCourses.map(course => course.location.split(',')[0]))]

  // Handle search parameter from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Filter courses based on search and filters - optimized with useMemo
  const filteredCourses = useMemo(() => {
    const searchLower = searchTerm.toLowerCase()
    return industryCourses.filter((course) => {
      const matchesSearch = !searchLower || 
        course.title.toLowerCase().includes(searchLower) ||
        course.company.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      const matchesCategory = category === "All Categories" || course.type === category
      const matchesLocation = location === "All Locations" || course.location.includes(location)
      
      return matchesSearch && matchesCategory && matchesLocation
    })
  }, [searchTerm, category, location])

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-40 right-20 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-40 left-20 w-6 h-6 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '-0.5s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Building className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Industry Training Programs</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Industry <span className="text-gradient">Training Programs</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Discover comprehensive training programs designed by industry experts to accelerate your career growth
            </p>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="elegant-card text-center hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-1">{industryStats.totalCourses}</h3>
                <p className="text-gray-400 text-sm">Training Programs</p>
              </div>
              <div className="elegant-card text-center hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-1">{industryStats.totalPartners}</h3>
                <p className="text-gray-400 text-sm">Partner Companies</p>
              </div>
              <div className="elegant-card text-center hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-1">{industryStats.totalStudents}</h3>
                <p className="text-gray-400 text-sm">Students Trained</p>
              </div>
              <div className="elegant-card text-center hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-1">{industryStats.averageRating}</h3>
                <p className="text-gray-400 text-sm">Average Rating</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search courses, companies, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 elegant-input"
                    />
                  </div>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="elegant-input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="elegant-input"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-400">
                {searchTerm && (
                  <span className="text-purple-400">
                    Search results for "{searchTerm}":{" "}
                  </span>
                )}
                Showing {filteredCourses.length} of {industryCourses.length} training programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? `No courses found for "${searchTerm}"` : "No courses found"}
              </h3>
              <p className="text-gray-400 mb-8">
                {searchTerm 
                  ? "Try adjusting your search terms or browse all courses" 
                  : "Try adjusting your search criteria or filters"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setCategory("All Categories")
                    setLocation("All Locations")
                  }}
                  className="btn-primary px-6 py-3 rounded-xl"
                >
                  Clear Filters
                </button>
                {searchTerm && (
                  <Link href="/courses" className="glass-card px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300">
                    View All Courses
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <div key={course.id} className="elegant-card hover-lift animate-fade-in-scale group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-black/50 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                        ⭐ {course.rating}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                        {course.type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                        {course.type}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{course.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{course.location.split(',')[0]}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-full text-sm border border-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">
                          +{course.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <span className="text-2xl font-bold text-green-400">{course.price}</span>
                      <Link href={`/courses/${course.id}`} className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to <span className="text-gradient">Start Learning</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with our industry-leading training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/partners" className="btn-primary text-lg px-8 py-4 rounded-2xl">
                Explore Partners
              </Link>
              <Link href="/insights" className="glass-card text-lg px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
                View Insights
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  )
}
