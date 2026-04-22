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
  category?: string
  q?       : string
  sort?    : string
  page?    : string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase   = await createSupabaseServer()
  const page       = Math.max(1, Number(searchParams.page ?? 1))
  const category   = searchParams.category ?? ''
  const search     = searchParams.q ?? ''
  const sort       = searchParams.sort ?? 'newest'
  const from       = (page - 1) * PRODUCTS_PER_PAGE
  const to         = from + PRODUCTS_PER_PAGE - 1

  // Build query
  let query = supabase.from('products').select('*', { count: 'exact' })

  if (category) query = query.eq('category', category)
  if (search)   query = query.ilike('name', `%${search}%`)

  // Sort
  switch (sort) {
    case 'price_asc':  query = query.order('price', { ascending: true });  break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'name_asc':   query = query.order('name',  { ascending: true });  break
    default:           query = query.order('created_at', { ascending: false })
  }

  query = query.range(from, to)

  const { data: products, count } = await query

  const totalPages = Math.ceil((count ?? 0) / PRODUCTS_PER_PAGE)

  return (
    <div className="container-shop py-10">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#2D2D2D] md:text-4xl">
          {category ? category : 'Tất cả sản phẩm'}
        </h1>
        {search && (
          <p className="mt-2 text-muted">
            Kết quả tìm kiếm cho: <strong className="text-[#2D2D2D]">"{search}"</strong>
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden w-52 flex-shrink-0 lg:block" aria-label="Bộ lọc sản phẩm">
          <Suspense>
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Toolbar */}
          <Suspense>
            <ProductToolbar total={count ?? 0} />
          </Suspense>

          {/* Grid */}
          <ProductGrid products={(products ?? []) as Product[]} />

          {/* Pagination */}
          <div className="pt-4">
            <Suspense>
              <Pagination currentPage={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}