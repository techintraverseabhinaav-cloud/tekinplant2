"use client"

import { useState } from "react"
import { use } from "react"
import { ArrowLeft, Clock, FileText, Upload, Send, CheckCircle, AlertCircle, Calendar, User, BookOpen } from "lucide-react"
import Navbar from "../../../src/components/Navbar"
import Link from "next/link"

export default function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [submitted, setSubmitted] = useState(false)

  // Mock assignment data
  const assignmentData = {
    id: resolvedParams.id,
    title: "Build a React Todo Application",
    course: "Full Stack Web Development",
    description: "Create a complete todo application using React hooks, state management, and local storage. The application should allow users to add, edit, delete, and mark todos as complete.",
    dueDate: "March 15, 2024",
    timeRemaining: "3 days 12 hours",
    points: 100,
    status: "active",
    instructor: "Dr. Sarah Johnson",
    requirements: [
      "Use functional components with React hooks",
      "Implement CRUD operations (Create, Read, Update, Delete)",
      "Use local storage to persist data",
      "Add proper error handling and validation",
      "Include responsive design for mobile devices",
      "Add unit tests for core functionality"
    ],
    submissionGuidelines: [
      "Submit a GitHub repository link",
      "Include a README.md with setup instructions",
      "Provide screenshots of the application",
      "Include test coverage report",
      "Submit before the due date"
    ],
    rubric: [
      { criterion: "Functionality", points: 40, description: "All CRUD operations work correctly" },
      { criterion: "Code Quality", points: 25, description: "Clean, well-structured, and documented code" },
      { criterion: "User Experience", points: 20, description: "Intuitive and responsive design" },
      { criterion: "Testing", points: 15, description: "Comprehensive test coverage" }
    ]
  }

  const handleSubmit = () => {
    setSubmitted(true)
    // In a real app, this would submit the assignment
    alert("Assignment submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div style={{ 
        position: 'relative',
        zIndex: 50,
        border: 'none',
        borderTop: 'none',
        paddingTop: 0,
        marginTop: 0,
        backgroundColor: '#111827'
      }}>
        <Navbar />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/student-dashboard"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{assignmentData.title}</h1>
              <p className="text-gray-400">Course: {assignmentData.course}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{assignmentData.points} pts</div>
              <div className="text-sm text-gray-400">Due: {assignmentData.dueDate}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Description */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Assignment Description</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{assignmentData.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-purple-400 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {assignmentData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-400 mb-3">Submission Guidelines</h3>
                  <ul className="space-y-2">
                    {assignmentData.submissionGuidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Grading Rubric */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Grading Rubric</h2>
              <div className="space-y-4">
                {assignmentData.rubric.map((item, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-400">{item.criterion}</h4>
                      <span className="text-sm font-medium">{item.points} points</span>
                    </div>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Section */}
            {!submitted ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Submit Assignment</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Repository Link</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/repository"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Comments</label>
                    <textarea
                      rows={4}
                      placeholder="Any additional notes or comments about your submission..."
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Files (Optional)</label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400 mb-2">Drag and drop files here, or click to browse</p>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                        Choose Files
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <Send size={20} className="mr-2" />
                    Submit Assignment
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-900/20 border border-green-700 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle size={24} className="text-green-400" />
                  <h2 className="text-xl font-bold text-green-400">Assignment Submitted!</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  Your assignment has been successfully submitted. You will receive feedback from your instructor within 3-5 business days.
                </p>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Submission Details</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Submitted: {new Date().toLocaleDateString()}</div>
                    <div>Status: Under Review</div>
                    <div>Estimated Feedback: 3-5 business days</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Assignment Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock size={20} className="text-purple-400" />
                  <div>
                    <div className="font-medium">Time Remaining</div>
                    <div className="text-sm text-gray-400">{assignmentData.timeRemaining}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar size={20} className="text-purple-400" />
                  <div>
                    <div className="font-medium">Due Date</div>
                    <div className="text-sm text-gray-400">{assignmentData.dueDate}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User size={20} className="text-purple-400" />
                  <div>
                    <div className="font-medium">Instructor</div>
                    <div className="text-sm text-gray-400">{assignmentData.instructor}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BookOpen size={20} className="text-purple-400" />
                  <div>
                    <div className="font-medium">Course</div>
                    <div className="text-sm text-gray-400">{assignmentData.course}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Download Assignment PDF
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  View Previous Submissions
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Contact Instructor
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Helpful Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  React Documentation
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Local Storage Guide
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Testing with Jest
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Assignment FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
