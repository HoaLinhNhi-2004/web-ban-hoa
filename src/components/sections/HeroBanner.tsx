import { type FC } from 'react'
import Link from 'next/link'

const POLICIES = [
  'Giao hàng trong 2 tiếng',
  'Hoa tươi 100% nhập khẩu',
  'Đổi trả trong 24 giờ',
  'Thanh toán an toàn',
]

const HeroBanner: FC = () => {
  return (
    <section aria-label="Hero banner">

      {/* ── 2-column hero ── */}
      <div className="grid min-h-[540px] md:grid-cols-[1.1fr_0.9fr]">

        {/* Left — copy */}
        <div className="flex flex-col justify-center bg-[#FAF8F5] px-8 py-16 md:px-12 lg:px-16">

          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="block h-px w-7 bg-[#C4796A]" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-[5px] uppercase text-[#C4796A]">
              Bộ sưu tập 2025
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-[46px] font-light leading-[1.1] text-[#1E1714] md:text-[54px] lg:text-[62px]">
            Gửi trao yêu thương{' '}
            <em className="italic text-[#A85448]">qua từng bông hoa</em>
          </h1>

          {/* Sub */}
          <p className="mt-6 max-w-[380px] font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.45)]">
            Hoa tươi nhập khẩu cao cấp — hoa sinh nhật, hoa cưới, hoa tặng.
            Đặt hàng ngay, giao tận nơi trong 2 tiếng.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-[#A85448] px-8 py-3 font-sans text-[10px] font-medium tracking-[3px] uppercase text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
            >
              Mua hoa ngay
            </Link>
            <Link
              href="/products?featured=true"
              className="inline-flex items-center justify-center border border-[rgba(168,84,72,0.3)] px-6 py-3 font-sans text-[10px] font-medium tracking-[3px] uppercase text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
            >
              Xem bộ sưu tập
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-6 border-t border-[rgba(195,130,120,0.18)] pt-8">
            {['Giao hàng 2h', 'Hoa tươi 100%', 'Đổi trả miễn phí'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(168,84,72,0.4)]" aria-hidden="true" />
                <span className="font-sans text-[9px] font-light tracking-[2.5px] uppercase text-[rgba(30,23,20,0.35)]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — decorative composition */}
        <div
          className="relative hidden overflow-hidden bg-[#F5EDE8] md:flex md:items-center md:justify-center"
          aria-hidden="true"
        >
          {/* Concentric rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="absolute h-[400px] w-[400px] rounded-full border border-[rgba(168,84,72,0.07)]" />
            <div className="absolute h-[280px] w-[280px] rounded-full border border-[rgba(168,84,72,0.10)]" />
            <div className="absolute h-[160px] w-[160px] rounded-full bg-[rgba(168,84,72,0.06)]" />
            <div className="absolute h-[88px]  w-[88px]  rounded-full bg-[rgba(168,84,72,0.10)]" />
          </div>

          {/* Accent dots */}
          <div className="absolute right-14 top-14 h-3 w-3 rounded-full bg-[rgba(168,84,72,0.28)]" />
          <div className="absolute bottom-20 left-10 h-2 w-2 rounded-full bg-[rgba(168,84,72,0.22)]" />
          <div className="absolute left-6 top-1/3 h-5 w-5 rounded-full border border-[rgba(168,84,72,0.18)]" />
          <div className="absolute bottom-16 right-1/3 h-3 w-3 rounded-full border border-[rgba(168,84,72,0.20)]" />

          {/* Offset fill circle */}
          <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[rgba(168,84,72,0.05)]" />

          {/* Central kanji watermark */}
          <div className="relative z-10 select-none text-center">
            <p className="font-display text-[120px] font-light leading-none text-[rgba(168,84,72,0.11)]">
              花
            </p>
            <p className="mt-3 font-sans text-[8px] tracking-[5px] uppercase text-[rgba(168,84,72,0.28)]">
              Hoa Tươi Cao Cấp
            </p>
          </div>

          {/* Badge — top left */}
          <div className="absolute left-6 top-6 border border-[rgba(168,84,72,0.22)] bg-[#FAF8F5] px-4 py-3">
            <p className="font-display text-[26px] font-light leading-none text-[#A85448]">500+</p>
            <p className="mt-1 font-sans text-[8px] tracking-[3px] uppercase text-[rgba(30,23,20,0.35)]">
              Mẫu hoa đẹp
            </p>
          </div>

          {/* Badge — bottom right */}
          <div className="absolute bottom-6 right-6 bg-[#A85448] px-4 py-2">
            <p className="font-sans text-[9px] tracking-[3px] uppercase text-[#FAF8F5]">
              Thiết kế độc quyền
            </p>
          </div>
        </div>
      </div>

      {/* ── Policy strip ── */}
      <div className="grid grid-cols-2 border-y border-[rgba(195,130,120,0.15)] bg-[#F7F1EC] md:grid-cols-4">
        {POLICIES.map(item => (
          <div
            key={item}
            className="flex items-center gap-3 border-r border-[rgba(195,130,120,0.15)] px-5 py-3.5 even:border-r-0 md:even:border-r md:last:border-r-0"
          >
            <span className="block h-px w-4 flex-shrink-0 bg-[rgba(168,84,72,0.4)]" aria-hidden="true" />
            <span className="font-sans text-[9px] tracking-[3px] uppercase text-[rgba(30,23,20,0.38)]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroBanner
