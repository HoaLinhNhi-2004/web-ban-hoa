'use client'

import { type FC, useState } from 'react'
import { X, Save } from 'lucide-react'

interface OrderNoteModalProps {
  orderId     : string
  currentNote : string | null
  orderCode   : string
  onClose     : () => void
  onSave      : (note: string) => void
}

const OrderNoteModal: FC<OrderNoteModalProps> = ({
  orderId, currentNote, orderCode, onClose, onSave,
}) => {
  const [note,     setNote]     = useState(currentNote ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error,    setError]    = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ internal_note: note }),
      })
      if (!res.ok) { setError('Lưu thất bại'); return }
      onSave(note)
      onClose()
    } catch {
      setError('Đã có lỗi xảy ra')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Ghi chú nội bộ"
    >
      <div className="w-full max-w-md bg-[#FAF8F5] border border-[rgba(195,130,120,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(195,130,120,0.18)] px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-light text-[#1E1714]">Ghi chú nội bộ</h2>
            <p className="font-sans text-[11px] text-[rgba(30,23,20,0.4)]">Đơn #{orderCode}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            suppressHydrationWarning
            className="flex h-8 w-8 items-center justify-center text-[rgba(30,23,20,0.4)] hover:text-[#A85448] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="font-sans text-[12px] text-[rgba(30,23,20,0.45)]">
            Ghi chú này chỉ hiển thị với admin — khách hàng không thấy.
          </p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
            placeholder="VD: Khách yêu cầu giao trước 5h chiều, gọi trước khi giao..."
            aria-label="Nội dung ghi chú"
            className="w-full resize-none border border-[rgba(195,130,120,0.25)] bg-transparent px-4 py-2.5 font-sans text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.2)]"
          />
          {error && (
            <p role="alert" className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[rgba(195,130,120,0.15)] px-5 py-4">
          <button
            onClick={onClose}
            suppressHydrationWarning
            className="border border-[rgba(168,84,72,0.25)] px-5 py-2 font-sans text-[10px] tracking-[2px] uppercase text-[rgba(30,23,20,0.5)] hover:border-[#A85448] hover:text-[#A85448] transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            suppressHydrationWarning
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#A85448] px-5 py-2 font-sans text-[10px] tracking-[2px] uppercase text-[#FAF8F5] hover:bg-[#8B3D33] transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Đang lưu...' : 'Lưu ghi chú'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderNoteModal
