import { User } from "@/types/user"

export async function getUser(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    throw new Error('Failed to create user')
  }
  return response.json()
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    throw new Error('Failed to update user')
  }
  return response.json()
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await fetch(`/api/users/${userId}/avatar`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    throw new Error('Failed to upload avatar')
  }
  const data = await response.json()
  return data.avatarUrl
}
