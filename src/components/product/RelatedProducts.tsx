import { type FC } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase-server'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface RelatedProductsProps {
  category  : string
  excludeId : string
}

const RelatedProducts: FC<RelatedProductsProps> = async ({ category, excludeId }) => {
  const supabase = await createSupabaseServer()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .gt('stock', 0)
    .limit(4)

  if (!products || products.length === 0) return null

  return (
    <section aria-label="Sản phẩm liên quan" className="mt-16">
      {/* Heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2D2D2D] md:text-3xl">
            Sản phẩm liên quan
          </h2>
          <p className="mt-1 text-sm text-muted">
            Các sản phẩm cùng danh mục {category}
          </p>
        </div>
        <Link
          href={`/products?category=${category}`}
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          Xem thêm <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(products as Product[]).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default RelatedProducts