import { type FC } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase-server'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

const FeaturedProducts: FC = async () => {
  const supabase = await createSupabaseServer()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (!products || products.length === 0) return null

  return (
    <section aria-label="Sản phẩm nổi bật" className="py-16 bg-[#FFF5F7]">
      <div className="container-shop">
        {/* Heading */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-2 text-muted">Những bó hoa được yêu thích nhất</p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(products as Product[]).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile — xem tất cả */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-secondary inline-flex items-center gap-2">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts