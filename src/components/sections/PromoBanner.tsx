import { type FC } from 'react'
import Link from 'next/link'
import { Tag } from 'lucide-react'

const PromoBanner: FC = () => {
  return (
    <section aria-label="Banner khuyến mãi" className="py-16">
      <div className="container-shop">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary to-accent px-8 py-12 text-white md:px-16">

          {/* Content */}
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-widest opacity-90">
                  Ưu đãi đặc biệt
                </span>
              </div>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">
                Giảm 15% đơn hàng đầu tiên
              </h2>
              <p className="mt-2 text-white/80">
                Dùng mã <strong className="text-white">FLOWER15</strong> khi thanh toán.
                Áp dụng cho tất cả sản phẩm.
              </p>
            </div>

            <Link
              href="/products"
              className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Mua ngay →
            </Link>
          </div>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 right-32 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute bottom-4 left-1/2 h-16 w-16 rounded-full bg-white/5" />
        </div>
      </div>
    </section>
  )
}

export default PromoBanner