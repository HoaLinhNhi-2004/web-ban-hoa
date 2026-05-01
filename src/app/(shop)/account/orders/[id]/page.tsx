import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase-server'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/constants'
import AccountSidebar from '@/components/account/AccountSidebar'
import type { OrderItem, OrderStatus } from '@/types'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) notFound()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (!order) notFound()

  return (
    <div className="container-shop py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />

        <main className="flex-1 min-w-0 space-y-6">

          {/* Back */}
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-[#A85448] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Quay lại lịch sử đơn hàng
          </Link>

          {/* Header */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-light text-text">
                  Đơn hàng #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Đặt lúc {formatDateTime(order.created_at)}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${ORDER_STATUS_COLOR[order.status as OrderStatus]}`}>
                {ORDER_STATUS_LABEL[order.status as OrderStatus]}
              </span>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-light text-text mb-4">
              Sản phẩm đã đặt
            </h2>
            <ul className="divide-y divide-[rgba(195,130,120,0.12)]">
              {order.order_items.map((item: OrderItem) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F5EDE8]">
                    {item.product_image && (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text">{item.product_name}</p>
                    <p className="text-sm text-muted">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-[#A85448]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin + Tổng tiền */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-lg font-light text-text mb-4">
                Thông tin giao hàng
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted w-24 shrink-0">Địa chỉ</span>
                  <span className="text-text">{order.shipping_address}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted w-24 shrink-0">Điện thoại</span>
                  <span className="text-text">{order.phone}</span>
                </div>
                {order.note && (
                  <div className="flex gap-2">
                    <span className="text-muted w-24 shrink-0">Ghi chú</span>
                    <span className="text-text">{order.note}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-lg font-light text-text mb-4">
                Tổng thanh toán
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Tạm tính</span>
                  <span>{formatPrice(order.order_items.reduce((s: number, i: OrderItem) => s + i.price * i.quantity, 0))}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
                  <span>Tổng cộng</span>
                  <span className="text-[#A85448]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
