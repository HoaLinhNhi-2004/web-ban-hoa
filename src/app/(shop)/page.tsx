import { Suspense } from 'react'
import type { Metadata } from 'next'
import BannerSlider        from '@/components/sections/BannerSlider'
import TrustBar            from '@/components/sections/TrustBar'
import CategoryPills       from '@/components/sections/CategoryPills'
import FeaturedProducts    from '@/components/sections/FeaturedProducts'
import PromoBanner         from '@/components/sections/PromoBanner'
import NewsletterSection   from '@/components/sections/NewsletterSection'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'

export const metadata: Metadata = {
  title      : 'Flower Shop — Hoa tươi đẹp nhất mỗi ngày',
  description: 'Mua hoa tươi online với đa dạng mẫu hoa đẹp — hoa sinh nhật, hoa cưới, hoa tặng.',
  openGraph  : {
    title      : 'Flower Shop — Hoa tươi đẹp nhất mỗi ngày',
    description: 'Mua hoa tươi online với đa dạng mẫu hoa đẹp.',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero slider */}
      <Suspense fallback={<BannerSkeleton />}>
        <BannerSlider />
      </Suspense>

      {/* Trust signals */}
      <TrustBar />

      {/* Category visual cards */}
      <Suspense fallback={null}>
        <CategoryPills />
      </Suspense>

      {/* Featured products */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* Promo banners */}
      <PromoBanner />

      {/* Newsletter signup */}
      <NewsletterSection />
    </>
  )
}

function BannerSkeleton() {
  return (
    <div className="min-h-[340px] animate-pulse bg-[rgba(168,84,72,0.06)] md:min-h-[420px]" />
  )
}

function ProductGridSkeleton() {
  return (
    <section className="container-shop py-10">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-[rgba(195,130,120,0.15)]" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
