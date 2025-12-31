"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Save,
  Camera,
  Edit2,
  X,
  Sun,
  Moon,
  Monitor
} from "lucide-react"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: ""
  })

  // Handle theme mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoaded && user && !isEditing) {
      // Only update formData when not editing to avoid overwriting user input
      // This ensures we use the latest values from Clerk
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        role: (user.publicMetadata?.role as string) || "student"
      })
    }
  }, [isLoaded, user, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!user) return
    
    // Capture current form values BEFORE any updates
    const currentFirstName = formData.firstName
    const currentLastName = formData.lastName
    
    console.log('💾 Saving profile with values:', {
      firstName: currentFirstName,
      lastName: currentLastName
    })
    
    setIsSaving(true)
    try {
      // Update Clerk user data
      await user.update({
        firstName: currentFirstName,
        lastName: currentLastName,
      })
      
      // Wait a moment for Clerk to update internally
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Sync to Supabase using the CAPTURED values (not formData which might be stale)
      console.log('🔄 Syncing profile to Supabase...', {
        firstName: currentFirstName,
        lastName: currentLastName
      })
      
      try {
        const response = await fetch('/api/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: currentFirstName,
            lastName: currentLastName,
          }),
        })

        console.log('📡 API Response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ Failed to sync to Supabase:', errorData)
          console.error('❌ Response status:', response.status)
          console.error('❌ Full error:', JSON.stringify(errorData, null, 2))
          
          // Show error to user
          alert(`Profile updated in Clerk, but failed to sync to Supabase: ${errorData.error || 'Unknown error'}. Check console for details.`)
        } else {
          const result = await response.json()
          console.log('✅ Profile synced to Supabase:', result)
          console.log('✅ Updated profile:', result.profile)
        }
      } catch (syncError: any) {
        console.error('❌ Error syncing to Supabase:', syncError)
        console.error('❌ Error message:', syncError?.message)
        console.error('❌ Error stack:', syncError?.stack)
        
        // Show error to user
        alert(`Profile updated in Clerk, but failed to sync to Supabase: ${syncError?.message || 'Network error'}. Check console for details.`)
      }
      
      // Note: Email changes typically require verification in Clerk
      // Role changes should be restricted to admins
      
      // Close editing mode first
      setIsEditing(false)
      
      // Update formData with the saved values to ensure UI shows correct data
      // This prevents the useEffect from overwriting with stale user data
      setFormData(prev => ({
        ...prev,
        firstName: currentFirstName,
        lastName: currentLastName,
      }))
      
      alert("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        role: (user.publicMetadata?.role as string) || "student"
      })
    }
    setIsEditing(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return
    
    const file = e.target.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }
    
    setIsUploadingImage(true)
    try {
      // Upload image to Clerk
      await user.setProfileImage({ file })
      
      // Wait for Clerk to process the image
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Sync avatar URL to Supabase
      if (user.imageUrl) {
        const response = await fetch('/api/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avatarUrl: user.imageUrl,
          }),
        })
        
        if (!response.ok) {
          console.error('Failed to sync avatar to Supabase')
        } else {
          console.log('Avatar synced to Supabase')
        }
      }
      
      alert('Profile image updated successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingImage(false)
      // Reset file input
      e.target.value = ''
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const userRole = (user.publicMetadata?.role as string) || "student"
  const userName = user.fullName || user.firstName || "User"

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={userName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors cursor-pointer">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs">Uploading...</div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{userName}</h2>
              <p className="text-gray-400 mb-2">{formData.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                userRole === 'admin' ? 'bg-red-900/30 text-red-300' :
                userRole === 'trainer' ? 'bg-green-900/30 text-green-300' :
                userRole === 'corporate' ? 'bg-blue-900/30 text-blue-300' :
                'bg-purple-900/30 text-purple-300'
              }`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
          
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter first name"
                />
              ) : (
                <p className="text-white">{formData.firstName || "Not set"}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter last name"
                />
              ) : (
                <p className="text-white">{formData.lastName || "Not set"}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <Mail size={16} className="mr-2" />
                Email Address
              </label>
              <p className="text-white">{formData.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Email changes require verification. Contact support to change your email.
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <Shield size={16} className="mr-2" />
                Account Role
              </label>
              <p className="text-white capitalize">{formData.role}</p>
              <p className="text-xs text-gray-500 mt-1">
                Role cannot be changed from this page. Contact an administrator for role changes.
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-6 border border-gray-700 dark:border-gray-700 mt-6">
          <h3 className="text-xl font-semibold mb-6">Appearance</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Theme Preference
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                  }`}
                >
                  <Sun size={24} className={`mb-2 ${theme === 'light' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-purple-300' : 'text-gray-400'}`}>
                    Light
                  </span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                  }`}
                >
                  <Moon size={24} className={`mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-gray-400'}`}>
                    Dark
                  </span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    theme === 'system'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                  }`}
                >
                  <Monitor size={24} className={`mb-2 ${theme === 'system' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'system' ? 'text-purple-300' : 'text-gray-400'}`}>
                    System
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {mounted && (
                  <>
                    {theme === 'system' 
                      ? 'Theme will match your system preferences'
                      : theme === 'dark'
                      ? 'Dark mode is currently active'
                      : 'Light mode is currently active'
                    }
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-6 border border-gray-700 dark:border-gray-700 mt-6">
          <h3 className="text-xl font-semibold mb-6">Account Actions</h3>
          <div className="space-y-4">
            <Link
              href={userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
              className="block px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-center"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={async () => {
                await signOut()
                router.push("/")
              }}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-center"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

