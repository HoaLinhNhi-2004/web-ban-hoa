'use client'

import { type FC, useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export interface ShippingResult {
  name: string
  fee : number
}

interface ShippingCalculatorProps {
  current : ShippingResult
  onSelect: (result: ShippingResult) => void
}

const QUICK_ZONES = [
  { label: 'Nội thành TP.HCM',   address: 'quận 1, hồ chí minh' },
  { label: 'Nội thành Hà Nội',   address: 'hoàn kiếm, hà nội'   },
  { label: 'Ngoại thành / Tỉnh', address: 'tỉnh'                 },
] as const

const ShippingCalculator: FC<ShippingCalculatorProps> = ({ current, onSelect }) => {
  const [address,   setAddress]   = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selected,  setSelected]  = useState<ShippingResult | null>(null)
  const [showInput, setShowInput] = useState(false)

  const calculate = async (addr: string) => {
    if (!addr.trim() || isLoading) return
    setIsLoading(true)

    try {
      const res  = await fetch('/api/shipping', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ address: addr }),
      })
      const json = await res.json()

      if (res.ok && json.data) {
        setSelected(json.data as ShippingResult)
        onSelect(json.data as ShippingResult)
      }
    } catch {
      // giữ nguyên phí ship hiện tại nếu lỗi mạng
    }

    setIsLoading(false)
  }

  const active = selected ?? current

  return (
    <div className="space-y-3">
      {/* Quick select */}
      <div className="grid grid-cols-3 gap-2">
        {QUICK_ZONES.map(zone => (
          <button
            key={zone.label}
            onClick={() => void calculate(zone.address)}
            suppressHydrationWarning
            disabled={isLoading}
            className={`border px-2 py-2 text-center font-sans text-[10px] tracking-[1px] transition-colors disabled:opacity-50 ${
              active.name === zone.label
                ? 'border-[#A85448] bg-[rgba(168,84,72,0.06)] text-[#A85448]'
                : 'border-[rgba(195,130,120,0.2)] text-[rgba(30,23,20,0.5)] hover:border-[#A85448] hover:text-[#A85448]'
            }`}
          >
            {zone.label}
          </button>
        ))}
      </div>

      {/* Custom address toggle */}
      <button
        onClick={() => setShowInput(p => !p)}
        suppressHydrationWarning
        className="flex items-center gap-1.5 font-sans text-[11px] text-[rgba(30,23,20,0.4)] transition-colors hover:text-[#A85448]"
      >
        <MapPin className="h-3 w-3" />
        Nhập địa chỉ cụ thể
        <ChevronDown className={`h-3 w-3 transition-transform ${showInput ? 'rotate-180' : ''}`} />
      </button>

      {showInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && void calculate(address)}
            placeholder="VD: Quận 7, TP.HCM"
            aria-label="Địa chỉ giao hàng để tính phí ship"
            className="flex-1 border border-[rgba(195,130,120,0.25)] bg-transparent px-3 py-2 font-sans text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none"
          />
          <button
            onClick={() => void calculate(address)}
            suppressHydrationWarning
            disabled={isLoading || !address.trim()}
            className="border border-[rgba(168,84,72,0.3)] px-3 py-2 font-sans text-[10px] text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] disabled:opacity-50"
          >
            {isLoading ? '...' : 'Tính'}
          </button>
        </div>
      )}

      {/* Kết quả */}
      <div className="flex items-center justify-between border-t border-[rgba(195,130,120,0.12)] pt-2">
        <span className="font-sans text-[12px] text-[rgba(30,23,20,0.5)]">
          📍 {active.name}
        </span>
        <span className={`font-sans text-sm font-medium ${active.fee === 0 ? 'text-green-600' : 'text-[#1E1714]'}`}>
          {active.fee === 0 ? 'Miễn phí' : formatPrice(active.fee)}
        </span>
      </div>
    </div>
  )
}

export default ShippingCalculator
