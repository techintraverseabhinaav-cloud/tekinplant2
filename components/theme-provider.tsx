'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Sync theme on mount to ensure consistency
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const dataTheme = document.documentElement.getAttribute('data-theme')
      const htmlClass = document.documentElement.className
      
      // If data-theme is set but className doesn't match, sync them
      if (dataTheme && htmlClass !== dataTheme && !htmlClass.includes(dataTheme)) {
        document.documentElement.className = dataTheme
      }
    }
  }, [])
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
