import { type FC } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { label: 'Hoa Hồng',  emoji: '🌹', href: '/products?category=Hoa hồng',  bg: 'bg-[#FFF0F3]', count: '12 mẫu' },
  { label: 'Hoa Cưới',  emoji: '💐', href: '/products?category=Hoa cưới',  bg: 'bg-[#FFF5F0]', count: '8 mẫu'  },
  { label: 'Hoa Bó',    emoji: '🌷', href: '/products?category=Hoa bó',    bg: 'bg-[#F0FFF4]', count: '15 mẫu' },
  { label: 'Hoa Giỏ',   emoji: '🧺', href: '/products?category=Hoa giỏ',   bg: 'bg-[#FFFBF0]', count: '6 mẫu'  },
  { label: 'Hoa Ly',    emoji: '🌸', href: '/products?category=Hoa ly',    bg: 'bg-[#F5F0FF]', count: '9 mẫu'  },
  { label: 'Hoa Tulip', emoji: '🌺', href: '/products?category=Hoa tulip', bg: 'bg-[#F0F8FF]', count: '7 mẫu'  },
]

const CategorySection: FC = () => {
  return (
    <section aria-label="Danh mục sản phẩm" className="py-16">
      <div className="container-shop">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
            Danh mục hoa
          </h2>
          <p className="mt-3 text-muted">Tìm loại hoa phù hợp với dịp của bạn</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`group flex flex-col items-center rounded-2xl ${cat.bg} p-6 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
            >
              <span className="text-4xl" role="img" aria-label={cat.label}>
                {cat.emoji}
              </span>
              <span className="mt-3 text-sm font-semibold text-text group-hover:text-primary transition-colors">
                {cat.label}
              </span>
              <span className="mt-1 text-xs text-muted">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection