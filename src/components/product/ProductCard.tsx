'use client'

import { type FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, ImageOff, Sparkles } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  const addItem      = useCartStore(state => state.addItem)
  const isOutOfStock = product.stock === 0

  return (
    <article
      className={cn(
        'group flex flex-col border border-[rgba(195,130,120,0.16)] bg-[#FFFDF9] transition-colors hover:border-[rgba(168,84,72,0.3)]',
        className
      )}
      aria-label={product.name}
    >
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[#F5EDE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A85448]"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={`${product.name} - ${product.category}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-10 w-10 text-[rgba(168,84,72,0.2)]" />
          </div>
        )}

        {/* Badge — Hết hàng (góc trái) */}
        {isOutOfStock && (
          <span className="absolute left-0 top-4 bg-[rgba(30,23,20,0.62)] px-3 py-1 font-sans text-[9px] tracking-[2px] uppercase text-[#FAF8F5] backdrop-blur-sm">
            Hết hàng
          </span>
        )}

        {/* Badge — Nổi bật (góc phải) */}
        {product.is_featured && !isOutOfStock && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#A85448] px-2.5 py-1 font-sans text-[9px] tracking-[1.5px] uppercase text-white shadow-md">
            <Sparkles className="h-2.5 w-2.5" />
            Nổi bật
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <span className="font-sans text-[9px] tracking-[3px] uppercase text-[rgba(168,84,72,0.5)]">
          {product.category}
        </span>

        <Link
          href={`/products/${product.id}`}
          className="mt-2 line-clamp-2 font-display text-[19px] font-light leading-snug text-[#1E1714] transition-colors hover:text-[#A85448] focus-visible:outline-none focus-visible:underline"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(195,130,120,0.15)] pt-3 mt-3">
          <span className="font-display text-[18px] font-light text-[#A85448]">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={() => addItem(product)}
            disabled={isOutOfStock}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            suppressHydrationWarning
            className={cn(
              'flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]',
              isOutOfStock
                ? 'cursor-not-allowed border-[rgba(30,23,20,0.1)] text-[rgba(30,23,20,0.2)]'
                : 'border-[rgba(168,84,72,0.28)] text-[#A85448] hover:bg-[#A85448] hover:text-[#FAF8F5] hover:border-[#A85448]'
            )}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
