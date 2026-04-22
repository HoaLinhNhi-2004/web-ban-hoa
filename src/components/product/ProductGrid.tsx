import { type FC } from 'react'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import type { Product } from '@/types'

interface ProductGridProps {
  products  : Product[]
  isLoading?: boolean
}

const ProductGrid: FC<ProductGridProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <span className="text-5xl">🌸</span>
        <p className="font-display text-xl font-bold text-text">
          Không tìm thấy sản phẩm
        </p>
        <p className="text-sm text-muted">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid