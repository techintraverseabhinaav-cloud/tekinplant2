"use client"

import { useState } from "react"
import { Search, MapPin, Building, Users, Calendar, ExternalLink, Mail, Phone, TrendingUp, Star } from "lucide-react"
import Navbar from "../../src/components/Navbar"
import Link from "next/link"
import { industryPartners, industryStats, industryInsights } from "../../lib/industry-data"

export default function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industry, setIndustry] = useState("All Industries")
  const [location, setLocation] = useState("All Locations")

  // Get unique industries and locations for filters
  const industries = ["All Industries", ...new Set(industryPartners.map(partner => partner.industry))]
  const locations = ["All Locations", ...new Set(industryPartners.map(partner => partner.location.split(',')[0]))]

  // Filter partners based on search and filters
  const filteredPartners = industryPartners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.trainingPrograms.some(program => program.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesIndustry = industry === "All Industries" || partner.industry === industry
    const matchesLocation = location === "All Locations" || partner.location.includes(location)
    
    return matchesSearch && matchesIndustry && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
              <span className="text-sm font-medium text-purple-300">Industry Partners</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-gradient">Industry Partners</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Connect with leading companies and access world-class training programs designed by industry experts
            </p>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="elegant-card text-center hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-1">{industryStats.totalPartners}</h3>
                <p className="text-gray-400 text-sm">Partner Companies</p>
              </div>
              <div className="elegant-card text-center hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-1">{industryStats.totalStudents}</h3>
                <p className="text-gray-400 text-sm">Students Trained</p>
              </div>
              <div className="elegant-card text-center hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-1">{industryStats.totalCourses}</h3>
                <p className="text-gray-400 text-sm">Training Programs</p>
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
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search companies, industries, or locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 elegant-input"
                    />
                  </div>
                </div>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="elegant-input"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
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
                Showing {filteredPartners.length} of {industryPartners.length} partner companies
              </p>
            </div>
          </div>
        </div>
      </section>

          {/* Partners Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner, index) => (
              <Link
                key={partner.id}
                href={`/partners/${partner.id}`}
                className="elegant-card hover-lift animate-fade-in-scale group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{partner.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        <Building size={14} className="mr-1" />
                        {partner.industry}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {partner.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm line-clamp-3">
                    {partner.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      {partner.employeeCount && (
                        <span className="flex items-center text-gray-400">
                          <Users size={16} className="mr-1" />
                          {partner.employeeCount.toLocaleString()} employees
                        </span>
                      )}
                      {partner.founded && (
                        <span className="flex items-center text-gray-400">
                          <Calendar size={16} className="mr-1" />
                          Founded {partner.founded}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Training Programs:</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.trainingPrograms.slice(0, 3).map((program, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-900 text-gray-300 rounded-full text-sm border border-gray-600"
                          >
                            {program}
                          </span>
                        ))}
                        {partner.trainingPrograms.length > 3 && (
                          <span className="px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-sm">
                            +{partner.trainingPrograms.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                      <span className="flex items-center text-gray-400">
                        <Mail size={16} className="mr-1" />
                        Contact
                      </span>
                      <span className="flex items-center text-gray-400">
                        <ExternalLink size={16} className="mr-1" />
                        Website
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No partners found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setIndustry("All Industries")
                  setLocation("All Locations")
                }}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}

      {/* Industry Insights */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Industry Insights</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Top Industries */}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Top Industries</h3>
              <div className="space-y-3">
                {industryInsights.topIndustries.map((industry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{industry.name}</span>
                    <span className="text-purple-400 font-semibold">{industry.count} companies</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Locations */}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Popular Locations</h3>
              <div className="space-y-3">
                {industryInsights.popularLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{location.name}</span>
                    <span className="text-purple-400 font-semibold">{location.count} companies</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-gray-900 p-6 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-purple-400">{industryInsights.averageCoursePrice}</h3>
              <p className="text-gray-400">Average Course Price</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-purple-400">{industryInsights.averageDuration}</h3>
              <p className="text-gray-400">Average Duration</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-purple-400">{industryInsights.successRate}</h3>
              <p className="text-gray-400">Success Rate</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-purple-400">{industryInsights.placementRate}</h3>
              <p className="text-gray-400">Placement Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
