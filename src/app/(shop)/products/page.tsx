import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase-server'
import { PRODUCTS_PER_PAGE } from '@/lib/constants'
import ProductGrid    from '@/components/product/ProductGrid'
import ProductFilters from '@/components/product/ProductFilters'
import ProductToolbar from '@/components/product/ProductToolbar'
import Pagination     from '@/components/product/Pagination'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title      : 'Sản phẩm | Flower Shop',
  description: 'Khám phá bộ sưu tập hoa tươi đa dạng — hoa hồng, hoa ly, hoa tulip và nhiều hơn nữa.',
}

interface SearchParams {
  category?  : string
  q?         : string
  sort?      : string
  page?      : string
  min_price? : string
  max_price? : string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params    = await searchParams
  const supabase  = await createSupabaseServer()
  const page      = Math.max(1, Number(params.page ?? 1))
  const category  = params.category  ?? ''
  const search    = params.q         ?? ''
  const sort      = params.sort      ?? 'newest'
  const minPrice  = Number(params.min_price ?? 0) || 0
  const maxPrice  = Number(params.max_price ?? 0) || 0
  const from      = (page - 1) * PRODUCTS_PER_PAGE
  const to        = from + PRODUCTS_PER_PAGE - 1

  let query = supabase.from('products').select('*', { count: 'exact' }).gt('stock', 0)

  if (category) query = query.eq('category', category)
  if (search)   query = query.ilike('name', `%${search}%`)
  if (minPrice) query = query.gte('price', minPrice)
  if (maxPrice) query = query.lte('price', maxPrice)

  switch (sort) {
    case 'price_asc' : query = query.order('price', { ascending: true });  break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'name_asc'  : query = query.order('name',  { ascending: true });  break
    default          : query = query.order('created_at', { ascending: false })
  }

  query = query.range(from, to)

  const { data: products, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PRODUCTS_PER_PAGE)

  return (
    <div className="container-shop py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-[#1E1714] md:text-4xl">
          {category ? category : 'Tất cả sản phẩm'}
        </h1>
        {search && (
          <p className="mt-2 text-sm text-[rgba(30,23,20,0.45)]">
            Kết quả cho: <strong className="text-[#1E1714]">&quot;{search}&quot;</strong>
          </p>
        )}
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 lg:block border-r border-[rgba(195,130,120,0.12)] pr-6" aria-label="Bộ lọc sản phẩm">
          <Suspense fallback={null}>
            <ProductFilters total={count ?? 0} />
          </Suspense>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          <Suspense fallback={null}>
            <ProductToolbar total={count ?? 0} />
          </Suspense>

          <ProductGrid products={(products ?? []) as Product[]} />

          <div className="pt-4">
            <Suspense fallback={null}>
              <Pagination currentPage={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}