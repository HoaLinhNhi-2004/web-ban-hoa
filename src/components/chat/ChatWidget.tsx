'use client'

import { type FC, useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useChat } from '@/hooks/useChat'

const ChatWidget: FC = () => {
  const [isOpen,    setIsOpen]    = useState(false)
  const [userId,    setUserId]    = useState<string | null>(null)
  const [userName,  setUserName]  = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [input,     setInput]     = useState('')
  const [showForm,  setShowForm]  = useState(false)
  const [unread,    setUnread]    = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { conversation, messages, isLoading, createConversation, sendMessage } =
    useChat(userId)

  // Lắng nghe auth state — cập nhật khi đăng nhập/đăng xuất
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id)
        setUserEmail(session.user.email ?? '')
        setUserName(session.user.user_metadata?.full_name ?? '')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUserId(session.user.id)
        setUserEmail(session.user.email ?? '')
        setUserName(session.user.user_metadata?.full_name ?? '')
      } else {
        setUserId(null)
        setUserEmail('')
        setUserName('')
        setInput('')
        setShowForm(false)
        setUnread(0)
        setIsOpen(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Đếm tin admin chưa đọc khi widget đóng
  useEffect(() => {
    if (!isOpen) {
      const count = messages.filter(m => m.sender_role === 'admin' && !m.is_read).length
      setUnread(count)
    } else {
      setUnread(0)
    }
  }, [messages, isOpen])

  // Scroll xuống cuối khi có tin mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Tự đóng form khi conversation được thiết lập (từ initConversation hoặc createConversation)
  useEffect(() => {
    if (conversation) setShowForm(false)
  }, [conversation])

  const handleOpen = () => {
    setIsOpen(true)
    setUnread(0)
    if (!conversation) setShowForm(true)
  }

  const handleStartChat = async () => {
    if (!userName.trim() || !userId) return
    await createConversation(userName, userEmail)
    setShowForm(false)
  }

  const handleSend = async () => {
    if (!input.trim()) return
    if (!conversation?.id) { setShowForm(true); return }
    await sendMessage(input, conversation.id)
    setInput('')
  }

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[480px] w-[340px] flex-col border border-[rgba(195,130,120,0.2)] bg-[#FAF8F5] shadow-2xl md:right-6">

          {/* Header */}
          <div className="flex items-center justify-between bg-[#A85448] px-4 py-3">
            <div className="flex items-center gap-2">
              <Flower2 className="h-4 w-4 text-[#FAF8F5]" />
              <div>
                <p className="font-sans text-sm font-medium text-[#FAF8F5]">Flower Shop</p>
                <p className="font-sans text-[10px] text-[rgba(255,255,255,0.7)]">
                  Thường trả lời trong vài phút
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              suppressHydrationWarning
              aria-label="Đóng chat"
              className="text-[rgba(255,255,255,0.7)] transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {/* Tin nhắn chào mặc định */}
            <div className="flex gap-2">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(168,84,72,0.1)]">
                <Flower2 className="h-3.5 w-3.5 text-[#A85448]" />
              </div>
              <div className="max-w-[240px] rounded-2xl rounded-tl-none border border-[rgba(195,130,120,0.15)] bg-white px-3 py-2">
                <p className="font-sans text-[13px] text-[#1E1714]">
                  Xin chào! 🌸 Mình có thể giúp gì cho bạn hôm nay?
                </p>
              </div>
            </div>

            {/* Form nhập tên nếu chưa có conversation */}
            {showForm && (
              <div className="space-y-3 rounded-xl border border-[rgba(195,130,120,0.2)] bg-white p-4">
                <p className="font-sans text-[12px] text-[rgba(30,23,20,0.5)]">
                  Vui lòng cho mình biết tên của bạn:
                </p>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && void handleStartChat()}
                  placeholder="Tên của bạn"
                  aria-label="Tên của bạn"
                  className="w-full border border-[rgba(195,130,120,0.25)] px-3 py-2 font-sans text-sm text-[#1E1714] focus:border-[#A85448] focus:outline-none"
                />
                {!userId && (
                  <p className="font-sans text-[11px] text-[rgba(30,23,20,0.4)]">
                    💡{' '}
                    <a href="/login" className="text-[#A85448] underline">Đăng nhập</a>
                    {' '}để chat với admin
                  </p>
                )}
                <button
                  onClick={() => void handleStartChat()}
                  suppressHydrationWarning
                  disabled={!userName.trim() || !userId}
                  className="w-full bg-[#A85448] py-2 font-sans text-[10px] uppercase tracking-[2px] text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] disabled:opacity-50"
                >
                  Bắt đầu chat
                </button>
              </div>
            )}

            {/* Danh sách tin nhắn */}
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2',
                  msg.sender_role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                {msg.sender_role === 'admin' && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(168,84,72,0.1)]">
                    <Flower2 className="h-3.5 w-3.5 text-[#A85448]" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[220px] rounded-2xl px-3 py-2',
                  msg.sender_role === 'user'
                    ? 'rounded-tr-none bg-[#A85448] text-[#FAF8F5]'
                    : 'rounded-tl-none border border-[rgba(195,130,120,0.15)] bg-white text-[#1E1714]',
                )}>
                  <p className="font-sans text-[13px] leading-relaxed">{msg.content}</p>
                  <p className={cn(
                    'mt-1 font-sans text-[10px]',
                    msg.sender_role === 'user'
                      ? 'text-[rgba(255,255,255,0.6)]'
                      : 'text-[rgba(30,23,20,0.35)]',
                  )}>
                    {new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-[rgba(168,84,72,0.3)]"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input — chỉ hiện khi đã có conversation */}
          {conversation && (
            <div className="flex items-center gap-2 border-t border-[rgba(195,130,120,0.15)] p-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) void handleSend()
                }}
                placeholder="Nhập tin nhắn..."
                aria-label="Nhập tin nhắn"
                className="flex-1 bg-transparent font-sans text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:outline-none"
              />
              <button
                onClick={() => void handleSend()}
                suppressHydrationWarning
                disabled={!input.trim()}
                aria-label="Gửi tin nhắn"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A85448] text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={handleOpen}
        suppressHydrationWarning
        aria-label="Mở chat hỗ trợ"
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#A85448] text-[#FAF8F5] shadow-lg transition-all hover:scale-105 hover:bg-[#8B3D33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448] focus-visible:ring-offset-2 md:right-6"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-sans text-[10px] font-bold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  )
}

export default ChatWidget
