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
  Calendar,
  Award,
  MessageSquare,
  BarChart3,
  Building,
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  Target,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  LogOut
} from "lucide-react"
import { industryCourses, industryPartners } from "../../lib/industry-data"

export default function CorporateDashboard() {
  const { user, isLoading } = useProtectedRoute("corporate")
  const { signOut } = useClerk()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [corporateStats, setCorporateStats] = useState<any>({})
  const [employees, setEmployees] = useState<any[]>([])
  const [trainingPrograms, setTrainingPrograms] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  useEffect(() => {
    if (user) {
      const stored = typeof window !== 'undefined'
        ? localStorage.getItem(`corporate_data_${user.id}`)
        : null
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setCorporateStats(parsed.corporateStats || {})
          setEmployees(parsed.employees || [])
          setTrainingPrograms(parsed.trainingPrograms || [])
        } catch (e) {
          console.error('Failed to parse corporate data', e)
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

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-xl font-semibold">Corporate Dashboard</h1>
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
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Building size={16} />
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
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || user?.firstName || 'Corporate User'}! 🏢</h2>
          <p className="text-gray-400">Manage your corporate training programs and employee development.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Employees</p>
                <p className="text-2xl font-bold">{corporateStats.totalEmployees}</p>
                <p className="text-green-400 text-sm">+{corporateStats.newEnrollments} enrolled</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Programs</p>
                <p className="text-2xl font-bold">{corporateStats.activePrograms}</p>
                <p className="text-green-400 text-sm">{corporateStats.completionRate}% completion</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Investment</p>
                <p className="text-2xl font-bold">${corporateStats.totalInvestment?.toLocaleString()}</p>
                <p className="text-green-400 text-sm">${corporateStats.costSavings?.toLocaleString()} saved</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
        </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-gray-400 text-sm">Skill Gap Reduction</p>
                <p className="text-2xl font-bold">{corporateStats.skillGapReduction}%</p>
                <p className="text-green-400 text-sm">{corporateStats.certificatesEarned} certificates</p>
                </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "employees", label: "Employee Management", icon: Users },
            { id: "programs", label: "Training Programs", icon: BookOpen },
            { id: "analytics", label: "ROI Analytics", icon: TrendingUp },
            { id: "reports", label: "Reports", icon: Download }
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
            {/* Training Programs Overview */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">Active Training Programs</h3>
              <div className="space-y-4">
                {trainingPrograms.length === 0 && (
                  <p className="text-sm text-gray-400">No training programs yet.</p>
                )}
                {trainingPrograms.slice(0, 4).map((program) => (
                  <div key={program.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{program.title}</h4>
                        <span className="text-sm text-gray-400">{program.company}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Users size={14} className="mr-1" />
                        {program.enrolledEmployees} enrolled
                      </div>
                      <div className="flex items-center text-green-400">
                        <CheckCircle size={14} className="mr-1" />
                        {program.completionRate}% complete
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <DollarSign size={14} className="mr-1" />
                        ${program.costPerEmployee}
                      </div>
                      <div className="flex items-center text-purple-400">
                        <TrendingUp size={14} className="mr-1" />
                        {program.roi}% ROI
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Next session: {program.nextSession}</span>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors">
                          View Details
                        </button>
                        <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs transition-colors">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Plus size={16} className="inline mr-2" />
                    Enroll Employees
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <BookOpen size={16} className="inline mr-2" />
                    Create Program
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download size={16} className="inline mr-2" />
                    Generate Report
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <MessageSquare size={16} className="inline mr-2" />
                    Send Notifications
                  </button>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">Recent Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Award size={16} />
                        </div>
                        <div>
                      <p className="text-sm font-medium">15 employees completed PLC training</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Target size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Skill gap reduced by 5%</p>
                      <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">$12,000 cost savings achieved</p>
                      <p className="text-xs text-gray-400">3 days ago</p>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Employee Management</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
            </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus size={16} className="inline mr-2" />
                  Add Employee
                    </button>
                  </div>
                </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-medium">Employee</th>
                    <th className="text-left py-3 px-4 font-medium">Department</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Progress</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-700">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{employee.name.charAt(0)}</span>
                          </div>
                        <div>
                            <div className="font-medium">{employee.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs">
                          {employee.department}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">{employee.role}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${employee.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-purple-400">{employee.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">{employee.lastActive}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                            <Eye size={14} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                            <Edit size={14} />
                          </button>
                          <button className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded">
                            <MessageSquare size={14} />
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

        {activeTab === "programs" && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Training Programs</h3>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} className="inline mr-2" />
                Create Program
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingPrograms.map((program) => (
                <div key={program.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{program.title}</h4>
                    <span className="text-sm text-gray-400">{program.company}</span>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>Enrolled:</span>
                      <span className="text-blue-400">{program.enrolledEmployees} employees</span>
                          </div>
                    <div className="flex items-center justify-between">
                      <span>Completion:</span>
                      <span className="text-green-400">{program.completionRate}%</span>
                          </div>
                    <div className="flex items-center justify-between">
                      <span>Cost/Employee:</span>
                      <span className="text-yellow-400">${program.costPerEmployee}</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <span>ROI:</span>
                      <span className="text-purple-400">{program.roi}%</span>
                        </div>
                      </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors">
                      Manage
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs transition-colors">
                      Analytics
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
              <h3 className="text-xl font-semibold mb-6">ROI Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Total Investment</p>
                    <p className="text-2xl font-bold">${corporateStats.totalInvestment?.toLocaleString()}</p>
                  </div>
                  <div className="text-green-400 text-sm">+15% YoY</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                    <p className="text-sm text-gray-400">Cost Savings</p>
                    <p className="text-2xl font-bold">${corporateStats.costSavings?.toLocaleString()}</p>
                  </div>
                  <div className="text-green-400 text-sm">+23% vs last year</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                    <p className="text-sm text-gray-400">Average ROI</p>
                    <p className="text-2xl font-bold">156%</p>
                  </div>
                  <div className="text-green-400 text-sm">+12% improvement</div>
                        </div>
                        </div>
                      </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-bold">{corporateStats.completionRate}%</p>
                  </div>
                  <div className="text-green-400 text-sm">+8% vs target</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Certificates Earned</p>
                    <p className="text-2xl font-bold">{corporateStats.certificatesEarned}</p>
                  </div>
                  <div className="text-green-400 text-sm">+15 this month</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Skill Gap Reduction</p>
                    <p className="text-2xl font-bold">{corporateStats.skillGapReduction}%</p>
                  </div>
                  <div className="text-green-400 text-sm">+5% improvement</div>
                        </div>
                        </div>
                      </div>
                    </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Generate Reports</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} className="inline mr-2" />
                  Employee Progress Report
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} className="inline mr-2" />
                  ROI Analysis Report
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} className="inline mr-2" />
                  Training Completion Report
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} className="inline mr-2" />
                  Cost Analysis Report
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Recent Reports</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Q4 Training Report</p>
                    <p className="text-xs text-gray-400">Generated 2 days ago</p>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300">
                    <Download size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Employee Progress Summary</p>
                    <p className="text-xs text-gray-400">Generated 1 week ago</p>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300">
                    <Download size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">ROI Analysis Q3</p>
                    <p className="text-xs text-gray-400">Generated 2 weeks ago</p>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
