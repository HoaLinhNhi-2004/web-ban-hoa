'use client'

import { type FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ChevronRight, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/constants'
import AccountSidebar from '@/components/account/AccountSidebar'
import type { OrderWithItems, OrderStatus } from '@/types'

const OrdersPage: FC = () => {
  const [orders,    setOrders]    = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setOrders((data ?? []) as OrderWithItems[])
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="container-shop py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />

        <main className="flex-1 min-w-0">
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <h1 className="font-display text-2xl font-bold text-[#2D2D2D] mb-6">
              Lịch sử đơn hàng
            </h1>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-xl bg-border" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D2D2D]">Chưa có đơn hàng nào</p>
                  <p className="mt-1 text-sm text-muted">Hãy đặt hoa ngay để thấy đơn hàng tại đây!</p>
                </div>
                <Link href="/products" className="btn-primary mt-2">
                  Mua hoa ngay
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {orders.map(order => (
                  <li
                    key={order.id}
                    className="rounded-xl border border-border p-4 md:p-5 hover:border-secondary transition-colors"
                  >
                    {/* Order header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm font-semibold text-[#2D2D2D]">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLOR[order.status as OrderStatus]}`}>
                            {ORDER_STATUS_LABEL[order.status as OrderStatus]}
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          {formatDateTime(order.created_at)}
                        </p>
                      </div>
                      <span className="font-bold text-accent">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    {/* Order items */}
                    <div className="mt-4 space-y-2">
                      {order.order_items.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          {/* Ảnh */}
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#FFF0F3]">
                            {item.product_image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm text-[#2D2D2D]">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-muted">
                              x{item.quantity} · {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Còn nhiều hơn */}
                      {order.order_items.length > 3 && (
                        <p className="text-xs text-muted pl-13">
                          +{order.order_items.length - 3} sản phẩm khác
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <p className="text-xs text-muted">
                        Giao đến: <span className="text-[#2D2D2D]">{order.shipping_address}</span>
                      </p>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Chi tiết <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default OrdersPage