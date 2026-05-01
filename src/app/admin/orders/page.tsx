'use client'

import { type FC, useState, useEffect, useCallback } from 'react'
import { MessageSquare } from 'lucide-react'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/constants'
import OrderNoteModal from '@/components/admin/OrderNoteModal'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: '',           label: 'Tất cả'       },
  { value: 'pending',    label: 'Chờ xác nhận' },
  { value: 'confirmed',  label: 'Đã xác nhận'  },
  { value: 'delivering', label: 'Đang giao'     },
  { value: 'delivered',  label: 'Đã giao'       },
  { value: 'cancelled',  label: 'Đã hủy'        },
]

const NEXT_STATUS: Record<string, OrderStatus | null> = {
  pending   : 'confirmed',
  confirmed : 'delivering',
  delivering: 'delivered',
  delivered : null,
  cancelled : null,
}

const NEXT_STATUS_LABEL: Record<string, string> = {
  pending   : 'Xác nhận đơn',
  confirmed : 'Bắt đầu giao',
  delivering: 'Đã giao xong',
}

type AdminOrder = {
  id              : string
  status          : OrderStatus
  total           : number
  shipping_address: string
  phone           : string
  note            : string | null
  internal_note   : string | null
  created_at      : string
  order_items     : { product_name: string; quantity: number; price: number }[]
}

const AdminOrdersPage: FC = () => {
  const [orders,       setOrders]       = useState<AdminOrder[]>([])
  const [isLoading,    setIsLoading]    = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [noteModal,    setNoteModal]    = useState<AdminOrder | null>(null)
  const [updatingId,   setUpdatingId]   = useState<string | null>(null)
  const [error,        setError]        = useState('')

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const res  = await fetch('/api/orders/admin')
      const json = await res.json() as { data?: AdminOrder[] }
      setOrders(json.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { void fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId)
    setError('')
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) { setError('Cập nhật thất bại'); return }
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
    } catch {
      setError('Đã có lỗi xảy ra')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleNoteSave = (orderId: string, note: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, internal_note: note } : o
    ))
  }

  const filtered = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-light text-[#1E1714]">Đơn hàng</h1>
        <p className="mt-1 font-sans text-sm text-[rgba(30,23,20,0.4)]">
          {orders.length} đơn hàng · {counts['pending'] ?? 0} chờ xác nhận
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => setFilterStatus(s.value)}
            suppressHydrationWarning
            className={cn(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 font-sans text-[11px] tracking-[1px] transition-all border',
              filterStatus === s.value
                ? 'bg-[#A85448] text-[#FAF8F5] border-[#A85448]'
                : 'border-[rgba(195,130,120,0.25)] text-[rgba(30,23,20,0.5)] hover:border-[#A85448] hover:text-[#A85448]'
            )}
          >
            {s.label}
            {s.value && counts[s.value] ? (
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px]',
                filterStatus === s.value
                  ? 'bg-[rgba(255,255,255,0.2)] text-white'
                  : 'bg-[rgba(168,84,72,0.1)] text-[#A85448]'
              )}>
                {counts[s.value]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="rounded bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}

      {/* Bảng đơn hàng */}
      <div className="border border-[rgba(195,130,120,0.18)] bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(195,130,120,0.12)] bg-[rgba(168,84,72,0.02)]">
                {['Mã đơn', 'Thời gian', 'Sản phẩm', 'Tổng tiền', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-sans text-[9px] tracking-[3px] uppercase text-[rgba(30,23,20,0.35)] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(195,130,120,0.1)]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-[rgba(195,130,120,0.1)]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center font-sans text-sm text-[rgba(30,23,20,0.35)]">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-[rgba(168,84,72,0.02)] transition-colors">

                  {/* Mã đơn + ghi chú preview */}
                  <td className="px-5 py-3">
                    <div>
                      <span className="font-display text-[13px] text-[#1E1714]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      {order.internal_note && (
                        <p className="mt-0.5 font-sans text-[10px] text-[rgba(30,23,20,0.4)] max-w-[140px] truncate">
                          📝 {order.internal_note}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Thời gian */}
                  <td className="px-5 py-3 font-sans text-[12px] text-[rgba(30,23,20,0.45)] whitespace-nowrap">
                    {formatDateTime(order.created_at)}
                  </td>

                  {/* Sản phẩm */}
                  <td className="px-5 py-3">
                    <ul className="space-y-0.5">
                      {order.order_items?.slice(0, 2).map((item, i) => (
                        <li key={i} className="font-sans text-[12px] text-[rgba(30,23,20,0.5)]">
                          {item.product_name} x{item.quantity}
                        </li>
                      ))}
                      {(order.order_items?.length ?? 0) > 2 && (
                        <li className="font-sans text-[11px] text-[rgba(30,23,20,0.35)]">
                          +{order.order_items.length - 2} món khác
                        </li>
                      )}
                    </ul>
                  </td>

                  {/* Tổng tiền */}
                  <td className="px-5 py-3 font-display text-[13px] text-[#A85448] whitespace-nowrap">
                    {formatPrice(Number(order.total))}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 font-sans text-[10px] font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">

                      {/* Nút đổi trạng thái tiếp theo */}
                      {NEXT_STATUS[order.status] && (
                        <button
                          onClick={() => void handleStatusChange(order.id, NEXT_STATUS[order.status]!)}
                          suppressHydrationWarning
                          disabled={updatingId === order.id}
                          className="flex items-center gap-1.5 border border-[rgba(168,84,72,0.3)] px-3 py-1.5 font-sans text-[10px] tracking-[1px] uppercase text-[#A85448] hover:bg-[rgba(168,84,72,0.06)] transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {updatingId === order.id ? '...' : NEXT_STATUS_LABEL[order.status]}
                        </button>
                      )}

                      {/* Nút ghi chú */}
                      <button
                        onClick={() => setNoteModal(order)}
                        suppressHydrationWarning
                        aria-label="Thêm ghi chú nội bộ"
                        className={cn(
                          'flex h-8 w-8 items-center justify-center border transition-colors',
                          order.internal_note
                            ? 'border-[#A85448] text-[#A85448]'
                            : 'border-[rgba(195,130,120,0.2)] text-[rgba(30,23,20,0.4)] hover:border-[#A85448] hover:text-[#A85448]'
                        )}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {noteModal && (
        <OrderNoteModal
          orderId    ={noteModal.id}
          currentNote={noteModal.internal_note}
          orderCode  ={noteModal.id.slice(0, 8).toUpperCase()}
          onClose    ={() => setNoteModal(null)}
          onSave     ={(note) => handleNoteSave(noteModal.id, note)}
        />
      )}
    </div>
  )
}

export default AdminOrdersPage
