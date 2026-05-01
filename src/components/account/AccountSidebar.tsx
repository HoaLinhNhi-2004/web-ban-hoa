'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, ShoppingBag, Lock, LogOut, Flower2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/account',           label: 'Thông tin cá nhân', icon: User        },
  { href: '/account/orders',    label: 'Lịch sử đơn hàng',  icon: ShoppingBag },
  { href: '/account/wishlist',  label: 'Yêu thích',          icon: Heart       },
  { href: '/account/password',  label: 'Đổi mật khẩu',       icon: Lock        },
]

const AccountSidebar: FC = () => {
  const pathname = usePathname()
  const router   = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      {/* Logo nhỏ */}
      <div className="mb-6 flex items-center gap-2 px-3">
        <Flower2 className="h-5 w-5 text-primary" />
        <span className="font-display font-bold text-primary">Tài khoản</span>
      </div>

      <nav aria-label="Menu tài khoản">
        <ul className="flex flex-row gap-1 lg:flex-col">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <li key={href} className="flex-1 lg:flex-none">
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-secondary text-primary'
                    : 'text-muted hover:bg-secondary hover:text-primary'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            </li>
          ))}

          {/* Đăng xuất */}
          <li className="flex-1 lg:flex-none lg:mt-4 lg:border-t lg:border-border lg:pt-4">
            <button
              onClick={handleSignOut}
              suppressHydrationWarning
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-danger"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:block">Đăng xuất</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default AccountSidebar