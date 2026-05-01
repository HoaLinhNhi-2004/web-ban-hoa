'use client'

import { type FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Truck, CreditCard, MapPin, Phone, User, FileText } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, PROMO_CODES } from '@/lib/constants'

const schema = z.object({
  full_name: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone    : z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  address  : z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  note     : z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface CheckoutFormProps {
  clientSecret: string | null
}

const CheckoutForm: FC<CheckoutFormProps> = ({ clientSecret }) => {
  const router   = useRouter()
  const stripe   = useStripe()
  const elements = useElements()

  const items     = useCartStore(state => state.items)
  const total     = useCartStore(state => state.total)
  const clearCart = useCartStore(state => state.clearCart)

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod')
  const [promoCode,     setPromoCode]     = useState('')
  const [discount,      setDiscount]      = useState(0)
  const [promoError,    setPromoError]    = useState('')
  const [isLoading,     setIsLoading]     = useState(false)
  const [error,         setError]         = useState('')

  const subtotal     = total()
  const shippingFee  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const discountAmt  = Math.round(subtotal * discount)
  const grandTotal   = subtotal + shippingFee - discountAmt

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const applyPromo = () => {
    const rate = PROMO_CODES[promoCode.toUpperCase()]
    if (rate) {
      setDiscount(rate)
      setPromoError('')
    } else {
      setPromoError('Mã không hợp lệ hoặc đã hết hạn')
      setDiscount(0)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      let stripe_payment_id = null

      // Thanh toán Stripe
      if (paymentMethod === 'stripe') {
        if (!stripe || !elements || !clientSecret) {
          setError('Stripe chưa sẵn sàng, vui lòng thử lại')
          setIsLoading(false)
          return
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: `${window.location.origin}/checkout/success` },
          redirect: 'if_required',
        })

        if (stripeError) {
          setError(stripeError.message ?? 'Thanh toán thất bại')
          setIsLoading(false)
          return
        }

        stripe_payment_id = paymentIntent?.id ?? null
      }

      // Tạo đơn hàng
      const res = await fetch('/api/orders', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          items,
          shipping_address: data.address,
          phone           : data.phone,
          note            : data.note,
          total           : grandTotal,
          payment_method  : paymentMethod,
          stripe_payment_id,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Đặt hàng thất bại')
        setIsLoading(false)
        return
      }

      clearCart()
      router.push(`/checkout/success?orderId=${json.data.id}`)

    } catch {
      setError('Đã có lỗi xảy ra, vui lòng thử lại')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-8 lg:grid-cols-3">

        {/* Left — thông tin giao hàng */}
        <div className="space-y-6 lg:col-span-2">

          {/* Thông tin người nhận */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#2D2D2D] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Thông tin giao hàng
            </h2>

            {/* Họ tên */}
            <div className="space-y-1.5">
              <label htmlFor="full_name" className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted" /> Họ và tên
              </label>
              <input
                id="full_name"
                placeholder="Nguyễn Văn A"
                {...register('full_name')}
                className={cn('input-field', errors.full_name && 'border-danger focus:border-danger focus:ring-danger/20')}
              />
              {errors.full_name && (
                <p role="alert" className="text-xs text-danger">{errors.full_name.message}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted" /> Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="0901234567"
                {...register('phone')}
                className={cn('input-field', errors.phone && 'border-danger focus:border-danger focus:ring-danger/20')}
              />
              {errors.phone && (
                <p role="alert" className="text-xs text-danger">{errors.phone.message}</p>
              )}
            </div>

            {/* Địa chỉ */}
            <div className="space-y-1.5">
              <label htmlFor="address" className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted" /> Địa chỉ nhận hàng
              </label>
              <input
                id="address"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                {...register('address')}
                className={cn('input-field', errors.address && 'border-danger focus:border-danger focus:ring-danger/20')}
              />
              {errors.address && (
                <p role="alert" className="text-xs text-danger">{errors.address.message}</p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="space-y-1.5">
              <label htmlFor="note" className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted" />
                Ghi chú <span className="text-muted font-normal">(tuỳ chọn)</span>
              </label>
              <textarea
                id="note"
                rows={3}
                placeholder="Ghi chú cho người giao hàng..."
                {...register('note')}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#2D2D2D] flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Phương thức thanh toán
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors',
                  paymentMethod === 'cod'
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:border-secondary'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                  paymentMethod === 'cod' ? 'bg-primary text-white' : 'bg-border text-muted'
                )}>
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2D2D2D]">Thanh toán khi nhận hàng</p>
                  <p className="text-xs text-muted">Trả tiền mặt cho shipper</p>
                </div>
              </button>

              {/* Stripe */}
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors',
                  paymentMethod === 'stripe'
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:border-secondary'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                  paymentMethod === 'stripe' ? 'bg-primary text-white' : 'bg-border text-muted'
                )}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2D2D2D]">Thẻ tín dụng / Stripe</p>
                  <p className="text-xs text-muted">Visa, Mastercard, JCB</p>
                </div>
              </button>
            </div>

            {/* Stripe payment form */}
            {paymentMethod === 'stripe' && clientSecret && (
              <div className="rounded-xl border border-border p-4 mt-2">
                <PaymentElement />
              </div>
            )}
          </div>
        </div>

        {/* Right — order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#2D2D2D]">
              Đơn hàng của bạn
            </h2>

            {/* Items */}
            <ul className="divide-y divide-border max-h-60 overflow-y-auto">
              {items.map(item => (
                <li key={item.product.id} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#FFF0F3]">
                    {item.product.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-[#2D2D2D]">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-accent flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Promo code */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError('') }}
                  placeholder="Mã giảm giá"
                  aria-label="Nhập mã giảm giá"
                  className="input-field flex-1 text-sm"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="btn-secondary px-3 text-sm"
                >
                  Áp dụng
                </button>
              </div>
              {promoError && <p className="text-xs text-danger">{promoError}</p>}
              {discount > 0 && (
                <p className="text-xs text-success font-medium">
                  ✅ Giảm {discount * 100}% đã được áp dụng!
                </p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Phí giao hàng</span>
                {shippingFee === 0
                  ? <span className="text-success font-medium">Miễn phí</span>
                  : <span>{formatPrice(shippingFee)}</span>
                }
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Giảm giá</span>
                  <span className="text-success font-medium">-{formatPrice(discountAmt)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between border-t border-border pt-4 font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-accent">{formatPrice(grandTotal)}</span>
            </div>

            {/* Error */}
            {error && (
              <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? 'Đang xử lý...'
                : paymentMethod === 'cod'
                  ? '🛵 Đặt hàng (COD)'
                  : '💳 Thanh toán ngay'
              }
            </button>

            <p className="text-center text-xs text-muted">
              🔒 Thanh toán bảo mật · Đổi trả trong 24h
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CheckoutForm