'use client'

import { type FC, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import CartItem from '@/components/cart/CartItem'
import PromoInput, { type PromoResult } from '@/components/cart/PromoInput'
import ShippingCalculator, { type ShippingResult } from '@/components/cart/ShippingCalculator'

const DEFAULT_SHIPPING: ShippingResult = { name: 'Nội thành TP.HCM', fee: 30000 }

const CartPage: FC = () => {
  const items     = useCartStore(state => state.items)
  const total     = useCartStore(state => state.total)
  const clearCart = useCartStore(state => state.clearCart)

  const [shipping,  setShipping]  = useState<ShippingResult>(DEFAULT_SHIPPING)
  const [discount,  setDiscount]  = useState(0)
  const [promoCode, setPromoCode] = useState<string | null>(null)

  const subtotal   = total()
  const grandTotal = subtotal + shipping.fee - discount

  const handlePromo = (result: PromoResult | null) => {
    setDiscount(result?.discount ?? 0)
    setPromoCode(result?.code ?? null)
  }

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
          suppressHydrationWarning
          aria-label="Xóa toàn bộ giỏ hàng"
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-danger"
        >
          <Trash2 className="h-4 w-4" /> Xóa tất cả
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface">
            {items.map(item => (
              <li key={item.product.id} className="p-4 sm:p-6">
                <CartItem item={item} />
              </li>
            ))}
          </ul>

          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5 rounded-none border border-[rgba(195,130,120,0.18)] bg-surface p-6">
            <h2 className="font-display text-xl font-light text-[#1E1714]">
              Tóm tắt đơn hàng
            </h2>

            {/* Khu vực giao hàng */}
            <div className="space-y-2 border-b border-[rgba(195,130,120,0.12)] pb-5">
              <p className="font-sans text-[9px] uppercase tracking-[3px] text-[rgba(30,23,20,0.35)]">
                Khu vực giao hàng
              </p>
              <ShippingCalculator current={shipping} onSelect={setShipping} />
            </div>

            {/* Mã giảm giá */}
            <div className="space-y-2 border-b border-[rgba(195,130,120,0.12)] pb-5">
              <p className="font-sans text-[9px] uppercase tracking-[3px] text-[rgba(30,23,20,0.35)]">
                Mã giảm giá
              </p>
              <PromoInput subtotal={subtotal} onApply={handlePromo} />
            </div>

            {/* Chi tiết giá */}
            <div className="space-y-3">
              <div className="flex justify-between font-sans text-sm">
                <span className="text-[rgba(30,23,20,0.5)]">Tạm tính</span>
                <span className="text-[#1E1714]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-sans text-sm">
                <span className="text-[rgba(30,23,20,0.5)]">
                  Phí giao hàng ({shipping.name})
                </span>
                <span className="text-[#1E1714]">
                  {shipping.fee === 0 ? 'Miễn phí' : formatPrice(shipping.fee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-green-600">
                    Giảm giá {promoCode && `(${promoCode})`}
                  </span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}
            </div>

            {/* Tổng */}
            <div className="flex justify-between border-t border-[rgba(195,130,120,0.15)] pt-4">
              <span className="font-display text-lg text-[#1E1714]">Tổng cộng</span>
              <span className="font-display text-xl text-[#A85448]">{formatPrice(grandTotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 bg-[#A85448] py-3.5 font-sans text-[10px] uppercase tracking-[3px] text-[#FAF8F5] transition-colors hover:bg-[#8B3D33]"
            >
              Thanh toán →
            </Link>

            <p className="text-center font-sans text-[11px] text-[rgba(30,23,20,0.35)]">
              🔒 Thanh toán bảo mật · Đổi trả miễn phí trong 7 ngày
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
