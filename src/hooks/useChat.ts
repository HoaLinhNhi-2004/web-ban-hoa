'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Message, Conversation } from '@/types'

export function useChat(userId: string | null) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages,     setMessages]     = useState<Message[]>([])
  const [isLoading,    setIsLoading]    = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const initConversation = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)

    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      setConversation(existing as Conversation)
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', existing.id)
        .order('created_at', { ascending: true })
      setMessages((msgs ?? []) as Message[])
    }

    setIsLoading(false)
  }, [userId])

  const createConversation = useCallback(async (
    userName: string,
    userEmail: string,
  ): Promise<Conversation | null> => {
    if (!userId) return null
    const { data } = await supabase
      .from('conversations')
      .insert({ user_id: userId, user_name: userName, user_email: userEmail })
      .select()
      .single()
    if (data) setConversation(data as Conversation)
    return (data as Conversation) ?? null
  }, [userId])

  const sendMessage = useCallback(async (
    content: string,
    conversationId: string,
  ): Promise<Message | null> => {
    if (!content.trim() || !userId) return null

    const { data } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id      : userId,
        sender_role    : 'user',
        content        : content.trim(),
      })
      .select()
      .single()

    await supabase
      .from('conversations')
      .update({ last_message: content.trim(), last_message_at: new Date().toISOString() })
      .eq('id', conversationId)

    return (data as Message) ?? null
  }, [userId])

  // Subscribe realtime khi có conversation
  useEffect(() => {
    if (!conversation?.id) return

    channelRef.current = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event : 'INSERT',
          schema: 'public',
          table : 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        payload => {
          setMessages(prev => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [conversation?.id])

  // Clear state khi user đăng xuất
  useEffect(() => {
    if (userId === null) {
      setConversation(null)
      setMessages([])
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [userId])

  useEffect(() => {
    void initConversation()
  }, [initConversation])

  return {
    conversation,
    messages,
    isLoading,
    createConversation,
    sendMessage,
    setConversation,
    setMessages,
  }
}
