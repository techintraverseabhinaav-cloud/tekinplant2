"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProtectedRoute } from "../../lib/clerk-helpers"
import { useClerk } from "@clerk/nextjs"
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar, 
  Users, 
  Star, 
  LogOut,
  User,
  Settings,
  ArrowLeft
} from "lucide-react"
import { industryCourses } from "../../lib/industry-data"

export default function StudentDashboard() {
  const { user, isLoading } = useProtectedRoute("student")
  const { signOut } = useClerk()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  useEffect(() => {
    if (user) {
      // Load any user-specific enrollments stored locally (placeholder for real data)
      const stored = typeof window !== 'undefined'
        ? localStorage.getItem(`student_enrollments_${user.id}`)
        : null
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setEnrolledCourses(parsed.enrolledCourses || [])
          setRecentActivity(parsed.recentActivity || [])
        } catch (e) {
          console.error('Failed to parse stored enrollments', e)
        }
      }
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalCourses = enrolledCourses.length
  const stats = {
    totalCourses,
    completedCourses: enrolledCourses.filter(c => c.progress === 100).length,
    totalHours: enrolledCourses.reduce((sum, c) => sum + parseInt(c.duration.split(' ')[0]) * 7, 0),
    averageScore: totalCourses > 0
      ? Math.floor(enrolledCourses.reduce((sum, c) => sum + c.rating, 0) / totalCourses * 20)
      : 0
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-xl font-semibold">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white">
                <Settings size={20} />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm">{user?.fullName || user?.firstName || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || user?.firstName || 'Student'}! 👋</h2>
          <p className="text-gray-400">Continue your learning journey with industry-leading training programs.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Enrolled Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold">{stats.completedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Hours</p>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </div>
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">My Enrolled Courses</h3>
              <div className="space-y-4">
                {enrolledCourses.length === 0 && (
                  <p className="text-sm text-gray-400">No enrolled courses yet. Enroll to see progress here.</p>
                )}
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{course.title}</h4>
                      <span className="text-sm text-gray-400">{course.company}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <Star size={14} className="mr-1" />
                          {course.rating}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-purple-400">{course.progress}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                      <span>Last accessed: {course.lastAccessed}</span>
                      <span>Next session: {course.nextSession}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'course_completed' ? 'bg-green-600/20' :
                      activity.type === 'assignment_submitted' ? 'bg-blue-600/20' :
                      activity.type === 'certificate_earned' ? 'bg-yellow-600/20' :
                      'bg-purple-600/20'
                    }`}>
                      {activity.type === 'course_completed' && <Award size={16} className="text-green-400" />}
                      {activity.type === 'assignment_submitted' && <BookOpen size={16} className="text-blue-400" />}
                      {activity.type === 'certificate_earned' && <Star size={16} className="text-yellow-400" />}
                      {activity.type === 'course_enrolled' && <Users size={16} className="text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-6">
              <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Browse New Courses
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Certificates
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Schedule Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
