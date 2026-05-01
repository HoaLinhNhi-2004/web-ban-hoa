'use client'

import { type FC, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

interface ProductToolbarProps {
  total: number
}

const ProductToolbar: FC<ProductToolbarProps> = ({ total }) => {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentCategory = searchParams.get('category') ?? ''
  const currentSearch   = searchParams.get('q') ?? ''
  const currentMinPrice = searchParams.get('min_price') ?? ''
  const currentMaxPrice = searchParams.get('max_price') ?? ''

  const removeParams = (...keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    keys.forEach(k => params.delete(k))
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div className="flex items-center justify-between mb-4 min-h-7">
      {/* Active filter tags */}
      <div className="flex flex-wrap gap-2">
        {currentCategory && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(168,84,72,0.08)] border border-[rgba(168,84,72,0.2)] text-[11px] text-[#A85448]">
            {currentCategory}
            <button onClick={() => removeParams('category')} aria-label="Xóa lọc danh mục" suppressHydrationWarning>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        {currentSearch && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(168,84,72,0.08)] border border-[rgba(168,84,72,0.2)] text-[11px] text-[#A85448]">
            &quot;{currentSearch}&quot;
            <button onClick={() => removeParams('q')} aria-label="Xóa tìm kiếm" suppressHydrationWarning>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        {(currentMinPrice || currentMaxPrice) && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(168,84,72,0.08)] border border-[rgba(168,84,72,0.2)] text-[11px] text-[#A85448]">
            {currentMinPrice && currentMaxPrice
              ? `${Number(currentMinPrice).toLocaleString('vi-VN')} — ${Number(currentMaxPrice).toLocaleString('vi-VN')}đ`
              : currentMinPrice
                ? `Từ ${Number(currentMinPrice).toLocaleString('vi-VN')}đ`
                : `Đến ${Number(currentMaxPrice).toLocaleString('vi-VN')}đ`}
            <button onClick={() => removeParams('min_price', 'max_price')} aria-label="Xóa lọc giá" suppressHydrationWarning>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>

      {/* Số lượng kết quả */}
      <span className="text-[11px] tracking-[2px] uppercase text-[rgba(30,23,20,0.35)] whitespace-nowrap">
        {total} sản phẩm
      </span>
    </div>
  )
}

export default ProductToolbar
