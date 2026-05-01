import Link from 'next/link'
import { Flower2 } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <div className="container-shop flex flex-col items-center justify-center gap-6 py-32 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
        <Flower2 className="h-10 w-10 text-primary" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2D2D2D]">
          Không tìm thấy sản phẩm
        </h1>
        <p className="mt-2 text-muted">
          Sản phẩm này không tồn tại hoặc đã bị xóa.
        </p>
      </div>
      <Link href="/products" className="btn-primary">
        Xem tất cả sản phẩm
      </Link>
    </div>
  )
}