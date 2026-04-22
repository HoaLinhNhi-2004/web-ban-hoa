'use client'

import { type FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ImageOff } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  const addItem = useCartStore(state => state.addItem)
  const isOutOfStock = product.stock === 0

  return (
    <article
      className={cn('card group flex flex-col overflow-hidden', className)}
      aria-label={product.name}
    >
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        tabIndex={0}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={`${product.name} - ${product.category}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-10 w-10 text-muted/40" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isOutOfStock && (
            <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-white">
              Hết hàng
            </span>
          )}
          {product.is_featured && !isOutOfStock && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
              Nổi bật
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <span className="text-xs text-muted">{product.category}</span>
        <Link
          href={`/products/${product.id}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-text hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-bold text-accent">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={() => addItem(product)}
            disabled={isOutOfStock}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isOutOfStock
                ? 'cursor-not-allowed bg-muted/20 text-muted'
                : 'bg-primary text-white hover:bg-accent'
            )}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard