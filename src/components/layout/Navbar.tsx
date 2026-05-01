'use client'

import { type FC, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useCartSidebar } from '@/store/cartSidebarStore'
import { useAdminRole } from '@/hooks/useAdminRole'

const NAV_LINKS = [
  { href: '/',         label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm'  },
  { href: '/account',  label: 'Tài khoản' },
]

const Navbar: FC = () => {
  const pathname     = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const items        = useCartStore(state => state.items)
  const cartCount    = items.reduce((sum, i) => sum + i.quantity, 0)
  const { open }     = useCartSidebar()
  const { isAdmin }  = useAdminRole()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(195,130,120,0.18)] bg-[#FAF8F5]/95 backdrop-blur-sm">
      <div className="container-shop flex h-16 items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
        >
          <span className="font-display text-[22px] font-light tracking-[7px] uppercase text-[#A85448]">
            Flower Shop
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Menu chính" className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-sans text-[10px] tracking-[3px] uppercase transition-colors',
                pathname === link.href
                  ? 'text-[#A85448]'
                  : 'text-[rgba(30,23,20,0.4)] hover:text-[#A85448]'
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-1.5 font-sans text-[10px] tracking-[3px] uppercase transition-colors hover:text-[#A85448]',
                pathname.startsWith('/admin')
                  ? 'text-[#A85448]'
                  : 'text-[rgba(30,23,20,0.4)]'
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#A85448]" aria-hidden="true" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <button
            onClick={open}
            aria-label={`Mở giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`}
            suppressHydrationWarning
            className="relative flex h-9 w-9 items-center justify-center border border-[rgba(168,84,72,0.3)] text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-[#A85448] font-sans text-[9px] font-medium text-[#FAF8F5]">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={isMenuOpen}
            suppressHydrationWarning
            className="flex h-9 w-9 items-center justify-center border border-[rgba(168,84,72,0.3)] text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav
          aria-label="Menu mobile"
          className="border-t border-[rgba(195,130,120,0.18)] bg-[#FAF8F5] px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 font-sans text-[10px] tracking-[3px] uppercase transition-colors hover:text-[#A85448]',
                    pathname === link.href
                      ? 'text-[#A85448]'
                      : 'text-[rgba(30,23,20,0.4)]'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 font-sans text-[10px] tracking-[3px] uppercase transition-colors hover:text-[#A85448]',
                    pathname.startsWith('/admin')
                      ? 'text-[#A85448]'
                      : 'text-[rgba(30,23,20,0.4)]'
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A85448]" aria-hidden="true" />
                  Quản trị Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Navbar
