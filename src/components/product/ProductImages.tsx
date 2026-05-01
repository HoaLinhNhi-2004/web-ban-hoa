'use client'

import { type FC, useState } from 'react'
import Image from 'next/image'
import { ImageOff, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductImagesProps {
  product: Product
}

const ProductImages: FC<ProductImagesProps> = ({ product }) => {
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className={cn(
          'group relative aspect-square overflow-hidden rounded-2xl bg-[#FFF0F3] cursor-zoom-in',
        )}
        onClick={() => setIsZoomed(true)}
      >
        {product.image_url ? (
          <>
            <Image
              src={product.image_url}
              alt={`${product.name} - ${product.category}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[#2D2D2D] opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5" />
              Phóng to
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-16 w-16 text-muted/40" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.stock === 0 && (
            <span className="rounded-full bg-muted/80 px-3 py-1 text-xs font-medium text-white">
              Hết hàng
            </span>
          )}
          {product.is_featured && product.stock > 0 && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
              Nổi bật
            </span>
          )}
        </div>
      </div>

      {/* Zoom modal */}
      {isZoomed && product.image_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to"
        >
          <div className="relative h-full max-h-[90vh] w-full max-w-3xl">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            onClick={() => setIsZoomed(false)}
            aria-label="Đóng ảnh phóng to"
            suppressHydrationWarning
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductImages