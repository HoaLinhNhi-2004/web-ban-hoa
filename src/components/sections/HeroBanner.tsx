import { type FC } from 'react'
import Link from 'next/link'
import { ArrowRight, Truck, RefreshCw, Star } from 'lucide-react'

const BADGES = [
  { icon: Truck,     label: 'Giao hàng trong 2h' },
  { icon: RefreshCw, label: 'Đổi trả miễn phí' },
  { icon: Star,      label: 'Hoa tươi 100%' },
]

const HeroBanner: FC = () => {
  return (
    <section aria-label="Hero banner" className="relative overflow-hidden bg-linear-to-br from-[#FFF0F3] via-background to-[#FFF5F0]">
      <div className="container-shop py-16 md:py-24">
        <div className="flex flex-col items-center text-center">

          {/* Label */}
          <span className="badge mb-6 text-xs uppercase tracking-widest">
            🌸 Hoa tươi mỗi ngày
          </span>

          {/* Heading */}
          <h1 className="font-display text-4xl font-bold leading-tight text-text md:text-6xl lg:text-7xl">
            Gửi trao yêu thương{' '}
            <span className="text-primary">qua từng bông hoa</span>
          </h1>

          {/* Sub */}
          <p className="mt-6 max-w-xl text-base text-muted md:text-lg">
            Hoa tươi nhập khẩu cao cấp — hoa sinh nhật, hoa cưới, hoa tặng.
            Đặt hàng ngay, giao tận nơi trong 2 tiếng.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/products" className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
              Mua hoa ngay
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products?featured=true" className="btn-secondary px-8 py-3 text-base">
              Xem bộ sưu tập
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap justify-center gap-6">
            {BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-secondary/40" />
    </section>
  )
}

export default HeroBanner