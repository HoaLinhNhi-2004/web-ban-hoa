import Link from 'next/link'
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react'
import ClearCart from '@/components/checkout/ClearCart'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams

  return (
    <div className="container-shop flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <ClearCart />

      {/* Icon thành công */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(45,122,79,0.1)]">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      {/* Nội dung */}
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-light text-[#1E1714]">
          Đặt hàng thành công! 🎉
        </h1>
        <p className="max-w-md font-sans text-sm font-light text-[rgba(30,23,20,0.5)]">
          Cảm ơn bạn đã mua hoa tại Flower Shop.
          Chúng mình sẽ xử lí đơn hàng của bạn sớm nhất có thể!!!
        </p>
        {orderId && (
          <p className="font-sans text-sm text-[rgba(30,23,20,0.4)]">
            Mã đơn hàng:{' '}
            <strong className="font-mono text-[#1E1714]">
              #{orderId.slice(0, 8).toUpperCase()}
            </strong>
          </p>
        )}
      </div>

      {/* Thông tin giao hàng */}
      <div className="w-full max-w-sm border border-[rgba(195,130,120,0.18)] bg-[#FAF8F5] p-5 text-left space-y-2">
        <p className="font-sans text-[9px] tracking-[3px] uppercase text-[rgba(30,23,20,0.35)]">
          Thông tin giao hàng
        </p>
        <div className="space-y-1 font-sans text-sm text-[rgba(30,23,20,0.55)]">
          <p className="flex items-center gap-2">
            <span>🕐</span> Giao trong vòng 2 tiếng
          </p>
          <p className="flex items-center gap-2">
            <span>📞</span> Shipper sẽ gọi trước khi đến
          </p>
          <p className="flex items-center gap-2">
            <span>🌸</span> Hoa được bảo quản đến tận tay bạn
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/account/orders"
          className="flex items-center justify-center gap-2 bg-[#A85448] px-8 py-3 font-sans text-[10px] tracking-[3px] uppercase text-[#FAF8F5] transition-colors hover:bg-[#8B3D33]"
        >
          <ShoppingBag className="h-4 w-4" />
          Xem đơn hàng
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 border border-[rgba(168,84,72,0.3)] px-8 py-3 font-sans text-[10px] tracking-[3px] uppercase text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)]"
        >
          <Home className="h-4 w-4" />
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
