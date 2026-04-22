'use client'

import { type FC, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useCartSidebar } from '@/store/cartSidebarStore'

const NAV_LINKS = [
  { href: '/',         label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm'  },
  { href: '/account',  label: 'Tài khoản' },
]

const Navbar: FC = () => {
  const pathname  = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const items     = useCartStore(state => state.items)
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const { open }  = useCartSidebar()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-sm shadow-nav">
      <div className="container-shop flex h-16 items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Flower2 className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-primary">
            Flower Shop
          </span>
        </Link>

        {/* Desktop menu */}
        <nav aria-label="Menu chính" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">

          {/* Cart button — mở CartSidebar */}
          <button
            onClick={open}
            aria-label={`Mở giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ShoppingBag className="h-5 w-5 text-text" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isMenuOpen
              ? <X className="h-5 w-5" />
              : <Menu className="h-5 w-5" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav
          aria-label="Menu mobile"
          className="border-t border-border bg-surface px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary',
                    pathname === link.href
                      ? 'bg-secondary text-primary'
                      : 'text-text'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Navbar