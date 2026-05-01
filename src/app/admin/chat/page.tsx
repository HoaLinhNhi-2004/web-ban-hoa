'use client'

import { type FC, useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, Circle, Flower2 } from 'lucide-react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Conversation, Message } from '@/types'

const AdminChatPage: FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected,      setSelected]      = useState<Conversation | null>(null)
  const [messages,      setMessages]      = useState<Message[]>([])
  const [input,         setInput]         = useState('')
  const [adminId,       setAdminId]       = useState<string | null>(null)
  const bottomRef   = useRef<HTMLDivElement>(null)
  const msgChannelRef = useRef<RealtimeChannel | null>(null)

  // Lấy adminId
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAdminId(session.user.id)
    })
  }, [])

  // Load + subscribe conversations
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
      setConversations((data ?? []) as Conversation[])
    }

    void load()

    const channel = supabase
      .channel('admin-conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        void load()
      })
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [])

  // Load messages khi chọn conversation
  useEffect(() => {
    if (!selected) return

    const load = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selected.id)
        .order('created_at', { ascending: true })
      setMessages((data ?? []) as Message[])

      // Đánh dấu đã đọc
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', selected.id)
        .eq('sender_role', 'user')
        .eq('is_read', false)
    }

    void load()

    // Cleanup channel cũ trước khi subscribe mới
    if (msgChannelRef.current) {
      void supabase.removeChannel(msgChannelRef.current)
    }

    msgChannelRef.current = supabase
      .channel(`admin-messages:${selected.id}`)
      .on(
        'postgres_changes',
        {
          event : 'INSERT',
          schema: 'public',
          table : 'messages',
          filter: `conversation_id=eq.${selected.id}`,
        },
        payload => {
          setMessages(prev => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      if (msgChannelRef.current) {
        void supabase.removeChannel(msgChannelRef.current)
        msgChannelRef.current = null
      }
    }
  }, [selected])

  // Scroll xuống cuối
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !selected || !adminId) return

    await supabase.from('messages').insert({
      conversation_id: selected.id,
      sender_id      : adminId,
      sender_role    : 'admin',
      content        : input.trim(),
    })

    await supabase
      .from('conversations')
      .update({
        last_message   : input.trim(),
        last_message_at: new Date().toISOString(),
      })
      .eq('id', selected.id)

    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden border border-[rgba(195,130,120,0.18)]">

      {/* Sidebar — danh sách hội thoại */}
      <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-[rgba(195,130,120,0.15)] bg-[#FAF8F5]">
        <div className="border-b border-[rgba(195,130,120,0.15)] px-4 py-3">
          <h2 className="font-display text-lg font-light text-[#1E1714]">Hội thoại</h2>
          <p className="font-sans text-[11px] text-[rgba(30,23,20,0.4)]">
            {conversations.length} cuộc trò chuyện
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <MessageCircle className="h-8 w-8 text-[rgba(168,84,72,0.2)]" />
            <p className="font-sans text-sm text-[rgba(30,23,20,0.35)]">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <ul className="divide-y divide-[rgba(195,130,120,0.1)]">
            {conversations.map(conv => (
              <li key={conv.id}>
                <button
                  onClick={() => setSelected(conv)}
                  suppressHydrationWarning
                  className={cn(
                    'w-full px-4 py-3 text-left transition-colors hover:bg-[rgba(168,84,72,0.04)]',
                    selected?.id === conv.id && 'bg-[rgba(168,84,72,0.06)]',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(168,84,72,0.1)]">
                        <span className="font-sans text-sm font-medium text-[#A85448]">
                          {(conv.user_name ?? 'K').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-medium text-[#1E1714]">
                          {conv.user_name ?? 'Khách'}
                        </p>
                        <p className="truncate font-sans text-[11px] text-[rgba(30,23,20,0.4)]">
                          {conv.last_message ?? 'Chưa có tin nhắn'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-1">
                      <p className="font-sans text-[10px] text-[rgba(30,23,20,0.3)]">
                        {new Date(conv.last_message_at).toLocaleTimeString('vi-VN', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      <Circle className={cn(
                        'h-2 w-2',
                        conv.status === 'open'
                          ? 'fill-green-500 text-green-500'
                          : 'fill-gray-300 text-gray-300',
                      )} />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat area */}
      {selected ? (
        <div className="flex flex-1 flex-col bg-white">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[rgba(195,130,120,0.15)] px-5 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(168,84,72,0.1)]">
              <span className="font-sans font-medium text-[#A85448]">
                {(selected.user_name ?? 'K').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-[#1E1714]">
                {selected.user_name ?? 'Khách hàng'}
              </p>
              {selected.user_email && (
                <p className="font-sans text-[11px] text-[rgba(30,23,20,0.4)]">
                  {selected.user_email}
                </p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2',
                  msg.sender_role === 'admin' ? 'justify-end' : 'justify-start',
                )}
              >
                {msg.sender_role === 'user' && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(168,84,72,0.1)]">
                    <span className="font-sans text-xs text-[#A85448]">
                      {(selected.user_name ?? 'K').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className={cn(
                  'max-w-[360px] rounded-2xl px-4 py-2.5',
                  msg.sender_role === 'admin'
                    ? 'rounded-tr-none bg-[#A85448] text-[#FAF8F5]'
                    : 'rounded-tl-none border border-[rgba(195,130,120,0.18)] bg-[#FAF8F5] text-[#1E1714]',
                )}>
                  <p className="font-sans text-[13px] leading-relaxed">{msg.content}</p>
                  <p className={cn(
                    'mt-1 font-sans text-[10px]',
                    msg.sender_role === 'admin'
                      ? 'text-[rgba(255,255,255,0.6)]'
                      : 'text-[rgba(30,23,20,0.35)]',
                  )}>
                    {new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                {msg.sender_role === 'admin' && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(168,84,72,0.1)]">
                    <Flower2 className="h-3.5 w-3.5 text-[#A85448]" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 border-t border-[rgba(195,130,120,0.15)] px-5 py-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) void handleSend()
              }}
              placeholder="Nhập tin nhắn trả lời..."
              aria-label="Nhập tin nhắn"
              className="flex-1 bg-transparent font-sans text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:outline-none"
            />
            <button
              onClick={() => void handleSend()}
              suppressHydrationWarning
              disabled={!input.trim()}
              aria-label="Gửi tin nhắn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A85448] text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-white">
          <div className="space-y-3 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-[rgba(168,84,72,0.2)]" />
            <p className="font-display text-xl font-light text-[rgba(30,23,20,0.3)]">
              Chọn một hội thoại
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminChatPage
