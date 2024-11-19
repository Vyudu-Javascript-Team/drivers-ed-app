import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ContentState {
  isDirty: boolean
  isSaving: boolean
  lastSaved?: Date
}

export function useContentManager(storyId: string) {
  const [state, setState] = useState<ContentState>({
    isDirty: false,
    isSaving: false,
  })

  const saveContent = async (content: string) => {
    setState(prev => ({ ...prev, isSaving: true }))
    try {
      await fetch(`/api/admin/stories/${storyId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      setState({ isDirty: false, isSaving: false, lastSaved: new Date() })
      toast.success('Content saved successfully')
    } catch (error) {
      toast.error('Failed to save content')
      setState(prev => ({ ...prev, isSaving: false }))
    }
  }

  const markDirty = () => {
    setState(prev => ({ ...prev, isDirty: true }))
  }

  return {
    ...state,
    saveContent,
    markDirty,
  }
}