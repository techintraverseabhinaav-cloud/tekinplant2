import { createClient } from './client'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  link: string | null
  created_at: string
}

export async function getNotifications(userId: string, unreadOnly: boolean = false) {
  const supabase = createClient()
  
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Notification[]
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
}

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      ...notification,
      read: false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

