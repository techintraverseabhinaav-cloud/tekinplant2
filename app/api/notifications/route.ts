import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { generateUserIdFromClerkId } from '../../../lib/supabase/sync-clerk-user'

async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch notifications
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const supabaseUserId = generateUserIdFromClerkId(clerkId)
    const searchParams = request.nextUrl.searchParams
    const notificationId = searchParams.get('id')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Get single notification by ID
    if (notificationId) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .eq('user_id', supabaseUserId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    }

    // Get user's notifications
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', supabaseUserId)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Notifications API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST - Create notification
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const body = await request.json()
    const { userId, title, message, type, link } = body

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'User ID, title, and message are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type: type || 'info',
        link: link || null,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return NextResponse.json(
        { error: 'Failed to create notification', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, notification: data })
  } catch (error: any) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PUT - Update notification (mark as read)
export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const supabaseUserId = generateUserIdFromClerkId(clerkId)
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns this notification
    const { data: notification, error: checkError } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (checkError || notification?.user_id !== supabaseUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('notifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update notification', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, notification: data })
  } catch (error: any) {
    console.error('Update notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update notification' },
      { status: 500 }
    )
  }
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const supabaseUserId = generateUserIdFromClerkId(clerkId)
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns this notification
    const { data: notification, error: checkError } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (checkError || notification?.user_id !== supabaseUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete notification', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Notification deleted' })
  } catch (error: any) {
    console.error('Delete notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete notification' },
      { status: 500 }
    )
  }
}

