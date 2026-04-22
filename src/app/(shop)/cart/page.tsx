'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import CartItem from '@/components/cart/CartItem'

const SHIPPING_THRESHOLD = 500000 // miễn ship đơn trên 500k

const CartPage: FC = () => {
  const items    = useCartStore(state => state.items)
  const total    = useCartStore(state => state.total)
  const clearCart = useCartStore(state => state.clearCart)

  const subtotal       = total()
  const shippingFee    = subtotal >= SHIPPING_THRESHOLD ? 0 : 30000
  const grandTotal     = subtotal + shippingFee
  const remainForFree  = SHIPPING_THRESHOLD - subtotal

  if (items.length === 0) {
    return (
      <div className="container-shop flex flex-col items-center justify-center gap-6 py-32 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Giỏ hàng trống
          </h1>
          <p className="mt-2 text-muted">Bạn chưa thêm sản phẩm nào vào giỏ.</p>
        </div>
        <Link href="/products" className="btn-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  return (
    <div className="container-shop py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-text">
          Giỏ hàng
          <span className="ml-3 text-lg font-normal text-muted">
            ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
          </span>
        </h1>
        <button
          onClick={clearCart}
          aria-label="Xóa toàn bộ giỏ hàng"
          className="flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Xóa tất cả
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          {/* Miễn phí ship */}
          {remainForFree > 0 && (
            <div className="mb-6 rounded-xl border border-secondary bg-[#FFF5F7] px-4 py-3">
              <p className="text-sm text-text">
                Mua thêm{' '}
                <strong className="text-primary">{formatPrice(remainForFree)}</strong>
                {' '}để được{' '}
                <strong className="text-primary">miễn phí giao hàng</strong> 🎉
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {remainForFree <= 0 && (
            <div className="mb-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-sm font-medium text-success">
                ✅ Bạn được miễn phí giao hàng!
              </p>
            </div>
          )}

          {/* Cart items */}
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface">
            {items.map(item => (
              <li key={item.product.id} className="p-4 sm:p-6">
                <CartItem item={item} />
              </li>
            ))}
          </ul>

          {/* Continue shopping */}
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-text">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 border-b border-border pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tạm tính</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Phí giao hàng</span>
                {shippingFee === 0 ? (
                  <span className="font-medium text-success">Miễn phí</span>
                ) : (
                  <span className="font-medium">{formatPrice(shippingFee)}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-accent">{formatPrice(grandTotal)}</span>
            </div>

            {/* Promo code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Mã giảm giá"
                aria-label="Nhập mã giảm giá"
                className="input-field flex-1"
              />
              <button className="btn-secondary px-4 text-sm">
                Áp dụng
              </button>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout"
              className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-base"
            >
              Thanh toán <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Trust */}
            <p className="text-center text-xs text-muted">
              🔒 Thanh toán bảo mật · Đổi trả miễn phí trong 7 ngày
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage