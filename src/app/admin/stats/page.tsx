import { type FC } from 'react'
import { createSupabaseServer } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_LABEL } from '@/lib/constants'
import type { OrderStatus } from '@/types'
import StatCard from '@/components/admin/StatCard'
import { TrendingUp, ShoppingBag, Package, Users } from 'lucide-react'

const AdminStatsPage: FC = async () => {
  const supabase = await createSupabaseServer()

  const [
    { data: orders   },
    { data: products },
    { count: users   },
  ] = await Promise.all([
    supabase.from('orders').select('total, status, created_at'),
    supabase.from('products').select('name, stock, category'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  // Tính toán
  const revenue = orders
    ?.filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0) ?? 0

  const statusCount = orders?.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {}) ?? {}

  const lowStock = products?.filter(p => p.stock <= 5) ?? []

  const categoryRevenue = products?.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {}) ?? {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2D2D2D]">Thống kê</h1>
        <p className="mt-1 text-sm text-muted">Tổng quan hiệu suất kinh doanh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Tổng doanh thu" value={formatPrice(revenue)}
          sub="Trừ đơn đã hủy" icon={TrendingUp} color="primary" />
        <StatCard title="Tổng đơn hàng" value={String(orders?.length ?? 0)}
          sub="Tất cả trạng thái" icon={ShoppingBag} color="warning" />
        <StatCard title="Sản phẩm" value={String(products?.length ?? 0)}
          sub={`${lowStock.length} sắp hết hàng`} icon={Package} color="blue" />
        <StatCard title="Khách hàng" value={String(users ?? 0)}
          sub="Tài khoản đã đăng ký" icon={Users} color="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Đơn hàng theo trạng thái */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-semibold text-[#2D2D2D] mb-4">Đơn hàng theo trạng thái</h2>
          <ul className="space-y-3">
            {Object.entries(statusCount).map(([status, count]) => {
              const percent = Math.round((count / (orders?.length || 1)) * 100)
              return (
                <li key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted">
                      {ORDER_STATUS_LABEL[status as OrderStatus]}
                    </span>
                    <span className="text-sm font-semibold text-[#2D2D2D]">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Sản phẩm sắp hết hàng */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-semibold text-[#2D2D2D] mb-4">
            Sản phẩm sắp hết hàng
            {lowStock.length > 0 && (
              <span className="ml-2 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                {lowStock.length}
              </span>
            )}
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">
              ✅ Tất cả sản phẩm còn đủ hàng
            </p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((p, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#2D2D2D]">{p.name}</p>
                    <p className="text-xs text-muted">{p.category}</p>
                  </div>
                  <span className={`text-sm font-bold ${
                    p.stock === 0 ? 'text-danger' : 'text-warning'
                  }`}>
                    {p.stock === 0 ? 'Hết hàng' : `Còn ${p.stock}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sản phẩm theo danh mục */}
        <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-2">
          <h2 className="font-semibold text-[#2D2D2D] mb-4">Sản phẩm theo danh mục</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(categoryRevenue).map(([cat, count]) => (
              <div key={cat} className="rounded-xl bg-secondary/50 p-3 text-center">
                <p className="font-bold text-lg text-primary">{count}</p>
                <p className="text-xs text-muted mt-0.5">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStatsPage