"use client"

import { useState } from "react"
import { TrendingUp, Users, Building, MapPin, Star, DollarSign, Clock, Award } from "lucide-react"
import Navbar from "../../src/components/Navbar"
import { industryCourses, industryPartners, industryStats, industryInsights } from "../../lib/industry-data"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Header */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Industry <span className="text-purple-500">Insights</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive analytics and trends from our industry training programs and partner companies
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-purple-400 mr-2" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-purple-400">{industryStats.totalStudents}</h3>
              <p className="text-gray-400">Total Students</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="flex items-center justify-center mb-2">
                <Building className="text-purple-400 mr-2" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-purple-400">{industryStats.totalPartners}</h3>
              <p className="text-gray-400">Partner Companies</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="text-purple-400 mr-2" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-purple-400">{industryStats.averageRating}</h3>
              <p className="text-gray-400">Average Rating</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="text-purple-400 mr-2" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-purple-400">{industryInsights.successRate}</h3>
              <p className="text-gray-400">Success Rate</p>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Training Programs Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Programs</span>
                  <span className="text-purple-400 font-semibold">{industryStats.totalCourses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Price</span>
                  <span className="text-purple-400 font-semibold">{industryInsights.averageCoursePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Duration</span>
                  <span className="text-purple-400 font-semibold">{industryInsights.averageDuration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Placement Rate</span>
                  <span className="text-purple-400 font-semibold">{industryInsights.placementRate}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Partner Companies Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Partners</span>
                  <span className="text-purple-400 font-semibold">{industryStats.totalPartners}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Industries Covered</span>
                  <span className="text-purple-400 font-semibold">{industryStats.industries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Locations</span>
                  <span className="text-purple-400 font-semibold">{industryStats.locations.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-purple-400 font-semibold">{industryInsights.successRate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Distribution */}
          <div className="bg-gray-800 p-8 rounded-xl mb-12">
            <h3 className="text-2xl font-bold mb-6">Industry Distribution</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Top Industries by Company Count</h4>
                <div className="space-y-3">
                  {industryInsights.topIndustries.map((industry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{industry.name}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(industry.count / Math.max(...industryInsights.topIndustries.map(i => i.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-purple-400 font-semibold w-8 text-right">{industry.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Popular Locations</h4>
                <div className="space-y-3">
                  {industryInsights.popularLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{location.name}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(location.count / Math.max(...industryInsights.popularLocations.map(l => l.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-purple-400 font-semibold w-8 text-right">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Companies */}
          <div className="bg-gray-800 p-8 rounded-xl mb-12">
            <h3 className="text-2xl font-bold mb-6">Top Performing Companies</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {industryCourses
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 6)
                .map((course) => (
                  <div key={course.id} className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">{course.company}</h4>
                    <p className="text-gray-300 text-sm mb-2">{course.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Rating</span>
                      <span className="text-yellow-400 font-semibold">{course.rating} ⭐</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-gray-800 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Market Trends & Analysis</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Training Program Trends</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="text-green-400 mr-3" size={20} />
                      <div>
                        <p className="text-white font-medium">Growing Demand</p>
                        <p className="text-gray-400 text-sm">Automation & IoT training</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">+25%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="text-blue-400 mr-3" size={20} />
                      <div>
                        <p className="text-white font-medium">Price Trends</p>
                        <p className="text-gray-400 text-sm">Average course pricing</p>
                      </div>
                    </div>
                    <span className="text-blue-400 font-semibold">{industryInsights.averageCoursePrice}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="text-yellow-400 mr-3" size={20} />
                      <div>
                        <p className="text-white font-medium">Duration Patterns</p>
                        <p className="text-gray-400 text-sm">Most popular duration</p>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-semibold">{industryInsights.averageDuration}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Success Metrics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <Award className="text-purple-400 mr-3" size={20} />
                      <div>
                        <p className="text-white font-medium">Success Rate</p>
                        <p className="text-gray-400 text-sm">Program completion</p>
                      </div>
                    </div>
                    <span className="text-purple-400 font-semibold">{industryInsights.successRate}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <Users className="text-green-400 mr-3" size={20} />
                      <div>
                        <p className="text-white font-medium">Placement Rate</p>
                        <p className="text-gray-400 text-sm">Job placement success</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">{industryInsights.placementRate}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-3" size={20} />
                      <div>
                        <p className="text-white font-medium">Student Satisfaction</p>
                        <p className="text-gray-400 text-sm">Average rating</p>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-semibold">{industryStats.averageRating} ⭐</span>
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
