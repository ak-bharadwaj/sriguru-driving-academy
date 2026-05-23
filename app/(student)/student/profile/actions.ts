'use server'

import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function updateProfile(data: { name: string; phone: string }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  try {
    await db.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        phone: data.phone || null
      }
    })
    
    revalidatePath('/student/profile')
    revalidatePath('/student/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function updateAvatar(avatarUrl: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  try {
    await db.user.update({
      where: { email: session.user.email },
      data: { avatarUrl }
    })
    
    revalidatePath('/student/profile')
    revalidatePath('/student/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update avatar:', error)
    return { success: false, error: 'Failed to update avatar' }
  }
}

export async function changePassword(newPassword: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10)
    await db.user.update({
      where: { email: session.user.email },
      data: { passwordHash }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to change password:', error)
    return { success: false, error: 'Failed to change password' }
  }
}
