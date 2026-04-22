import { type FC } from 'react'

const ProductCardSkeleton: FC = () => {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square bg-border" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-16 rounded bg-border" />
        <div className="h-4 w-full rounded bg-border" />
        <div className="h-4 w-3/4 rounded bg-border" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-20 rounded bg-border" />
          <div className="h-8 w-8 rounded-full bg-border" />
        </div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton