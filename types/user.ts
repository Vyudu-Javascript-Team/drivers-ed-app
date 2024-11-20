export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  phone?: string
  bio?: string
  avatarUrl?: string
  notifications: boolean
  twoFactorAuth: boolean
  createdAt: string
  updatedAt: string
  lastActiveAt?: string
}
