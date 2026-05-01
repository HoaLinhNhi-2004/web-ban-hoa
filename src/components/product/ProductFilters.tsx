'use client'

import { type FC, useTransition, useState, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mới nhất'     },
  { value: 'price_asc',  label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name_asc',   label: 'Tên A → Z'    },
]

interface ProductFiltersProps {
  total: number
}

const ProductFilters: FC<ProductFiltersProps> = ({ total }) => {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentCategory = searchParams.get('category') ?? ''
  const currentSort     = searchParams.get('sort') ?? 'newest'
  const currentSearch   = searchParams.get('q') ?? ''
  const currentMinPrice = searchParams.get('min_price') ?? ''
  const currentMaxPrice = searchParams.get('max_price') ?? ''

  // resetKey forces uncontrolled inputs to remount when clearAll is called
  const [resetKey, setResetKey] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => router.replace(`${pathname}?${params.toString()}`))
  }

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateParam('q', value), 400)
  }

  const handlePriceChange = (key: 'min_price' | 'max_price', value: string) => {
    const numeric = value.replace(/\D/g, '')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateParam(key, numeric), 600)
  }

  const clearAll = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setResetKey(k => k + 1)
    startTransition(() => router.replace(pathname))
  }

  const hasFilters = currentCategory || currentSearch || currentSort !== 'newest' || currentMinPrice || currentMaxPrice

  return (
    <div className={cn('transition-opacity', isPending && 'pointer-events-none opacity-50')}>

      {/* Search — key forces remount (and defaultValue reset) when clearAll fires */}
      <div key={resetKey} className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[rgba(30,23,20,0.3)]" />
        <input
          type="search"
          placeholder="Tìm kiếm hoa..."
          aria-label="Tìm kiếm sản phẩm"
          defaultValue={currentSearch}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full pl-8 pr-4 py-2 text-sm border border-[rgba(195,130,120,0.2)] rounded-md bg-transparent text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none"
        />
      </div>

      <div className="h-px bg-[rgba(195,130,120,0.15)]" />

      {/* Danh mục */}
      <div className="my-4">
        <span className="block mb-3 text-[9px] font-medium tracking-[4px] uppercase text-[rgba(30,23,20,0.35)]">
          Danh mục
        </span>
        <ul className="flex flex-col gap-0.5">
          <li>
            <button
              onClick={() => updateParam('category', '')}
              suppressHydrationWarning
              className={cn(
                'w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors',
                !currentCategory
                  ? 'bg-[rgba(168,84,72,0.08)] text-[#A85448] font-medium'
                  : 'text-[rgba(30,23,20,0.55)] hover:bg-[rgba(168,84,72,0.06)]'
              )}
            >
              <span>Tất cả</span>
              <span className={cn(
                'text-[11px] px-2 py-0.5 rounded-full',
                !currentCategory
                  ? 'text-[#A85448] bg-[rgba(168,84,72,0.12)]'
                  : 'text-[rgba(30,23,20,0.35)] bg-[rgba(30,23,20,0.05)]'
              )}>
                {total}
              </span>
            </button>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => updateParam('category', cat)}
                suppressHydrationWarning
                className={cn(
                  'w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors',
                  currentCategory === cat
                    ? 'bg-[rgba(168,84,72,0.08)] text-[#A85448] font-medium'
                    : 'text-[rgba(30,23,20,0.55)] hover:bg-[rgba(168,84,72,0.06)]'
                )}
              >
                <span>{cat}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-[rgba(195,130,120,0.15)]" />

      {/* Sắp xếp */}
      <div className="my-4">
        <span className="block mb-3 text-[9px] font-medium tracking-[4px] uppercase text-[rgba(30,23,20,0.35)]">
          Sắp xếp
        </span>
        <ul className="flex flex-col gap-0.5">
          {SORT_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                onClick={() => updateParam('sort', opt.value)}
                suppressHydrationWarning
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                  currentSort === opt.value
                    ? 'text-[#A85448] font-medium bg-[rgba(168,84,72,0.08)]'
                    : 'text-[rgba(30,23,20,0.55)] hover:bg-[rgba(168,84,72,0.06)]'
                )}
              >
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full flex-shrink-0',
                  currentSort === opt.value
                    ? 'bg-[#A85448]'
                    : 'border border-[rgba(30,23,20,0.25)]'
                )} />
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-[rgba(195,130,120,0.15)]" />

      {/* Khoảng giá — cùng key để remount khi clearAll */}
      <div key={`price-${resetKey}`} className="my-4">
        <span className="block mb-3 text-[9px] font-medium tracking-[4px] uppercase text-[rgba(30,23,20,0.35)]">
          Khoảng giá
        </span>
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            placeholder="100.000"
            defaultValue={currentMinPrice}
            onChange={e => handlePriceChange('min_price', e.target.value)}
            aria-label="Giá thấp nhất"
            className="flex-1 min-w-0 px-3 py-1.5 text-xs border border-[rgba(195,130,120,0.25)] rounded-md bg-transparent text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.15)]"
          />
          <span className="text-xs text-[rgba(30,23,20,0.35)] flex-shrink-0">—</span>
          <input
            type="text"
            placeholder="500.000"
            defaultValue={currentMaxPrice}
            onChange={e => handlePriceChange('max_price', e.target.value)}
            aria-label="Giá cao nhất"
            className="flex-1 min-w-0 px-3 py-1.5 text-xs border border-[rgba(195,130,120,0.25)] rounded-md bg-transparent text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.15)]"
          />
        </div>
      </div>

      {/* Xóa tất cả */}
      {hasFilters && (
        <>
          <div className="h-px bg-[rgba(195,130,120,0.15)]" />
          <button
            onClick={clearAll}
            suppressHydrationWarning
            className="flex items-center gap-1.5 mt-4 text-[9px] tracking-[2px] uppercase text-[rgba(30,23,20,0.35)] hover:text-[#A85448] transition-colors"
          >
            <X className="h-3 w-3" />
            Xóa tất cả bộ lọc
          </button>
        </>
      )}
    </div>
  )
}

export default ProductFilters
