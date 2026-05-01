import { type FC } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { label: 'Hoa Hồng',  emoji: '🌹', href: '/products?category=Hoa hồng',  count: '12 mẫu' },
  { label: 'Hoa Cưới',  emoji: '💐', href: '/products?category=Hoa cưới',  count: '8 mẫu'  },
  { label: 'Hoa Bó',    emoji: '🌷', href: '/products?category=Hoa bó',    count: '15 mẫu' },
  { label: 'Hoa Giỏ',   emoji: '🧺', href: '/products?category=Hoa giỏ',   count: '6 mẫu'  },
  { label: 'Hoa Ly',    emoji: '🌸', href: '/products?category=Hoa ly',    count: '9 mẫu'  },
  { label: 'Hoa Tulip', emoji: '🌺', href: '/products?category=Hoa tulip', count: '7 mẫu'  },
]

const CategorySection: FC = () => {
  return (
    <section aria-label="Danh mục sản phẩm" className="bg-[#FAF8F5] py-16">
      <div className="container-shop">

        {/* Heading */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="block h-px w-7 bg-[#C4796A]" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-[5px] uppercase text-[#C4796A]">
              Danh mục
            </span>
          </div>
          <h2 className="font-display text-[36px] font-light leading-tight text-[#1E1714]">
            Khám phá <em className="italic text-[#A85448]">bộ sưu tập</em>
          </h2>
        </div>

        {/* Grid — gap-px trick creates borders without individual card borders */}
        <div className="grid grid-cols-2 gap-px bg-[rgba(195,130,120,0.12)] sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col items-center bg-[#FFFDF9] px-4 py-8 text-center transition-colors hover:bg-[#FDF5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A85448]"
            >
              <span className="text-[26px]" role="img" aria-label={cat.label}>
                {cat.emoji}
              </span>
              <span className="mt-4 font-sans text-[9px] font-medium tracking-[3px] uppercase text-[rgba(30,23,20,0.5)] transition-colors group-hover:text-[rgba(168,84,72,0.8)]">
                {cat.label}
              </span>
              <span className="mt-1.5 font-display text-[13px] italic text-[rgba(168,84,72,0.5)]">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
