"use client"

import { useEffect, useRef } from 'react'

export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false }) // Disable alpha for better performance
    if (!ctx) return

    // Throttle resize for better performance
    let resizeTimeout: NodeJS.Timeout
    const resize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }, 100)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    let mouseX = 0.5
    let mouseY = 0.5

    // Throttle mouse move for better performance
    let mouseMoveTimeout: NodeJS.Timeout
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseMoveTimeout)
      mouseMoveTimeout = setTimeout(() => {
        mouseX = e.clientX / window.innerWidth
        mouseY = e.clientY / window.innerHeight
      }, 16) // ~60fps throttle
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    let animationFrame: number
    let lastTime = 0
    const targetFPS = 30 // Reduce to 30fps for better performance
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        const time = currentTime * 0.0005
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        const gradient = ctx.createRadialGradient(
          canvas.width * (0.3 + mouseX * 0.2),
          canvas.height * (0.3 + mouseY * 0.2),
          0,
          canvas.width * (0.5 + Math.sin(time) * 0.1),
          canvas.height * (0.5 + Math.cos(time) * 0.1),
          canvas.width * 0.8
        )
        
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)')
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)')
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        lastTime = currentTime
      }
      
      animationFrame = requestAnimationFrame(animate)
    }
    animate(0)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
      clearTimeout(resizeTimeout)
      clearTimeout(mouseMoveTimeout)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" style={{ willChange: 'auto' }} />
}