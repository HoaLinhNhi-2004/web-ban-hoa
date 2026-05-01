'use client'

import { type FC, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useCartSidebar } from '@/store/cartSidebarStore'
import CartItem from './CartItem'

const CartSidebar: FC = () => {
  const { isOpen, close } = useCartSidebar()
  const items = useCartStore(state => state.items)
  const total = useCartStore(state => state.total)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Đóng khi nhấn Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
      closeRef.current?.focus()
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={close}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      {/* Sidebar */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-text">
              Giỏ hàng
            </h2>
            {items.length > 0 && (
              <span className="badge text-xs">
                {items.reduce((s, i) => s + i.quantity, 0)} sản phẩm
              </span>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={close}
            aria-label="Đóng giỏ hàng"
            suppressHydrationWarning
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-text">Giỏ hàng trống</p>
                <p className="mt-1 text-sm text-muted">Hãy thêm vài bông hoa nhé!</p>
              </div>
              <button onClick={close} suppressHydrationWarning className="btn-primary mt-2">
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {items.map(item => (
                <li key={item.product.id} className="py-4">
                  <CartItem item={item} compact />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            {/* Tổng tiền */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Tạm tính</span>
              <span className="font-bold text-text">{formatPrice(total())}</span>
            </div>
            <p className="text-xs text-muted">Phí giao hàng tính ở bước thanh toán</p>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={close}
                className="btn-primary flex items-center justify-center gap-2 py-3"
              >
                Thanh toán ngay <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="btn-secondary flex items-center justify-center py-3 text-sm"
              >
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartSidebar