'use client'

import { type FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/constants'

const CAT_META: Record<string, { emoji: string; bg: string }> = {
  'Hoa hồng' : { emoji: '🌹', bg: '#FBF0ED' },
  'Hoa cưới' : { emoji: '💐', bg: '#F5EFEA' },
  'Hoa bó'   : { emoji: '🌷', bg: '#FAF0EC' },
  'Hoa giỏ'  : { emoji: '🧺', bg: '#F7F3E8' },
  'Hoa ly'   : { emoji: '🌸', bg: '#F5EEF2' },
  'Hoa tulip': { emoji: '🌺', bg: '#EEF2F8' },
  'Hoa cúc'  : { emoji: '🌼', bg: '#F7F4E8' },
}

const CategoryPills: FC = () => {
  const router = useRouter()

  return (
    <section aria-label="Danh mục sản phẩm" className="container-shop py-10">

      {/* Heading */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="block h-px w-5 bg-[#C4796A]" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-[4px] uppercase text-[#C4796A]">
              Danh mục
            </span>
          </div>
          <h2 className="font-display text-[26px] font-light text-[#1E1714] md:text-[30px]">
            Khám phá theo loài hoa
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-1 font-sans text-[10px] tracking-[2px] uppercase text-[rgba(168,84,72,0.5)] transition-colors hover:text-[#A85448] sm:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-8 md:overflow-visible md:pb-0">

        {/* "Tất cả" card */}
        <button
          onClick={() => router.push('/products')}
          suppressHydrationWarning
          className="group flex w-[84px] flex-shrink-0 flex-col items-center gap-2.5 rounded-xl border border-[rgba(195,130,120,0.2)] bg-[#F5EDE8] px-3 py-4 transition-all hover:border-[rgba(168,84,72,0.35)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448] md:w-auto"
        >
          <span className="text-2xl leading-none" aria-hidden="true">✿</span>
          <span className="font-sans text-[9px] tracking-[2px] uppercase text-[rgba(30,23,20,0.55)] transition-colors group-hover:text-[#A85448]">
            Tất cả
          </span>
        </button>

        {CATEGORIES.map(cat => {
          const meta = CAT_META[cat] ?? { emoji: '🌸', bg: '#F5EDE8' }
          return (
            <button
              key={cat}
              onClick={() => router.push(`/products?category=${encodeURIComponent(cat)}`)}
              suppressHydrationWarning
              style={{ background: meta.bg }}
              className="group flex w-[84px] flex-shrink-0 flex-col items-center gap-2.5 rounded-xl border border-[rgba(195,130,120,0.18)] px-3 py-4 transition-all hover:border-[rgba(168,84,72,0.3)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448] md:w-auto"
            >
              <span className="text-2xl leading-none" aria-hidden="true">{meta.emoji}</span>
              <span className="text-center font-sans text-[9px] tracking-[1.5px] uppercase text-[rgba(30,23,20,0.55)] transition-colors group-hover:text-[#A85448]">
                {cat}
              </span>
            </button>
          )
        })}
      </div>

    </section>
  )
}

export default CategoryPills
