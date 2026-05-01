'use client'

import { type FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import type { OrderStatus } from '@/types'

interface OrderStatusSelectProps {
  orderId       : string
  currentStatus : OrderStatus
}

const ALL_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'delivering', 'delivered', 'cancelled'
]

const OrderStatusSelect: FC<OrderStatusSelectProps> = ({ orderId, currentStatus }) => {
  const [status,    setStatus]    = useState<OrderStatus>(currentStatus)
  const [isSaving,  setIsSaving]  = useState(false)

  const handleChange = async (newStatus: OrderStatus) => {
    setIsSaving(true)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) setStatus(newStatus)
    setIsSaving(false)
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value as OrderStatus)}
      disabled={isSaving}
      aria-label="Cập nhật trạng thái đơn hàng"
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60',
        ORDER_STATUS_COLOR[status]
      )}
    >
      {ALL_STATUSES.map(s => (
        <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
      ))}
    </select>
  )
}

export default OrderStatusSelect