'use client'

import { type FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { useCartStore } from '@/store/cartStore'
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import CheckoutForm from '@/components/checkout/CheckoutForm'

const CheckoutPage: FC = () => {
  const router        = useRouter()
  const items         = useCartStore(state => state.items)
  const total         = useCartStore(state => state.total)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const subtotal    = total()
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const grandTotal  = subtotal + shippingFee

  // Redirect nếu giỏ trống
  useEffect(() => {
    if (items.length === 0) router.push('/cart')
  }, [items, router])

  // Tạo Payment Intent cho Stripe
  useEffect(() => {
    if (grandTotal <= 0) return
    fetch('/api/payment', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ amount: grandTotal }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret ?? null))
      .catch(() => setClientSecret(null))
  }, [grandTotal])

  if (items.length === 0) return null

  return (
    <div className="container-shop py-10">
      <h1 className="font-display mb-8 text-3xl font-bold text-[#2D2D2D]">
        Thanh toán
      </h1>

      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme    : 'stripe',
              variables: { colorPrimary: '#E8738A' },
            },
          }}
        >
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      ) : (
        <CheckoutForm clientSecret={null} />
      )}
    </div>
  )
}

export default CheckoutPage