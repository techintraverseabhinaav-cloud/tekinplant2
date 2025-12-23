"use client"

import { useState } from "react"
import { Search, Play, Star, Users, Clock, MapPin, ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react"
import Navbar from "../src/components/Navbar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { industryCourses, industryStats, industryInsights } from "../lib/industry-data"

// Hero Illustration Component
const HeroIllustration = () => (
  <div className="relative w-full max-w-4xl mx-auto">
    <svg 
      viewBox="0 0 800 400" 
      className="w-full h-auto"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9"/>
        </linearGradient>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95"/>
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee"/>
          <stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>

      {/* Background Elements */}
      <rect width="800" height="400" fill="url(#bgGradient)" rx="20"/>
      
      {/* Floating Cards */}
      <g transform="translate(50, 80)">
        <rect x="0" y="0" width="200" height="120" rx="12" fill="url(#cardGradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.9"/>
        <text x="15" y="25" fill="#22d3ee" fontSize="12" fontWeight="600">Software Engineering</text>
        <text x="15" y="45" fill="#e2e8f0" fontSize="10">TechCorp Solutions</text>
        <text x="15" y="65" fill="#94a3b8" fontSize="9">₹25,000/month</text>
        <text x="15" y="85" fill="#64748b" fontSize="8">Bangalore, India</text>
        <rect x="15" y="95" width="60" height="20" rx="10" fill="url(#accentGradient)" opacity="0.8"/>
        <text x="45" y="108" fill="white" fontSize="8" textAnchor="middle">Apply</text>
      </g>

      <g transform="translate(300, 60)">
        <rect x="0" y="0" width="180" height="110" rx="12" fill="url(#cardGradient)" stroke="#3b82f6" strokeWidth="2" opacity="0.9"/>
        <text x="15" y="25" fill="#3b82f6" fontSize="12" fontWeight="600">Data Science</text>
        <text x="15" y="45" fill="#e2e8f0" fontSize="10">Analytics Pro</text>
        <text x="15" y="65" fill="#94a3b8" fontSize="9">₹30,000/month</text>
        <text x="15" y="85" fill="#64748b" fontSize="8">Mumbai, India</text>
        <rect x="15" y="95" width="60" height="20" rx="10" fill="url(#accentGradient)" opacity="0.8"/>
        <text x="45" y="108" fill="white" fontSize="8" textAnchor="middle">Apply</text>
      </g>

      <g transform="translate(520, 100)">
        <rect x="0" y="0" width="160" height="100" rx="12" fill="url(#cardGradient)" stroke="#8b5cf6" strokeWidth="2" opacity="0.9"/>
        <text x="15" y="25" fill="#8b5cf6" fontSize="12" fontWeight="600">Marketing</text>
        <text x="15" y="45" fill="#e2e8f0" fontSize="10">Digital Dynamics</text>
        <text x="15" y="65" fill="#94a3b8" fontSize="9">₹20,000/month</text>
        <text x="15" y="85" fill="#64748b" fontSize="8">Delhi, India</text>
        <rect x="15" y="95" width="60" height="20" rx="10" fill="url(#accentGradient)" opacity="0.8"/>
        <text x="45" y="108" fill="white" fontSize="8" textAnchor="middle">Apply</text>
      </g>

      {/* Central Search Bar */}
      <g transform="translate(200, 250)">
        <rect x="0" y="0" width="400" height="60" rx="30" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <circle cx="30" cy="30" r="8" fill="#22d3ee"/>
        <text x="45" y="35" fill="#94a3b8" fontSize="14">Search companies, roles or keywords</text>
        <rect x="320" y="15" width="60" height="30" rx="15" fill="url(#accentGradient)"/>
        <text x="350" y="35" fill="white" fontSize="12" textAnchor="middle" fontWeight="600">Search</text>
      </g>

      {/* Filter Buttons */}
      <g transform="translate(200, 330)">
        <rect x="0" y="0" width="80" height="30" rx="15" fill="rgba(34, 211, 238, 0.2)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="40" y="20" fill="#22d3ee" fontSize="10" textAnchor="middle">Find Match</text>
        
        <rect x="100" y="0" width="90" height="30" rx="15" fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" strokeWidth="1"/>
        <text x="145" y="20" fill="#8b5cf6" fontSize="10" textAnchor="middle">Top Companies</text>
        
        <rect x="210" y="0" width="60" height="30" rx="15" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="1"/>
        <text x="240" y="20" fill="#ec4899" fontSize="10" textAnchor="middle">Premium</text>
      </g>

      {/* Company Logos */}
      <g transform="translate(150, 380)">
        <text x="0" y="0" fill="#64748b" fontSize="12" textAnchor="middle">Goldman Sachs</text>
        <text x="120" y="0" fill="#64748b" fontSize="12" textAnchor="middle">TATA</text>
        <text x="220" y="0" fill="#64748b" fontSize="12" textAnchor="middle">Shopify</text>
        <text x="320" y="0" fill="#64748b" fontSize="12" textAnchor="middle">Pfizer</text>
      </g>
    </svg>
  </div>
)

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const featuredCourses = industryCourses.slice(0, 6)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to courses page with search parameter
      router.push(`/courses?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term)
    router.push(`/courses?search=${encodeURIComponent(term)}`)
  }

  // Get popular search terms from courses
  const popularSearches = [
    "PLC Training",
    "Automation",
    "Electrical Engineering",
    "Industrial Training",
    "Siemens",
    "ABB"
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Leading Industry Training Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-8">
                <span className="text-gradient">Transform</span> Your Career with
                <br />
                <span className="text-gradient">Industry</span> Training
              </h1>
              
              <p className="text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed">
                Connect with leading companies, master cutting-edge technologies, and accelerate your professional growth with our comprehensive training programs.
              </p>

              {/* Search Bar */}
              <div className="max-w-lg mb-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                      <input
                        type="text"
                    placeholder="Search for courses, companies, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/15 transition-all duration-300 text-lg"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Popular Searches */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(term)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses" className="btn-primary text-lg px-8 py-4 rounded-2xl flex items-center gap-2 group">
                  Explore Courses
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/partners" className="glass-card text-lg px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-white/20 transition-all duration-300">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Illustration */}
            <div className="animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="elegant-card text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gradient mb-2">{industryStats.totalStudents.toLocaleString()}</h3>
              <p className="text-gray-400">Students Trained</p>
            </div>
            
            <div className="elegant-card text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gradient mb-2">{industryStats.totalCourses}</h3>
              <p className="text-gray-400">Training Programs</p>
            </div>
            
            <div className="elegant-card text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gradient mb-2">{industryStats.totalPartners}</h3>
              <p className="text-gray-400">Partner Companies</p>
            </div>
            
            <div className="elegant-card text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gradient mb-2">{industryStats.averageRating}</h3>
              <p className="text-gray-400">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by <span className="text-gradient">Leading Companies</span>
            </h2>
            <p className="text-gray-400">Partner with industry leaders for world-class training</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Company Logos */}
            <div className="flex items-center justify-center p-6 elegant-card hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">Siemens</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 elegant-card hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">ABB</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 elegant-card hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">Rockwell</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 elegant-card hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">Emerson</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 elegant-card hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">Honeywell</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 elegant-card hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">FANUC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-blue-900/5 to-indigo-900/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-40 left-10 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Handpicked Programs</span>
                    </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Featured <span className="text-gradient">Training Programs</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover industry-leading training programs designed to accelerate your career growth
                      </p>
                    </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-2xl font-bold text-green-400">{course.price}</span>
                    <Link href={`/courses/${course.id}`} className="btn-primary text-sm px-4 py-2 rounded-xl">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses" className="btn-primary text-lg px-8 py-4 rounded-2xl inline-flex items-center gap-2">
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Industry Insights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Industry <span className="text-gradient">Insights</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Stay ahead with comprehensive analytics and market trends
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{industryInsights.successRate}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Success Rate</h3>
                <p className="text-gray-400">Program completion rate</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{industryInsights.placementRate}</span>
          </div>
                <h3 className="text-xl font-semibold text-white mb-2">Placement Rate</h3>
                <p className="text-gray-400">Job placement success</p>
        </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{industryInsights.averageCoursePrice}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Average Price</h3>
                <p className="text-gray-400">Course pricing</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{industryInsights.marketGrowth}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Market Growth</h3>
                <p className="text-gray-400">Year over year</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/insights" className="btn-primary text-lg px-8 py-4 rounded-2xl inline-flex items-center gap-2">
                Explore Insights
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to <span className="text-gradient">Transform</span> Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers with our industry-leading training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg px-8 py-4 rounded-2xl">
                Get Started Today
              </Link>
              <Link href="/partners" className="glass-card text-lg px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
                Explore Partners
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
