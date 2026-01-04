"use client"

import { useTheme } from "next-themes"
import { useMemo, useState, useEffect } from "react"

export function useThemeStyles() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, systemTheme } = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // During SSR, default to dark to match server render
  // After mount, use resolvedTheme which gives the actual theme
  const currentTheme = mounted ? (resolvedTheme || systemTheme || theme || 'dark') : 'dark'
  const isDark = currentTheme === "dark"

  return useMemo(() => {
    if (isDark) {
      return {
        pageBg: '#000000',
        pageBgGradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)',
        sectionBgOverlay: 'rgba(0,0,0,0.4)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.7)',
        cardBg: 'rgba(0,0,0,0.4)',
        selectBg: '#0a0a0a',
        buttonGradient: 'linear-gradient(to right, #a78bfa, #c084fc, #a78bfa)',
        buttonShadow: '0 0 20px rgba(196,181,253,0.4), 0 0 40px rgba(196,181,253,0.2)',
        buttonShadowHover: '0 0 25px rgba(196,181,253,0.6), 0 0 50px rgba(196,181,253,0.4)',
      }
    } else {
      return {
        pageBg: '#f5f1e8',
        pageBgGradient: 'linear-gradient(180deg, #f5f1e8 0%, #e8ddd4 50%, #d4c4b0 100%)',
        sectionBgOverlay: 'rgba(255,255,255,0.6)',
        textPrimary: '#3a2e1f',
        textSecondary: 'rgba(58, 46, 31, 0.7)',
        cardBg: 'rgba(255,255,255,0.7)',
        selectBg: '#ffffff',
        buttonGradient: 'linear-gradient(to right, #8b6f47, #a0826d, #8b6f47)',
        buttonShadow: '0 0 20px rgba(139, 90, 43, 0.25), 0 0 40px rgba(139, 90, 43, 0.15)',
        buttonShadowHover: '0 0 25px rgba(139, 90, 43, 0.35), 0 0 50px rgba(139, 90, 43, 0.2)',
      }
    }
  }, [isDark, mounted, currentTheme])
}

