"use client"

import { Users, Award, Globe, Target } from "lucide-react"
import Navbar from "../../src/components/Navbar"

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg",
      bio: "Former tech executive with 15+ years in software development and education."
    },
    {
      name: "Prof. Michael Chen",
      role: "Head of Technology",
      image: "/placeholder.svg",
      bio: "PhD in Computer Science with expertise in AI and machine learning."
    },
    {
      name: "Lisa Rodriguez",
      role: "Head of Marketing",
      image: "/placeholder.svg",
      bio: "Digital marketing expert with experience in edtech and corporate training."
    },
    {
      name: "Dr. Robert Williams",
      role: "Head of Engineering",
      image: "/placeholder.svg",
      bio: "Civil engineering professor with 20+ years of industry experience."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Students Trained", icon: Users },
    { number: "50+", label: "Industry Partners", icon: Globe },
    { number: "95%", label: "Success Rate", icon: Award },
    { number: "200+", label: "Training Programs", icon: Target }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">About TRAININ</h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We are a leading industrial training platform dedicated to bridging the gap between academic knowledge and industry requirements. 
              Our mission is to empower professionals with practical skills and hands-on experience.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                To provide industry-relevant training programs that equip professionals with the practical skills and knowledge needed to excel in their careers. 
                We believe in learning by doing and connecting theory with real-world applications.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our comprehensive approach combines theoretical knowledge with hands-on projects, industry mentorship, and practical case studies to ensure our students are job-ready.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                To become the most trusted platform for industrial training, recognized for our commitment to quality education, industry partnerships, and student success.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We envision a future where every professional has access to high-quality, industry-aligned training that accelerates their career growth and contributes to organizational success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-4">Excellence</h3>
              <p className="text-gray-400">
                We maintain the highest standards in our training programs, ensuring quality education that meets industry requirements.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-4">Collaboration</h3>
              <p className="text-gray-400">
                We foster partnerships with industry leaders and educational institutions to create comprehensive learning experiences.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-gray-400">
                We continuously evolve our training methodologies to incorporate the latest industry trends and technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                <p className="text-purple-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-gray-300 mb-8">
            Join thousands of professionals who have transformed their careers with our industry-focused training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Explore Courses
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 border border-gray-700">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
