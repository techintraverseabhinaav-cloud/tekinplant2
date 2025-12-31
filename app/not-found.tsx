import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-purple-500/20 mb-4">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
          >
            <Search className="w-4 h-4" />
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}

