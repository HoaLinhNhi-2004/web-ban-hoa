'use client'

import { type FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ImageOff, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import AccountSidebar from '@/components/account/AccountSidebar'
import type { Product } from '@/types'

const WishlistPage: FC = () => {
  const [products,  setProducts]  = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setIsLoading(false); return }

      const { data } = await supabase
        .from('wishlists')
        .select('product_id, products(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setProducts(data?.map((w: { products: unknown }) => w.products as Product).filter(Boolean) ?? [])
      setIsLoading(false)
    }
    load()
  }, [])

  const removeFromWishlist = async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase
      .from('wishlists')
      .delete()
      .eq('user_id',    session.user.id)
      .eq('product_id', productId)

    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  return (
    <div className="container-shop py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />
        <main className="min-w-0 flex-1">
          <div className="rounded-2xl border border-[rgba(195,130,120,0.18)] bg-surface p-6 md:p-8">
            <h1 className="mb-6 font-display text-2xl font-light text-[#1E1714]">
              Sản phẩm yêu thích
            </h1>

            {isLoading ? (
              <div className="grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-square bg-[rgba(195,130,120,0.1)]" />
                    <div className="h-4 w-3/4 rounded bg-[rgba(195,130,120,0.1)]" />
                    <div className="h-4 w-1/2 rounded bg-[rgba(195,130,120,0.1)]" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(168,84,72,0.08)]">
                  <Heart className="h-8 w-8 text-[rgba(168,84,72,0.3)]" />
                </div>
                <div>
                  <p className="font-display text-lg font-light text-[#1E1714]">
                    Chưa có sản phẩm yêu thích
                  </p>
                  <p className="mt-1 font-sans text-sm text-[rgba(30,23,20,0.45)]">
                    Nhấn icon ♡ trên trang sản phẩm để lưu lại nhé!
                  </p>
                </div>
                <Link
                  href="/products"
                  className="mt-2 bg-[#A85448] px-8 py-3 font-sans text-[10px] uppercase tracking-[3px] text-[#FAF8F5] transition-colors hover:bg-[#8B3D33]"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="group relative border border-[rgba(195,130,120,0.14)] bg-[#FFFDF9]"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="relative block aspect-[3/4] overflow-hidden bg-[#F5EDE8]"
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageOff className="h-8 w-8 text-[rgba(30,23,20,0.2)]" />
                        </div>
                      )}
                    </Link>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      suppressHydrationWarning
                      aria-label="Xóa khỏi yêu thích"
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#A85448] opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-[#A85448] hover:text-white"
                    >
                      <Heart className="h-3.5 w-3.5 fill-current" />
                    </button>

                    <div className="p-3">
                      <p className="mb-1 font-sans text-[9px] uppercase tracking-[3px] text-[rgba(168,84,72,0.5)]">
                        {product.category}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        className="line-clamp-2 font-display text-[15px] font-light text-[#1E1714] transition-colors hover:text-[#A85448]"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-display text-[15px] text-[#A85448]">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => addItem(product)}
                          suppressHydrationWarning
                          disabled={product.stock === 0}
                          aria-label={`Thêm ${product.name} vào giỏ`}
                          className="flex h-7 w-7 items-center justify-center border border-[rgba(168,84,72,0.28)] text-[#A85448] transition-colors hover:bg-[#A85448] hover:text-[#FAF8F5] disabled:opacity-40"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default WishlistPage
