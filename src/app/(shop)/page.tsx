import { Suspense } from 'react'
import type { Metadata } from 'next'
import HeroBanner       from '@/components/sections/HeroBanner'
import CategorySection  from '@/components/sections/CategorySection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import PromoBanner      from '@/components/sections/PromoBanner'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'

export const metadata: Metadata = {
  title: 'Flower Shop — Hoa tươi đẹp nhất mỗi ngày',
  description: 'Mua hoa tươi online với đa dạng mẫu hoa đẹp — hoa sinh nhật, hoa cưới, hoa tặng.',
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategorySection />
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <PromoBanner />
    </>
  )
}

function ProductGridSkeleton() {
  return (
    <section className="py-16 bg-[#FFF5F7]">
      <div className="container-shop">
        <div className="mb-10 h-10 w-48 rounded-lg bg-border animate-pulse" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}