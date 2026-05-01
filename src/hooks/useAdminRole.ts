'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminRole() {
  const [isAdmin, setIsAdmin]     = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      setIsAdmin(data?.role === 'admin')
      setIsLoading(false)
    }

    checkRole()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkRole()
    })

    return () => subscription.unsubscribe()
  }, [])

  return { isAdmin, isLoading }
}
