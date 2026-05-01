'use client'

import { type FC, useState } from 'react'
import { Check, X, Tag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export interface PromoResult {
  code    : string
  type    : 'percent' | 'fixed'
  value   : number
  discount: number
}

interface PromoInputProps {
  subtotal: number
  onApply : (result: PromoResult | null) => void
}

const PromoInput: FC<PromoInputProps> = ({ subtotal, onApply }) => {
  const [code,      setCode]      = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState('')
  const [applied,   setApplied]   = useState<PromoResult | null>(null)

  const handleApply = async () => {
    if (!code.trim()) { setError('Vui lòng nhập mã giảm giá'); return }
    setIsLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/promo', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ code: code.trim(), subtotal }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Mã không hợp lệ')
        setIsLoading(false)
        return
      }

      const result = json.data as PromoResult
      setApplied(result)
      onApply(result)
    } catch {
      setError('Không thể kiểm tra mã. Vui lòng thử lại.')
    }

    setIsLoading(false)
  }

  const handleRemove = () => {
    setCode('')
    setApplied(null)
    setError('')
    onApply(null)
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-none border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
          <div>
            <p className="font-sans text-sm font-medium text-green-700">
              Mã <span className="font-mono">{applied.code}</span> đã được áp dụng
            </p>
            <p className="font-sans text-xs text-green-600">
              Giảm {applied.type === 'percent' ? `${applied.value}%` : formatPrice(applied.value)}
              {' '}— tiết kiệm {formatPrice(applied.discount)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          suppressHydrationWarning
          aria-label="Xóa mã giảm giá"
          className="text-green-600 transition-colors hover:text-green-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[rgba(30,23,20,0.3)]" />
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={e => e.key === 'Enter' && void handleApply()}
            placeholder="Nhập mã giảm giá"
            aria-label="Mã giảm giá"
            className="w-full border border-[rgba(195,130,120,0.25)] bg-transparent py-2.5 pl-9 pr-4 font-sans text-sm uppercase text-[#1E1714] placeholder:normal-case placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.2)]"
          />
        </div>
        <button
          onClick={() => void handleApply()}
          suppressHydrationWarning
          disabled={isLoading || !code.trim()}
          className="whitespace-nowrap border border-[rgba(168,84,72,0.3)] px-4 py-2.5 font-sans text-[10px] uppercase tracking-[2px] text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] disabled:opacity-50"
        >
          {isLoading ? '...' : 'Áp dụng'}
        </button>
      </div>
      {error && (
        <p role="alert" className="font-sans text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

export default PromoInput
