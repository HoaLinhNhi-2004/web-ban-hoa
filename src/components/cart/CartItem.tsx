'use client'

import { type FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ImageOff } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  compact?: boolean
}

const CartItem: FC<CartItemProps> = ({ item, compact = false }) => {
  const { updateQuantity, removeItem } = useCartStore()
  const { product, quantity } = item

  return (
    <div className={cn('flex gap-3', compact ? 'items-center' : 'items-start')}>
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className={cn(
          'relative shrink-0 overflow-hidden rounded-xl bg-[#FFF0F3]',
          compact ? 'h-16 w-16' : 'h-24 w-24'
        )}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={`${product.name} - ${product.category}`}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-6 w-6 text-muted/40" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-sm font-semibold text-text hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <span className="text-xs text-muted">{product.category}</span>

        <div className="mt-1 flex items-center justify-between gap-2">
          {/* Quantity controls */}
          <div className="flex items-center rounded-full border border-border">
            <button
              onClick={() =>
                quantity <= 1
                  ? removeItem(product.id)
                  : updateQuantity(product.id, quantity - 1)
              }
              aria-label="Giảm số lượng"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center text-sm font-medium tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              aria-label="Tăng số lượng"
              disabled={quantity >= product.stock}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price + Delete */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-accent text-sm">
              {formatPrice(product.price * quantity)}
            </span>
            <button
              onClick={() => removeItem(product.id)}
              aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-danger transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem