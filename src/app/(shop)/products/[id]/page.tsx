import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createSupabaseServer } from '@/lib/supabase-server'
import ProductImages   from '@/components/product/ProductImages'
import ProductInfo     from '@/components/product/ProductInfo'
import RelatedProducts from '@/components/product/RelatedProducts'
import type { Product } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Không tìm thấy sản phẩm | Flower Shop' }

  return {
    title      : `${data.name} | Flower Shop`,
    description: data.description ?? `Mua ${data.name} tại Flower Shop`,
    openGraph  : {
      title : data.name,
      images: data.image_url ? [{ url: data.image_url }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="container-shop py-10">
      {/* Main detail */}
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImages product={product as Product} />
        <ProductInfo   product={product as Product} />
      </div>

      {/* Related products */}
      <Suspense fallback={<div className="mt-16 h-64 animate-pulse rounded-2xl bg-border" />}>
        <RelatedProducts
          category  ={product.category}
          excludeId ={product.id}
        />
      </Suspense>
    </div>
  )
}