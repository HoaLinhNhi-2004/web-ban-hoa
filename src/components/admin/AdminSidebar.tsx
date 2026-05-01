'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag,
  Users, BarChart2, MessageCircle, Flower2, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/admin',          label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/admin/products', label: 'Sản phẩm',        icon: Package         },
  { href: '/admin/orders',   label: 'Đơn hàng',        icon: ShoppingBag     },
  { href: '/admin/users',    label: 'Người dùng',       icon: Users           },
  { href: '/admin/stats',    label: 'Thống kê',         icon: BarChart2       },
  { href: '/admin/chat',     label: 'Chat hỗ trợ',      icon: MessageCircle   },
]

const AdminSidebar: FC = () => {
  const pathname = usePathname()
  const router   = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <Flower2 className="h-6 w-6 text-primary" />
        <span className="font-display font-bold text-primary">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-secondary text-primary'
                  : 'text-muted hover:bg-secondary hover:text-primary'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          suppressHydrationWarning
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-red-50 hover:text-danger transition-colors"
        >
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar