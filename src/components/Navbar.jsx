"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Menu, X, Search, User, Bell, LogOut, Settings } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false)
  const [showDashboardsDropdown, setShowDashboardsDropdown] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const coursesDropdownTimerRef = useRef(null)
  const dashboardsDropdownTimerRef = useRef(null)
  const userMenuTimerRef = useRef(null)
  const searchInputRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  
  // Get user role from Clerk metadata
  const userRole = (user?.publicMetadata?.role) || 'student'
  const userName = user?.fullName || user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'
  const userEmail = user?.emailAddresses[0]?.emailAddress || ''

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target
      if (showUserMenu && target instanceof Element && !target.closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (coursesDropdownTimerRef.current) clearTimeout(coursesDropdownTimerRef.current)
      if (dashboardsDropdownTimerRef.current) clearTimeout(dashboardsDropdownTimerRef.current)
      if (userMenuTimerRef.current) clearTimeout(userMenuTimerRef.current)
    }
  }, [])

  const handleLogout = async () => {
    await signOut()
    setShowUserMenu(false)
    setIsMenuOpen(false)
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/login"
    
    const dashboardRoutes = {
      student: "/student-dashboard",
      trainer: "/trainer-dashboard",
      admin: "/admin-dashboard",
      corporate: "/corporate-dashboard"
    }
    return dashboardRoutes[userRole] || "/login"
  }

  const handleSearch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const trimmedSearch = searchTerm.trim()
    if (trimmedSearch) {
      const searchQuery = encodeURIComponent(trimmedSearch)
      setShowSearch(false)
      setSearchTerm("")
      // Navigate immediately without delay
      router.push(`/courses?search=${searchQuery}`)
    }
  }

  const handleSearchClick = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      // Use requestAnimationFrame for immediate focus
      requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearch && event.target instanceof Element && !event.target.closest('.search-container')) {
        setShowSearch(false)
      }
    }
    
    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSearch])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-card border-b border-white/10 backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <span className="text-xl lg:text-2xl font-bold text-gradient">TrainIn</span>
              <div className="text-xs text-gray-400 -mt-1">Portal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Home */}
            <Link
              href="/"
              className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Courses + sub‑pages */}
            <div 
              className="relative group"
              onMouseEnter={() => {
                if (coursesDropdownTimerRef.current) {
                  clearTimeout(coursesDropdownTimerRef.current)
                  coursesDropdownTimerRef.current = null
                }
                setShowCoursesDropdown(true)
              }}
              onMouseLeave={() => {
                const timer = setTimeout(() => {
                  setShowCoursesDropdown(false)
                }, 1500)
                coursesDropdownTimerRef.current = timer
              }}
            >
              <Link
                href="/courses"
                className="inline-flex items-center text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white"
              >
              Courses
                <span className="ml-1 text-xs text-gray-400 group-hover:text-gray-200">▼</span>
              </Link>
              <div 
                className={`${showCoursesDropdown ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-all duration-200 absolute left-0 mt-3 w-64 glass-card rounded-2xl border border-white/10 shadow-xl bg-black/60 backdrop-blur-xl z-40`}
                onMouseEnter={() => {
                  if (coursesDropdownTimerRef.current) {
                    clearTimeout(coursesDropdownTimerRef.current)
                    coursesDropdownTimerRef.current = null
                  }
                  setShowCoursesDropdown(true)
                }}
              >
                <div className="py-3">
                  <Link
                    href="/courses"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
                  >
                    All Courses
                  </Link>
                  {/* Example course detail pages – these map to app/courses/[id] */}
                  <Link
                    href="/courses/1"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    PLC Programming &amp; Automation
                  </Link>
                  <Link
                    href="/courses/2"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    Industrial SCADA &amp; HMI
                  </Link>
                  <Link
                    href="/courses/3"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    Drives &amp; Motion Control
                  </Link>
                </div>
                <div className="border-t border-white/10 py-2">
                  {/* Example deep links into other course‑related flows */}
                  <Link
                    href="/enroll/1"
                    className="block px-4 py-2 text-xs text-gray-400 hover:text-gray-100 hover:bg-white/10"
                  >
                    Enroll in Course #1
                  </Link>
                  <Link
                    href="/certificate/1"
                    className="block px-4 py-2 text-xs text-gray-400 hover:text-gray-100 hover:bg-white/10"
                  >
                    View Sample Certificate
            </Link>
                </div>
              </div>
            </div>

            {/* Partners */}
            <Link
              href="/partners"
              className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white relative group"
            >
              Partners
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Insights */}
            <Link
              href="/insights"
              className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white relative group"
            >
              Insights
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Dashboards + sub‑pages */}
            <div 
              className="relative group"
              onMouseEnter={() => {
                if (dashboardsDropdownTimerRef.current) {
                  clearTimeout(dashboardsDropdownTimerRef.current)
                  dashboardsDropdownTimerRef.current = null
                }
                setShowDashboardsDropdown(true)
              }}
              onMouseLeave={() => {
                const timer = setTimeout(() => {
                  setShowDashboardsDropdown(false)
                }, 1500)
                dashboardsDropdownTimerRef.current = timer
              }}
            >
              <button
                type="button"
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Dashboards
                <span className="ml-1 text-xs text-gray-400 group-hover:text-gray-200">▼</span>
              </button>
              <div 
                className={`${showDashboardsDropdown ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-all duration-200 absolute left-0 mt-3 w-64 glass-card rounded-2xl border border-white/10 shadow-xl bg-black/60 backdrop-blur-xl z-40`}
                onMouseEnter={() => {
                  if (dashboardsDropdownTimerRef.current) {
                    clearTimeout(dashboardsDropdownTimerRef.current)
                    dashboardsDropdownTimerRef.current = null
                  }
                  setShowDashboardsDropdown(true)
                }}
              >
                <div className="py-3">
                  <Link
                    href="/student-dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    Student Dashboard
                  </Link>
                  <Link
                    href="/trainer-dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    Trainer Dashboard
                  </Link>
                  <Link
                    href="/admin-dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    href="/corporate-dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    Corporate Dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* About / Contact */}
            <Link
              href="/about"
              className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative search-container">
              <button 
                onClick={handleSearchClick}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-xl"
              >
              <Search size={20} />
            </button>
              {showSearch && (
                <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl p-4 border border-white/10 backdrop-blur-xl z-50">
                  <form onSubmit={handleSearch} className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search courses, companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary text-sm py-2 rounded-lg"
                    >
                      Search
                    </button>
                  </form>
                </div>
              )}
            </div>
            {user && userRole === "admin" && pathname?.startsWith("/admin-dashboard") && (
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            )}
            
            {isLoaded && user ? (
              <div 
                className="relative user-menu z-50"
                onMouseEnter={() => {
                  if (userMenuTimerRef.current) {
                    clearTimeout(userMenuTimerRef.current)
                    userMenuTimerRef.current = null
                  }
                }}
                onMouseLeave={() => {
                  const timer = setTimeout(() => {
                    setShowUserMenu(false)
                  }, 1500)
                  userMenuTimerRef.current = timer
                }}
              >
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-xl"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
                </button>
                
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-2 border border-white/10 backdrop-blur-xl z-50"
                    onMouseEnter={() => {
                      if (userMenuTimerRef.current) {
                        clearTimeout(userMenuTimerRef.current)
                        userMenuTimerRef.current = null
                      }
                    }}
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-gray-400">{userEmail}</p>
                      <p className="text-xs text-purple-400 capitalize">{userRole}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm px-6 py-2 rounded-xl">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-xl"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden glass-card rounded-2xl mt-4 p-6 border border-white/10">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {/* Courses + sub‑pages (mobile) */}
              <div>
                <Link 
                  href="/courses" 
                  className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Courses</span>
                </Link>
                <div className="ml-4 mt-1 space-y-1 text-xs text-gray-300">
              <Link 
                href="/courses" 
                    className="block py-1 px-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All Courses
                  </Link>
                  <Link
                    href="/courses/1"
                    className="block py-1 px-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    PLC Programming &amp; Automation
                  </Link>
                  <Link
                    href="/courses/2"
                    className="block py-1 px-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Industrial SCADA &amp; HMI
                  </Link>
                  <Link
                    href="/courses/3"
                    className="block py-1 px-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Drives &amp; Motion Control
                  </Link>
                  <Link
                    href="/enroll/1"
                    className="block py-1 px-3 rounded-lg hover:bg-white/5 text-[11px] text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Enroll in Course #1
                  </Link>
                  <Link
                    href="/certificate/1"
                    className="block py-1 px-3 rounded-lg hover:bg-white/5 text-[11px] text-gray-400"
                onClick={() => setIsMenuOpen(false)}
              >
                    Sample Certificate
              </Link>
                </div>
              </div>
              <Link 
                href="/partners" 
                className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Partners
              </Link>
              <Link 
                href="/insights" 
                className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Insights
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative search-container flex-1">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm"
                      />
                    </form>
                  </div>
                  {user && userRole === "admin" && pathname?.startsWith("/admin-dashboard") && (
                  <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-xl relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  )}
                </div>
                
                {isLoaded && user ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2 bg-white/5 rounded-lg">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-gray-400">{userEmail}</p>
                      <p className="text-xs text-purple-400 capitalize">{userRole}</p>
                    </div>
                    <Link 
                      href={getDashboardLink()}
                      className="btn-primary w-full text-center py-3 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-center py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="btn-primary w-full text-center py-3 rounded-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
