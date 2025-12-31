"use client"

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ClerkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Clerk Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="text-gray-400 mb-4">
              There was an issue loading the authentication system.
            </p>
            <button
              onClick={() => {
                window.location.reload()
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Reload Page
            </button>
            <p className="text-sm text-gray-500 mt-4">
              If the problem persists, please check your internet connection or contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

