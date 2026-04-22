// ─────────────────────────────────────────────
// Product
// ─────────────────────────────────────────────
export type Product = {
  id          : string
  name        : string
  price       : number
  description : string | null
  image_url   : string | null
  category    : string
  stock       : number
  is_featured : boolean
  created_at  : string
}

// ─────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────
export type CartItem = {
  product  : Product
  quantity : number
}

// ─────────────────────────────────────────────
// Order
// ─────────────────────────────────────────────
export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'delivering',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]

export type Order = {
  id                : string
  user_id           : string | null
  status            : OrderStatus
  total             : number
  shipping_address  : string
  phone             : string
  note              : string | null
  stripe_payment_id : string | null
  created_at        : string
}

export type OrderItem = {
  id            : string
  order_id      : string
  product_id    : string | null
  product_name  : string
  product_image : string | null
  quantity      : number
  price         : number
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

// ─────────────────────────────────────────────
// User / Profile
// ─────────────────────────────────────────────
export type UserRole = 'customer' | 'admin'

export type UserProfile = {
  id         : string
  full_name  : string | null
  phone      : string | null
  address    : string | null
  role       : UserRole
  created_at : string
}

// ─────────────────────────────────────────────
// Checkout form
// ─────────────────────────────────────────────
export type CheckoutFormData = {
  full_name : string
  phone     : string
  address   : string
  note?     : string
}

// ─────────────────────────────────────────────
// API response
// ─────────────────────────────────────────────
export type ApiResponse<T> = {
  data  : T | null
  error : string | null
}