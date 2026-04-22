import type { OrderStatus } from '@/types'

// ── Order ───────────────────────────────────
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending   : 'Chờ xác nhận',
  confirmed : 'Đã xác nhận',
  delivering: 'Đang giao hàng',
  delivered : 'Đã giao',
  cancelled : 'Đã hủy',
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending   : 'bg-warning/10 text-warning',
  confirmed : 'bg-blue-50 text-blue-600',
  delivering: 'bg-purple-50 text-purple-600',
  delivered : 'bg-success/10 text-success',
  cancelled : 'bg-danger/10 text-danger',
}

// ── Product ─────────────────────────────────
export const CATEGORIES = [
  'Hoa hồng',
  'Hoa cưới',
  'Hoa bó',
  'Hoa giỏ',
  'Hoa ly',
  'Hoa tulip',
  'Hoa cúc',
] as const

export type Category = typeof CATEGORIES[number]

// ── Shipping ────────────────────────────────
export const SHIPPING_FEE          = 30_000   // 30.000đ
export const FREE_SHIPPING_THRESHOLD = 500_000 // miễn ship từ 500k

// ── Pagination ──────────────────────────────
export const PRODUCTS_PER_PAGE = 12

// ── Promo ───────────────────────────────────
export const PROMO_CODES: Record<string, number> = {
  FLOWER15: 0.15, // giảm 15%
  WELCOME10: 0.10, // giảm 10%
}

// ── Site info ───────────────────────────────
export const SITE = {
  name   : 'Flower Shop',
  tagline: 'Hoa tươi đẹp nhất mỗi ngày',
  email  : 'hello@flowershop.vn',
  phone  : '0901 234 567',
  address: '123 Đường Hoa, Quận 1, TP.HCM',
  url    : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const