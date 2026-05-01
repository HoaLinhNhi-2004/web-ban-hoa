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
  internal_note     : string | null
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

// ─────────────────────────────────────────────
// Chat
// ─────────────────────────────────────────────
export type Conversation = {
  id              : string
  user_id         : string
  user_name       : string | null
  user_email      : string | null
  status          : 'open' | 'closed'
  last_message    : string | null
  last_message_at : string
  created_at      : string
}

export type Message = {
  id              : string
  conversation_id : string
  sender_id       : string | null
  sender_role     : 'user' | 'admin'
  content         : string
  is_read         : boolean
  created_at      : string
}

// ─────────────────────────────────────────────
// Promo / Shipping
// ─────────────────────────────────────────────
export type PromoCode = {
  id         : string
  code       : string
  type       : 'percent' | 'fixed'
  value      : number
  min_order  : number
  max_uses   : number | null
  used_count : number
  is_active  : boolean
  expires_at : string | null
  created_at : string
}

export type ShippingZone = {
  id        : string
  name      : string
  keywords  : string[]
  fee       : number
  is_active : boolean
  sort_order: number
}

// ─────────────────────────────────────────────
// Banner
// ─────────────────────────────────────────────
export type Banner = {
  id        : string
  eyebrow   : string
  title     : string
  title_em  : string
  sub       : string | null
  badge     : string | null
  cta_label : string
  cta_href  : string
  emoji     : string | null
  bg_from   : string
  bg_to     : string
  is_active : boolean
  sort_order: number
  created_at: string
}