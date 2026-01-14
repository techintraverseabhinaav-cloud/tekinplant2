"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import { useThemeStyles } from "../../lib/theme-styles"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()
  const themeStyles = useThemeStyles()
  const isDark = theme === "dark"

  return (
    <footer className="mt-20" style={{ backgroundColor: themeStyles.pageBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}>
              TekInPlant
            </h3>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#2d2d2d' }}>
              Industry-leading training programs to accelerate your professional growth.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}>
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone 
                  className="w-5 h-5 mt-0.5 flex-shrink-0" 
                  style={{ color: isDark ? '#c084fc' : '#8b6f47' }} 
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1a1a' }}>
                    +91 9860970798
                  </p>
                  <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#4a4a4a' }}>
                    Mon-Fri, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail 
                  className="w-5 h-5 mt-0.5 flex-shrink-0" 
                  style={{ color: isDark ? '#c084fc' : '#8b6f47' }} 
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1a1a' }}>
                    info@trainin.com
                  </p>
                  <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#4a4a4a' }}>
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Hours */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}>
              Location
            </h3>
            <div className="flex items-start space-x-3">
              <MapPin 
                className="w-5 h-5 mt-0.5 flex-shrink-0" 
                style={{ color: isDark ? '#c084fc' : '#8b6f47' }} 
              />
              <div className="space-y-1">
                <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1a1a' }}>
                  TEKINPLANT Headquarters<br />
                  Tech Park, Building A<br />
                  Bangalore, Karnataka 560001<br />
                  India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="pt-8 border-t" 
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(58, 46, 31, 0.2)' }}
        >
          <p className="text-sm text-center" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#4a4a4a' }}>
            © {currentYear} TekInPlant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
