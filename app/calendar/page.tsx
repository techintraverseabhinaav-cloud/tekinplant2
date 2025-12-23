"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "../../src/components/Navbar"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const events = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      date: "2024-01-15",
      time: "09:00 AM - 05:00 PM",
      location: "Training Center A",
      instructor: "Dr. Sarah Johnson",
      participants: 25,
      type: "workshop"
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      date: "2024-01-18",
      time: "10:00 AM - 04:00 PM",
      location: "Online",
      instructor: "Prof. Michael Chen",
      participants: 40,
      type: "online"
    },
    {
      id: 3,
      title: "Civil Engineering Workshop",
      date: "2024-01-22",
      time: "08:00 AM - 06:00 PM",
      location: "Engineering Lab",
      instructor: "Dr. Robert Williams",
      participants: 15,
      type: "practical"
    },
    {
      id: 4,
      title: "Digital Marketing Masterclass",
      date: "2024-01-25",
      time: "02:00 PM - 08:00 PM",
      location: "Conference Hall",
      instructor: "Lisa Rodriguez",
      participants: 30,
      type: "seminar"
    },
    {
      id: 5,
      title: "Mechanical Design Training",
      date: "2024-01-28",
      time: "09:00 AM - 05:00 PM",
      location: "CAD Lab",
      instructor: "Prof. David Kim",
      participants: 20,
      type: "workshop"
    }
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay }
  }

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date)
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">Training Calendar</h1>
          <p className="text-xl text-gray-300">
            Stay updated with our training schedule and upcoming events
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDay }, (_, i) => (
                  <div key={`empty-${i}`} className="p-3 h-20"></div>
                ))}
                
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const dateStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
                  const dayEvents = getEventsForDate(dateStr)
                  
                  return (
                    <div
                      key={day}
                      className={`p-2 h-20 border border-gray-700 rounded-lg ${
                        dayEvents.length > 0 ? 'bg-purple-900/20 border-purple-500' : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{day}</div>
                      {dayEvents.length > 0 && (
                        <div className="text-xs text-purple-400">
                          {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CalendarIcon className="mr-2" size={20} />
                Upcoming Events
              </h3>
              
              <div className="space-y-4">
                {events.map(event => (
                  <div
                    key={event.id}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-purple-400">{event.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === 'workshop' ? 'bg-blue-900 text-blue-300' :
                        event.type === 'online' ? 'bg-green-900 text-green-300' :
                        event.type === 'practical' ? 'bg-orange-900 text-orange-300' :
                        'bg-purple-900 text-purple-300'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2" />
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-2" />
                        {event.participants} participants
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-500">Instructor: {event.instructor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Events:</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Workshops:</span>
                  <span className="font-semibold text-blue-400">
                    {events.filter(e => e.type === 'workshop').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Online Sessions:</span>
                  <span className="font-semibold text-green-400">
                    {events.filter(e => e.type === 'online').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Participants:</span>
                  <span className="font-semibold text-purple-400">
                    {events.reduce((sum, event) => sum + event.participants, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
