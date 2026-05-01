import { type FC } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const PromoBanner: FC = () => (
  <section aria-label="Ưu đãi" className="container-shop pb-14">
    <div className="grid gap-4 md:grid-cols-2">

      {/* Card 1 — Mã giảm giá */}
      <div className="group relative overflow-hidden border border-[rgba(168,84,72,0.14)] bg-gradient-to-br from-[#F7EEE9] to-[#EDE0D5] px-8 py-10 md:px-10 md:py-12">

        {/* Decorative oversized "15%" */}
        <span
          className="pointer-events-none absolute -right-3 -top-4 select-none font-display text-[110px] font-bold leading-none text-[rgba(168,84,72,0.06)]"
          aria-hidden="true"
        >
          15%
        </span>
        {/* Decorative circle */}
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[rgba(168,84,72,0.05)]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="block h-px w-4 bg-[#C4796A]" aria-hidden="true" />
            <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">
              Ưu đãi đặc biệt
            </span>
          </div>

          <h2 className="mb-1 font-display text-[32px] font-light leading-tight text-[#1E1714] md:text-[36px]">
            Giảm 15%
          </h2>
          <p className="font-display text-[17px] font-light italic text-[#A85448]">
            cho đơn hàng đầu tiên
          </p>

          <p className="mb-6 mt-4 font-sans text-[12px] font-light leading-relaxed text-[rgba(30,23,20,0.5)]">
            Dùng mã{' '}
            <span className="rounded border border-[rgba(168,84,72,0.28)] bg-[rgba(168,84,72,0.07)] px-2 py-0.5 font-display text-[14px] italic text-[#A85448]">
              FLOWER15
            </span>
            {' '}khi thanh toán. Áp dụng cho tất cả sản phẩm.
          </p>

          <Link
            href="/products"
            className="group/btn inline-flex items-center gap-2 bg-[#A85448] px-6 py-2.5 font-sans text-[9px] font-medium tracking-[3px] uppercase text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
          >
            Áp dụng ngay
            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Card 2 — Free shipping */}
      <div className="group relative overflow-hidden border border-[rgba(168,84,72,0.14)] bg-gradient-to-br from-[#FAF5F0] to-[#F0E8DF] px-8 py-10 md:px-10 md:py-12">

        {/* Decorative concentric rings */}
        <div
          className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 h-[220px] w-[220px] rounded-full border border-[rgba(168,84,72,0.07)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full border border-[rgba(168,84,72,0.05)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 h-[140px] w-[140px] rounded-full bg-[rgba(168,84,72,0.04)]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="block h-px w-4 bg-[#C4796A]" aria-hidden="true" />
            <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">
              Miễn phí giao hàng
            </span>
          </div>

          <h2 className="mb-1 font-display text-[32px] font-light leading-tight text-[#1E1714] md:text-[36px]">
            Free Shipping
          </h2>
          <p className="font-display text-[17px] font-light italic text-[#A85448]">
            cho đơn từ 500.000đ
          </p>

          <p className="mb-6 mt-4 font-sans text-[12px] font-light leading-relaxed text-[rgba(30,23,20,0.5)]">
            Áp dụng toàn bộ khu vực nội thành TP.HCM và Hà Nội.
            Giao hàng nhanh trong vòng 2 tiếng.
          </p>

          <Link
            href="/products"
            className="group/btn inline-flex items-center gap-2 border border-[rgba(168,84,72,0.32)] px-6 py-2.5 font-sans text-[9px] font-medium tracking-[3px] uppercase text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
          >
            Mua hoa ngay
            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

    </div>
  </section>
)

export default PromoBanner
