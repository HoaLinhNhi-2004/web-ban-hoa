import { type FC } from 'react'
import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase-server'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

const FeaturedProducts: FC = async () => {
  let products: Product[] = []

  try {
    const supabase = await createSupabaseServer()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .gt('stock', 0)
      .order('created_at', { ascending: false })
      .limit(5)
    products = data ?? []
  } catch {
    products = []
  }

  if (products.length === 0) return null

  return (
    <section aria-label="Sản phẩm nổi bật" className="container-shop py-10">

      {/* Section heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="block h-px w-5 bg-[#C4796A]" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-[4px] uppercase text-[#C4796A]">
              Nổi bật
            </span>
          </div>
          <h2 className="font-display text-[28px] font-light text-[#1E1714] md:text-[34px]">
            Tuyển chọn tinh tế nhất
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-1 font-sans text-[10px] tracking-[2px] uppercase text-[rgba(168,84,72,0.55)] transition-colors hover:text-[#A85448] sm:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile — xem tất cả */}
      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/products"
          className="inline-flex items-center border border-[rgba(168,84,72,0.3)] px-6 py-2.5 font-sans text-[10px] tracking-[3px] uppercase text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
        >
          Xem tất cả sản phẩm →
        </Link>
      </div>
    </section>
  )
}

export default FeaturedProducts
