'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useWishlist(productId: string) {
  const [isWished,  setIsWished]  = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId,    setUserId]    = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (!userId || !productId) return

    const check = async () => {
      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id',    userId)
        .eq('product_id', productId)
        .single()

      setIsWished(Boolean(data))
    }
    check()
  }, [userId, productId])

  const toggle = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      if (isWished) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id',    userId)
          .eq('product_id', productId)
        setIsWished(false)
      } else {
        await supabase
          .from('wishlists')
          .insert({ user_id: userId, product_id: productId })
        setIsWished(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [userId, productId, isWished])

  return { isWished, isLoading, toggle, isLoggedIn: Boolean(userId) }
}
