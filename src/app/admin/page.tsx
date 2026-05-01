import { type FC } from 'react'
import Link from 'next/link'
import {
  Package, ShoppingBag, Users,
  TrendingUp, ChevronRight, Clock,
} from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase-server'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/constants'
import StatCard from '@/components/admin/StatCard'
import type { OrderStatus } from '@/types'

const AdminPage: FC = async () => {
  const supabase = await createSupabaseServer()

  // Lấy tất cả stats song song
  const [
    { count: totalProducts },
    { count: totalOrders   },
    { count: totalUsers    },
    { data : recentOrders  },
    { data : allOrders     },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders')
      .select('*, order_items(product_name, quantity)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('orders').select('total, status'),
  ])

  const totalRevenue = allOrders
    ?.filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  const pendingCount = allOrders
    ?.filter(o => o.status === 'pending').length ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2D2D2D]">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Tổng quan hoạt động cửa hàng</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Doanh thu"
          value={formatPrice(totalRevenue)}
          sub="Tất cả đơn hàng"
          icon={TrendingUp}
          color="primary"
        />
        <StatCard
          title="Đơn hàng"
          value={String(totalOrders ?? 0)}
          sub={`${pendingCount} chờ xác nhận`}
          icon={ShoppingBag}
          color="warning"
        />
        <StatCard
          title="Sản phẩm"
          value={String(totalProducts ?? 0)}
          sub="Đang kinh doanh"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Khách hàng"
          value={String(totalUsers ?? 0)}
          sub="Tài khoản đã đăng ký"
          icon={Users}
          color="success"
        />
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-[#2D2D2D]">Đơn hàng gần đây</h2>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-6 py-3 font-medium">Mã đơn</th>
                <th className="px-6 py-3 font-medium">Thời gian</th>
                <th className="px-6 py-3 font-medium">Sản phẩm</th>
                <th className="px-6 py-3 font-medium">Tổng tiền</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders?.map(order => (
                <tr key={order.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-3 font-mono font-semibold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {formatDateTime(order.created_at)}
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {order.order_items?.length ?? 0} sản phẩm
                  </td>
                  <td className="px-6 py-3 font-semibold text-accent">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLOR[order.status as OrderStatus]}`}>
                      {ORDER_STATUS_LABEL[order.status as OrderStatus]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPage