"use client"

import { useState } from "react"
import { use } from "react"
import { Clock, Users, Star, MapPin, Calendar, BookOpen, CheckCircle, Play, Download, Building, Mail, Globe } from "lucide-react"
import Navbar from "../../../src/components/Navbar"
import Link from "next/link"

// Real industry data from Excel file
const industryCoursesData = {
  "1": {
    title: "Engineering Internships & Skill Training",
    company: "Siemens India",
    location: "Gurgaon, Haryana, India",
    type: "Electrical Equipment, Automation",
    duration: "6-12 months",
    students: 150,
    rating: 4.8,
    price: "₹45,000",
    image: "/placeholder.svg",
    description: "Comprehensive engineering internships and skill training programs in electrical equipment and automation technologies. This program offers hands-on experience with cutting-edge automation systems and electrical equipment used in modern industries.",
    instructor: "Siemens Technical Team",
    contact: "customercare.india@siemens.com",
    website: "https://new.siemens.com/in",
    syllabus: [
      "Electrical Equipment Fundamentals",
      "Automation Systems Overview",
      "PLC Programming Basics",
      "SCADA System Operations",
      "Industrial Safety Protocols",
      "Equipment Maintenance Procedures",
      "Quality Control Standards",
      "Project Management in Automation"
    ],
    requirements: [
      "Bachelor's degree in Electrical/Electronics Engineering",
      "Basic knowledge of electrical systems",
      "Proficiency in technical documentation",
      "Strong analytical and problem-solving skills"
    ],
    outcomes: [
      "Hands-on experience with Siemens automation equipment",
      "Industry-recognized certification",
      "Practical knowledge of electrical systems",
      "Career placement assistance"
    ]
  },
  "2": {
    title: "PLC, SCADA & Panel Design",
    company: "L & T Electrical & Automation",
    location: "New Mumbai, Maharashtra",
    type: "Automation and Electrical Solutions",
    duration: "8 weeks",
    students: 120,
    rating: 4.7,
    price: "₹35,000",
    image: "/placeholder.svg",
    description: "Specialized training in PLC programming, SCADA systems, and electrical panel design for industrial automation. This comprehensive program covers all aspects of modern industrial automation systems.",
    instructor: "Ms. Swati Kulkarni",
    contact: "swati.k@integ.com",
    website: "integ.com",
    syllabus: [
      "PLC Programming Fundamentals",
      "SCADA System Design",
      "Electrical Panel Design",
      "HMI Development",
      "Industrial Communication Protocols",
      "System Integration",
      "Troubleshooting Techniques",
      "Safety Standards and Compliance"
    ],
    requirements: [
      "Diploma or degree in Electrical/Instrumentation Engineering",
      "Basic understanding of electrical circuits",
      "Computer literacy",
      "Interest in automation technology"
    ],
    outcomes: [
      "Proficiency in PLC programming",
      "SCADA system design skills",
      "Panel design expertise",
      "Industry-ready automation knowledge"
    ]
  },
  "3": {
    title: "Industry-Specific Technical Training",
    company: "ABB India Ltd",
    location: "Mumbai, Maharashtra, India",
    type: "Electrical Equipment, Power",
    duration: "10 weeks",
    students: 200,
    rating: 4.9,
    price: "₹50,000",
    image: "/placeholder.svg",
    description: "Advanced technical training programs tailored for electrical equipment and power systems industry. This program provides deep insights into ABB's cutting-edge technologies and industry best practices.",
    instructor: "ABB Technical Specialists",
    contact: "info@in.abb.com",
    website: "https://new.abb.com/in",
    syllabus: [
      "Power Systems Analysis",
      "Electrical Equipment Design",
      "High Voltage Systems",
      "Power Quality Management",
      "Energy Efficiency Solutions",
      "Digital Substation Technology",
      "Grid Automation Systems",
      "Maintenance and Reliability"
    ],
    requirements: [
      "Engineering degree in Electrical/Power Systems",
      "Understanding of electrical fundamentals",
      "Experience in power sector preferred",
      "Strong technical aptitude"
    ],
    outcomes: [
      "Expertise in ABB power technologies",
      "Industry-recognized certification",
      "Practical power systems knowledge",
      "Career advancement opportunities"
    ]
  },
  "4": {
    title: "Sales & Technical Training Programs",
    company: "Havells India Ltd",
    location: "Noida, Uttar Pradesh, India",
    type: "Electrical Goods Manufacturing",
    duration: "6 weeks",
    students: 180,
    rating: 4.6,
    price: "₹28,000",
    image: "/placeholder.svg",
    description: "Comprehensive training combining sales techniques with technical knowledge of electrical goods manufacturing. This program prepares professionals for both technical and commercial roles in the electrical industry.",
    instructor: "Havells Training Team",
    contact: "hr@havells.com",
    website: "https://www.havells.com",
    syllabus: [
      "Electrical Product Knowledge",
      "Sales Techniques and Strategies",
      "Customer Relationship Management",
      "Technical Specifications Understanding",
      "Market Analysis and Trends",
      "Negotiation Skills",
      "After-Sales Service",
      "Business Development"
    ],
    requirements: [
      "Any graduate degree",
      "Good communication skills",
      "Interest in sales and marketing",
      "Basic technical aptitude"
    ],
    outcomes: [
      "Comprehensive product knowledge",
      "Professional sales skills",
      "Technical understanding",
      "Career in electrical industry"
    ]
  },
  "5": {
    title: "PLC Plant Training & Energy Management",
    company: "Tata Power",
    location: "Mumbai, Maharashtra",
    type: "Power Generation and Distribution",
    duration: "12 weeks",
    students: 160,
    rating: 4.8,
    price: "₹55,000",
    image: "/placeholder.svg",
    description: "Specialized training in PLC systems for power plants and comprehensive energy management solutions. This program combines theoretical knowledge with practical experience in power plant operations.",
    instructor: "Mr. Rajesh Nair",
    contact: "rajesh.nair@tatapower.com",
    website: "tatapower.com",
    syllabus: [
      "Power Plant Operations",
      "PLC Systems in Power Plants",
      "Energy Management Strategies",
      "Load Management Systems",
      "Grid Integration",
      "Energy Efficiency Optimization",
      "Environmental Compliance",
      "Emergency Response Procedures"
    ],
    requirements: [
      "Engineering degree in Electrical/Mechanical",
      "Understanding of power systems",
      "Safety consciousness",
      "Teamwork skills"
    ],
    outcomes: [
      "Power plant operation expertise",
      "Energy management certification",
      "PLC system proficiency",
      "Industry placement support"
    ]
  },
  "6": {
    title: "Electrical CAD Automation",
    company: "Simens India",
    location: "Pune, Maharashtra",
    type: "Electrical Engineering",
    duration: "8 weeks",
    students: 140,
    rating: 4.7,
    price: "₹32,000",
    image: "/placeholder.svg",
    description: "Advanced training in Electrical CAD software and automation tools for electrical engineering applications. This program focuses on modern design tools and automation techniques used in electrical engineering.",
    instructor: "Mr. Anil Deshmukh",
    contact: "anil.d@simens.com",
    website: "simens.com/in",
    syllabus: [
      "Electrical CAD Software",
      "Circuit Design and Analysis",
      "Automation Tools Integration",
      "3D Modeling for Electrical Systems",
      "Design Standards and Codes",
      "Project Documentation",
      "Collaborative Design Tools",
      "Quality Assurance in Design"
    ],
    requirements: [
      "Diploma or degree in Electrical Engineering",
      "Basic computer skills",
      "Understanding of electrical circuits",
      "Design aptitude"
    ],
    outcomes: [
      "CAD software proficiency",
      "Electrical design skills",
      "Automation tool expertise",
      "Industry-ready design capabilities"
    ]
  },
  "7": {
    title: "Industrial Automation & Robotics",
    company: "ABB India Ltd.",
    location: "Bangalore, Karnataka",
    type: "Power and Automation",
    duration: "10 weeks",
    students: 175,
    rating: 4.9,
    price: "₹48,000",
    image: "/placeholder.svg",
    description: "Comprehensive training in industrial automation systems and robotics for modern manufacturing. This program covers the latest automation technologies and robotic systems used in industry.",
    instructor: "Ms. Neha Rao",
    contact: "neha.r@abb.com",
    website: "abb.com/in",
    syllabus: [
      "Industrial Automation Fundamentals",
      "Robotic Systems Programming",
      "Automation System Integration",
      "Safety Systems and Protocols",
      "Quality Control Automation",
      "Maintenance and Troubleshooting",
      "Industry 4.0 Technologies",
      "Project Implementation"
    ],
    requirements: [
      "Engineering degree in relevant field",
      "Programming knowledge preferred",
      "Understanding of manufacturing processes",
      "Problem-solving skills"
    ],
    outcomes: [
      "Automation system expertise",
      "Robotics programming skills",
      "Industry 4.0 knowledge",
      "Career in automation industry"
    ]
  },
  "8": {
    title: "Smart Grid Power Distribution",
    company: "Adani Electricity",
    location: "Mumbai, Maharashtra",
    type: "Electrical Utility Company",
    duration: "9 weeks",
    students: 130,
    rating: 4.6,
    price: "₹42,000",
    image: "/placeholder.svg",
    description: "Specialized training in smart grid technologies and modern power distribution systems. This program focuses on the future of power distribution and smart grid implementation.",
    instructor: "Mr. Suresh Patil",
    contact: "suresh.patil@adani.com",
    website: "adani.electricity.com",
    syllabus: [
      "Smart Grid Technologies",
      "Power Distribution Systems",
      "Digital Substation Technology",
      "Grid Monitoring and Control",
      "Renewable Energy Integration",
      "Demand Response Systems",
      "Grid Security and Cybersecurity",
      "Regulatory Compliance"
    ],
    requirements: [
      "Electrical engineering background",
      "Understanding of power systems",
      "Interest in smart technologies",
      "Analytical thinking"
    ],
    outcomes: [
      "Smart grid expertise",
      "Modern distribution knowledge",
      "Technology integration skills",
      "Utility industry career path"
    ]
  },
  "9": {
    title: "Internal Technical Training & Apprentice Roles",
    company: "Polycab India Ltd.",
    location: "Mumbai, Maharashtra",
    type: "Electrical & Electronics – Wires, Cables & FMEG",
    duration: "6-12 months",
    students: 220,
    rating: 4.5,
    price: "₹25,000",
    image: "/placeholder.svg",
    description: "Comprehensive internal training programs and apprenticeship opportunities in electrical manufacturing. This program provides hands-on experience in cable and electrical component manufacturing.",
    instructor: "Polycab Technical Team",
    contact: "info@polycab.com",
    website: "polycab.com",
    syllabus: [
      "Cable Manufacturing Processes",
      "Quality Control Procedures",
      "Electrical Component Design",
      "Production Planning",
      "Safety Standards",
      "Equipment Operation",
      "Maintenance Procedures",
      "Industry Best Practices"
    ],
    requirements: [
      "Diploma or degree in relevant field",
      "Willingness to learn",
      "Teamwork skills",
      "Safety consciousness"
    ],
    outcomes: [
      "Manufacturing process knowledge",
      "Quality control expertise",
      "Industry experience",
      "Employment opportunities"
    ]
  },
  "10": {
    title: "Guest Lectures & OJT via Institutional Collaborations",
    company: "Apar Industries Ltd.",
    location: "Mumbai, Maharashtra",
    type: "Conductors, Transformer Oils, Specialty Oils & Electrical Oils",
    duration: "4-8 weeks",
    students: 100,
    rating: 4.4,
    price: "₹20,000",
    image: "/placeholder.svg",
    description: "Industry expert guest lectures and on-the-job training through institutional partnerships. This program connects academic learning with real-world industry experience.",
    instructor: "Industry Experts",
    contact: "info@aparindustries.co.in",
    website: "apar.com",
    syllabus: [
      "Industry Expert Lectures",
      "On-the-Job Training",
      "Real Project Exposure",
      "Industry Standards",
      "Professional Development",
      "Networking Opportunities",
      "Mentorship Programs",
      "Career Guidance"
    ],
    requirements: [
      "Student or recent graduate",
      "Institutional enrollment",
      "Learning attitude",
      "Professional conduct"
    ],
    outcomes: [
      "Industry exposure",
      "Professional networking",
      "Practical experience",
      "Career guidance"
    ]
  },
  "11": {
    title: "On-the-Job Internships & Technical Training",
    company: "Bajaj Electricals Ltd.",
    location: "Mumbai, Maharashtra",
    type: "Consumer Electrical Goods, Lighting, Engineering Projects",
    duration: "3-6 months",
    students: 190,
    rating: 4.7,
    price: "₹30,000",
    image: "/placeholder.svg",
    description: "Hands-on internship programs with technical training in consumer electrical goods and lighting systems. This program provides practical experience in consumer electrical industry.",
    instructor: "Bajaj Technical Team",
    contact: "consumercare@bajajelectricals.com",
    website: "bajajelectricals.com",
    syllabus: [
      "Consumer Electrical Products",
      "Lighting System Design",
      "Engineering Project Management",
      "Quality Assurance",
      "Customer Service",
      "Product Development",
      "Market Research",
      "Technical Support"
    ],
    requirements: [
      "Engineering or technical background",
      "Interest in consumer goods",
      "Customer service orientation",
      "Technical aptitude"
    ],
    outcomes: [
      "Consumer industry experience",
      "Technical product knowledge",
      "Project management skills",
      "Career in consumer electrical"
    ]
  },
  "12": {
    title: "Industrial Exposure & Skill Training",
    company: "Strama-Summit Machinery Pvt. Ltd.",
    location: "Ambad MIDC, Nashik",
    type: "Industrial Automation",
    duration: "8 weeks",
    students: 110,
    rating: 4.5,
    price: "₹28,000",
    image: "/placeholder.svg",
    description: "Practical industrial exposure and skill development training in automation and machinery. This program focuses on real-world industrial applications and machinery operations.",
    instructor: "Ravi Mahadeokar",
    contact: "ravi.mahadeokar@stramasummit.com",
    website: "www.stramasummit.com",
    syllabus: [
      "Industrial Machinery Operations",
      "Automation System Basics",
      "Safety Procedures",
      "Equipment Maintenance",
      "Quality Control",
      "Production Planning",
      "Troubleshooting",
      "Industrial Standards"
    ],
    requirements: [
      "Technical education background",
      "Interest in machinery",
      "Safety consciousness",
      "Hands-on learning attitude"
    ],
    outcomes: [
      "Industrial machinery knowledge",
      "Safety awareness",
      "Practical skills",
      "Industry readiness"
    ]
  }
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("overview")

  const courseData = industryCoursesData[resolvedParams.id as keyof typeof industryCoursesData] || industryCoursesData["1"]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Course Header */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {courseData.title}
                </h1>
                <div className="flex items-center space-x-6 text-gray-400 mb-6">
                  <span className="flex items-center">
                    <Building size={20} className="mr-2" />
                    {courseData.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin size={20} className="mr-2" />
                    {courseData.location}
                  </span>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {courseData.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{courseData.duration}</div>
                  <div className="text-sm text-gray-400">Duration</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{courseData.students}</div>
                  <div className="text-sm text-gray-400">Students</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{courseData.rating}</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{courseData.price}</div>
                  <div className="text-sm text-gray-400">Price</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex space-x-8 mb-6 border-b border-gray-700">
                  {[
                    { id: "overview", label: "Overview", icon: BookOpen },
                    { id: "syllabus", label: "Syllabus", icon: CheckCircle },
                    { id: "requirements", label: "Requirements", icon: CheckCircle },
                    { id: "outcomes", label: "Learning Outcomes", icon: CheckCircle }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 pb-4 px-2 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-purple-500 text-purple-400"
                          : "border-transparent text-gray-400 hover:text-white"
                      }`}
                    >
                      <tab.icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">About This Program</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {courseData.description}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Instructor</h3>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                            {courseData.instructor.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold">{courseData.instructor}</div>
                            <div className="text-gray-400">{courseData.company}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail size={16} />
                            <span>{courseData.contact}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe size={16} />
                            <a href={courseData.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                              {courseData.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "syllabus" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Course Syllabus</h3>
                      <div className="space-y-3">
                        {courseData.syllabus.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "requirements" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Prerequisites & Requirements</h3>
                      <div className="space-y-3">
                        {courseData.requirements.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle size={20} className="text-green-400 mt-0.5" />
                            <span className="text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "outcomes" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                      <div className="space-y-3">
                        {courseData.outcomes.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle size={20} className="text-green-400 mt-0.5" />
                            <span className="text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-24">
                <div className="aspect-video rounded-lg overflow-hidden mb-6">
                  <img
                    src={courseData.image}
                    alt={courseData.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-3xl font-bold text-purple-400 mb-6">
                  {courseData.price}
                </div>

                <Link
                  href={`/enroll/${resolvedParams.id}`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mb-4 block text-center"
                >
                  Enroll Now
                </Link>

                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mb-6">
                  Add to Wishlist
                </button>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Students:</span>
                    <span>{courseData.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="flex items-center">
                      <Star size={16} className="text-yellow-400 mr-1" />
                      {courseData.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span>{courseData.type}</span>
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
