'use client'

import { type FC, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, Minus, Plus, ChevronRight,
  Truck, RefreshCw, Shield, Heart
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useCartSidebar } from '@/store/cartSidebarStore'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product } from '@/types'

const POLICIES = [
  { icon: Truck,     text: 'Giao hàng trong 2 giờ nội thành' },
  { icon: RefreshCw, text: 'Đổi trả miễn phí trong 24 giờ'   },
  { icon: Shield,    text: 'Cam kết hoa tươi 100%'            },
]

interface ProductInfoProps {
  product: Product
}

const ProductInfo: FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const addItem  = useCartStore(state => state.addItem)
  const { isWished, isLoading: isWishLoading, toggle, isLoggedIn } = useWishlist(product.id)
  const { open } = useCartSidebar()
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    open()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted">
        <Link href="/"        className="hover:text-primary transition-colors">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
      </nav>

      {/* Name + Wishlist */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-bold leading-tight text-[#2D2D2D] md:text-4xl">
          {product.name}
        </h1>
        <div className="group relative">
          <button
            onClick={toggle}
            suppressHydrationWarning
            disabled={isWishLoading}
            aria-label={isWished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            title={!isLoggedIn ? 'Đăng nhập để lưu yêu thích' : undefined}
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]',
              isWished
                ? 'border-[#A85448] bg-[#A85448] text-[#FAF8F5]'
                : 'border-[rgba(195,130,120,0.3)] bg-surface text-[rgba(30,23,20,0.4)] hover:border-[#A85448] hover:text-[#A85448]',
              isWishLoading && 'cursor-not-allowed opacity-60',
              !isLoggedIn   && 'cursor-not-allowed opacity-50'
            )}
          >
            <Heart className={cn('h-5 w-5 transition-all', isWished && 'fill-current')} />
          </button>

          {!isLoggedIn && (
            <div className="pointer-events-none absolute -bottom-8 right-0 whitespace-nowrap rounded bg-[#1E1714] px-2 py-1 font-sans text-[10px] text-[#FAF8F5] opacity-0 transition-opacity group-hover:opacity-100">
              Đăng nhập để lưu
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-accent">
          {formatPrice(product.price)}
        </span>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="text-sm text-warning font-medium">
            Chỉ còn {product.stock} sản phẩm!
          </span>
        )}
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2">
        <span className={cn(
          'h-2.5 w-2.5 rounded-full',
          isOutOfStock ? 'bg-danger' : 'bg-success'
        )} />
        <span className={cn(
          'text-sm font-medium',
          isOutOfStock ? 'text-danger' : 'text-success'
        )}>
          {isOutOfStock ? 'Hết hàng' : `Còn hàng (${product.stock} sản phẩm)`}
        </span>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm leading-relaxed text-muted border-t border-border pt-4">
          {product.description}
        </p>
      )}

      {/* Quantity + Add to cart */}
      {!isOutOfStock && (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row">
          {/* Quantity selector */}
          <div className="flex items-center rounded-full border border-border">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Giảm số lượng"
              suppressHydrationWarning
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-secondary hover:text-primary transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              aria-label="Tăng số lượng"
              suppressHydrationWarning
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-secondary hover:text-primary transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            suppressHydrationWarning
            className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 text-base"
          >
            <ShoppingBag className="h-5 w-5" />
            Thêm vào giỏ hàng
          </button>
        </div>
      )}

      {/* Policies */}
      <ul className="flex flex-col gap-3 rounded-2xl bg-[#FFF5F7] p-4">
        {POLICIES.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-[#2D2D2D]">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductInfo