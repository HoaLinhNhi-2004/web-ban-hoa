'use client'

import { type FC, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mới nhất'     },
  { value: 'price_asc',  label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name_asc',   label: 'Tên A → Z'    },
]

interface ProductToolbarProps {
  total: number
}

const ProductToolbar: FC<ProductToolbarProps> = ({ total }) => {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSort   = searchParams.get('sort') ?? 'newest'
  const currentSearch = searchParams.get('q') ?? ''

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Tìm kiếm hoa..."
          aria-label="Tìm kiếm sản phẩm"
          defaultValue={currentSearch}
          onChange={e => updateParam('q', e.target.value)}
          className={cn(
            'input-field pl-9 pr-9',
            isPending && 'opacity-60'
          )}
        />
        {currentSearch && (
          <button
            onClick={() => updateParam('q', '')}
            aria-label="Xóa tìm kiếm"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-danger transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Right: total + sort */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted whitespace-nowrap">
          {total} sản phẩm
        </span>
        <select
          value={currentSort}
          onChange={e => updateParam('sort', e.target.value)}
          aria-label="Sắp xếp sản phẩm"
          className="input-field w-auto cursor-pointer pr-8 text-sm"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ProductToolbar