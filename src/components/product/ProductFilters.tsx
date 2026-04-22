'use client'

import { type FC } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mới nhất'       },
  { value: 'price_asc',  label: 'Giá tăng dần'   },
  { value: 'price_desc', label: 'Giá giảm dần'   },
  { value: 'name_asc',   label: 'Tên A → Z'       },
]

const ProductFilters: FC = () => {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') ?? ''
  const currentSort     = searchParams.get('sort') ?? 'newest'
  const currentSearch   = searchParams.get('q') ?? ''

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // reset về trang 1 khi filter
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAll = () => router.push(pathname)

  const hasFilters = currentCategory || currentSearch || currentSort !== 'newest'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm text-text">Bộ lọc</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-muted hover:text-danger transition-colors"
          >
            <X className="h-3 w-3" /> Xóa tất cả
          </button>
        )}
      </div>

      {/* Danh mục */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Danh mục
        </p>
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={() => updateParam('category', '')}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary hover:text-primary',
                !currentCategory
                  ? 'bg-secondary font-semibold text-primary'
                  : 'text-text'
              )}
            >
              Tất cả
            </button>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => updateParam('category', cat)}
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary hover:text-primary',
                  currentCategory === cat
                    ? 'bg-secondary font-semibold text-primary'
                    : 'text-text'
                )}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sắp xếp (mobile ẩn vì có toolbar riêng) */}
      <div className="hidden lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Sắp xếp
        </p>
        <ul className="flex flex-col gap-1">
          {SORT_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                onClick={() => updateParam('sort', opt.value)}
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary hover:text-primary',
                  currentSort === opt.value
                    ? 'bg-secondary font-semibold text-primary'
                    : 'text-text'
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProductFilters