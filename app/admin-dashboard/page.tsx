"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProtectedRoute } from "../../lib/clerk-helpers"
import { useClerk } from "@clerk/nextjs"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  User,
  Settings,
  Bell,
  Calendar,
  Award,
  MessageSquare,
  BarChart3,
  Shield,
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  ArrowLeft,
  LogOut
} from "lucide-react"
import { industryCourses, industryPartners } from "../../lib/industry-data"

export default function AdminDashboard() {
  const { user, isLoading } = useProtectedRoute("admin")
  const { signOut } = useClerk()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [systemStats, setSystemStats] = useState<any>({})
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [systemAlerts, setSystemAlerts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  useEffect(() => {
    if (user) {
      // Simulate system statistics
      const mockStats = {
        totalUsers: 1247,
        activeCourses: industryCourses.length,
        totalRevenue: 456789,
        systemHealth: 98.5,
        newUsers: 23,
        courseEnrollments: 89,
        revenueGrowth: 12.5,
        userGrowth: 8.3
      }
      setSystemStats(mockStats)

      // Simulate recent users
      const mockUsers = [
        { id: 1, name: "Alex Johnson", email: "alex@email.com", role: "student", status: "active", lastActive: "2 hours ago" },
        { id: 2, name: "Sarah Chen", email: "sarah@email.com", role: "trainer", status: "active", lastActive: "1 day ago" },
        { id: 3, name: "Mike Davis", email: "mike@email.com", role: "student", status: "pending", lastActive: "3 days ago" },
        { id: 4, name: "Emma Wilson", email: "emma@email.com", role: "corporate", status: "active", lastActive: "1 week ago" }
      ]
      setRecentUsers(mockUsers)

      // Simulate system alerts
      const mockAlerts = [
        { id: 1, type: "warning", message: "High server load detected", time: "5 minutes ago" },
        { id: 2, type: "info", message: "New course enrollment milestone reached", time: "1 hour ago" },
        { id: 3, type: "success", message: "System backup completed successfully", time: "2 hours ago" }
      ]
      setSystemAlerts(mockAlerts)
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

  const filteredUsers = recentUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white">
                <Bell size={20} />
              </button>
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
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Shield size={16} />
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
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || user?.firstName || 'Admin'}! 🔧</h2>
          <p className="text-gray-400">System administration and analytics overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
                <p className="text-green-400 text-sm">+{systemStats.newUsers} today</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Courses</p>
                <p className="text-2xl font-bold">{systemStats.activeCourses}</p>
                <p className="text-green-400 text-sm">+{systemStats.courseEnrollments} enrollments</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">${systemStats.totalRevenue?.toLocaleString()}</p>
                <p className="text-green-400 text-sm">+{systemStats.revenueGrowth}% this month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">System Health</p>
                <p className="text-2xl font-bold">{systemStats.systemHealth}%</p>
                <p className="text-green-400 text-sm">All systems operational</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "User Management", icon: Users },
            { id: "courses", label: "Course Management", icon: BookOpen },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
            { id: "system", label: "System", icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Alerts */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">System Alerts</h3>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.type === 'warning' ? 'bg-yellow-400' :
                          alert.type === 'info' ? 'bg-blue-400' :
                          'bg-green-400'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-400">{alert.time}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <Eye size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Plus size={16} className="inline mr-2" />
                    Add New User
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <BookOpen size={16} className="inline mr-2" />
                    Create Course
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download size={16} className="inline mr-2" />
                    Export Reports
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Settings size={16} className="inline mr-2" />
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">User Management</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus size={16} className="inline mr-2" />
                  Add User
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-900 text-red-300' :
                          user.role === 'trainer' ? 'bg-green-900 text-green-300' :
                          user.role === 'corporate' ? 'bg-blue-900 text-blue-300' :
                          'bg-purple-900 text-purple-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">{user.lastActive}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                            <Eye size={14} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                            <Edit size={14} />
                          </button>
                          <button className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Course Management</h3>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} className="inline mr-2" />
                Add Course
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryCourses.slice(0, 6).map((course) => (
                <div key={course.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{course.title}</h4>
                    <span className="text-sm text-gray-400">{course.company}</span>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {course.students} students
                    </div>
                    <div className="flex items-center">
                      <Award size={14} className="mr-1" />
                      {course.rating} rating
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Revenue Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${systemStats.totalRevenue?.toLocaleString()}</p>
                  </div>
                  <div className="text-green-400 text-sm">+{systemStats.revenueGrowth}%</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Course Enrollments</p>
                    <p className="text-2xl font-bold">{systemStats.courseEnrollments}</p>
                  </div>
                  <div className="text-green-400 text-sm">+15%</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">User Growth</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">New Users</p>
                    <p className="text-2xl font-bold">{systemStats.newUsers}</p>
                  </div>
                  <div className="text-green-400 text-sm">+{systemStats.userGrowth}%</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold">1,089</p>
                  </div>
                  <div className="text-green-400 text-sm">+5%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Database</span>
                  </div>
                  <span className="text-green-400">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>API Services</span>
                  </div>
                  <span className="text-green-400">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>File Storage</span>
                  </div>
                  <span className="text-yellow-400">High Load</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Recent Activities</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Course created</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Download size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Report generated</p>
                    <p className="text-xs text-gray-400">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
