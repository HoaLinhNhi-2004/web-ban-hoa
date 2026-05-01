'use client'

import { type FC, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

const CATEGORY_COLORS: Record<string, { from: string; to: string }> = {
  'Hoa hồng' : { from: '#F5EDE8', to: '#EDE0D8' },
  'Hoa cưới' : { from: '#F0EAE5', to: '#E8DDD6' },
  'Hoa bó'   : { from: '#F7EEE9', to: '#EEE3DB' },
  'Hoa giỏ'  : { from: '#F5F0E8', to: '#EDE8D8' },
  'Hoa ly'   : { from: '#F2EEF0', to: '#EAE4E8' },
  'Hoa tulip': { from: '#EEF0F5', to: '#E4E8EE' },
  'Hoa cúc'  : { from: '#F5F2E8', to: '#EDEAD8' },
}

const DEFAULT_COLOR = { from: '#F5EDE8', to: '#EDE0D8' }

const CATEGORY_EMOJI: Record<string, string> = {
  'Hoa hồng' : '🌹',
  'Hoa cưới' : '💐',
  'Hoa bó'   : '🌷',
  'Hoa giỏ'  : '🧺',
  'Hoa ly'   : '🌸',
  'Hoa tulip': '🌺',
  'Hoa cúc'  : '🌼',
}

interface BannerSliderClientProps {
  products: Product[]
}

const BannerSliderClient: FC<BannerSliderClientProps> = ({ products }) => {
  const [current,   setCurrent]   = useState(0)
  const [isPaused,  setIsPaused]  = useState(false)

  useEffect(() => {
    if (isPaused || products.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % products.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused, products.length])

  const prev = () => setCurrent(p => (p - 1 + products.length) % products.length)
  const next = () => setCurrent(p => (p + 1) % products.length)

  const product = products[current]
  const color   = CATEGORY_COLORS[product.category] ?? DEFAULT_COLOR
  const emoji   = CATEGORY_EMOJI[product.category]  ?? '🌸'

  const titleWords = product.name.split(' ')
  const titleMain  = titleWords.slice(0, 3).join(' ')
  const titleEm    = titleWords.slice(3).join(' ') || 'tươi mỗi ngày'

  return (
    <section
      aria-label="Banner sản phẩm nổi bật"
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative flex min-h-[340px] transition-all duration-700 md:min-h-[420px]"
        style={{ background: `linear-gradient(110deg, ${color.from} 0%, ${color.to} 100%)` }}
      >
        {/* Left — content */}
        <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-16 lg:px-20">

          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-3">
            <span className="block h-px w-6 bg-[#C4796A]" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-[5px] uppercase text-[#C4796A]">
              {product.category}
            </span>
          </div>

          {/* Tên sản phẩm */}
          <h2 className="font-display text-[38px] font-light leading-[1.1] text-[#1E1714] md:text-[52px]">
            {titleMain}
            <br />
            <em className="italic text-[#A85448]">{titleEm}</em>
          </h2>

          {/* Mô tả */}
          {product.description && (
            <p className="mt-5 max-w-[360px] font-sans text-[13px] font-light leading-relaxed text-[rgba(30,23,20,0.45)] line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Giá + CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center bg-[#A85448] px-8 py-3 font-sans text-[10px] font-medium tracking-[3px] uppercase text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
            >
              Xem sản phẩm
            </Link>
            <span className="font-display text-xl text-[#A85448]">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Right — ảnh hoặc emoji */}
        <div
          className="relative hidden flex-shrink-0 md:flex md:w-[42%] md:items-center md:justify-center"
          aria-hidden="true"
        >
          {/* Decorative rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="absolute h-[340px] w-[340px] rounded-full border border-[rgba(168,84,72,0.07)]" />
            <div className="absolute h-[240px] w-[240px] rounded-full border border-[rgba(168,84,72,0.10)]" />
            <div className="absolute h-[140px] w-[140px] rounded-full bg-[rgba(168,84,72,0.06)]" />
          </div>

          {product.image_url ? (
            <div className="relative z-10 h-[280px] w-[240px] overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="240px"
                className="object-cover transition-all duration-700"
                priority
              />
            </div>
          ) : (
            <span className="relative z-10 text-[96px] transition-all duration-500">
              {emoji}
            </span>
          )}
        </div>

        {/* Arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={prev}
              suppressHydrationWarning
              aria-label="Slide trước"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center border border-[rgba(168,84,72,0.25)] bg-[rgba(250,248,245,0.8)] text-[#A85448] backdrop-blur-sm transition-colors hover:bg-[rgba(168,84,72,0.1)] focus-visible:outline-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              suppressHydrationWarning
              aria-label="Slide tiếp theo"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center border border-[rgba(168,84,72,0.25)] bg-[rgba(250,248,245,0.8)] text-[#A85448] backdrop-blur-sm transition-colors hover:bg-[rgba(168,84,72,0.1)] focus-visible:outline-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots */}
        {products.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                suppressHydrationWarning
                aria-label={`Chuyển sang slide ${i + 1}`}
                className={cn(
                  'h-[3px] rounded-full transition-all duration-300',
                  i === current ? 'w-7 bg-[#A85448]' : 'w-5 bg-[rgba(168,84,72,0.25)]'
                )}
              />
            ))}
          </div>
        )}

        {/* Slide counter */}
        <div className="absolute bottom-4 right-16 font-sans text-[10px] text-[rgba(30,23,20,0.35)]">
          {current + 1} / {products.length}
        </div>
      </div>
    </section>
  )
}

export default BannerSliderClient
