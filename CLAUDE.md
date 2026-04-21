# CLAUDE.md — Flower Shop Project

> Đây là file hướng dẫn cho Claude Code. Đọc toàn bộ file này trước khi bắt đầu bất kỳ task nào.
> Cập nhật file này khi có quyết định kỹ thuật mới.

---

## 1. Tổng quan dự án

```
Tên dự án  : Flower Shop
Mô tả      : Trang web bán hoa online với đầy đủ tính năng thương mại điện tử —
             hiển thị sản phẩm, giỏ hàng, đặt hàng, thanh toán và quản lý admin.
URL prod   : [https://flower-shop.vercel.app]
URL staging: [https://flower-shop-staging.vercel.app]
Trạng thái : Development
```

---

## 2. Tech Stack

```
Framework   : Next.js 14+ (App Router)
Language    : TypeScript (strict mode)
Styling     : Tailwind CSS
UI Library  : shadcn/ui + Radix UI
State       : Zustand (giỏ hàng, UI state)
Auth        : Supabase Auth
Database    : Supabase (PostgreSQL)
Payment     : Stripe / VNPay
Image host  : Cloudinary
Forms       : React Hook Form + Zod
Animation   : Framer Motion (micro-interactions nhẹ)
Testing     : Vitest + Testing Library
Linting     : ESLint + Prettier
Package mgr : npm
Node version: 20.x
```

---

## 3. Cấu trúc thư mục

```
src/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── account/
│   │       ├── page.tsx
│   │       └── orders/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── products/page.tsx
│   │   └── orders/page.tsx
│   ├── api/
│   │   ├── products/route.ts
│   │   ├── orders/route.ts
│   │   └── payment/route.ts
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── product/
│   ├── cart/
│   └── admin/
├── hooks/
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── cloudinary.ts
│   ├── utils.ts
│   └── constants.ts
├── store/
│   └── cartStore.ts
├── types/
│   └── index.ts
└── public/
    ├── fonts/
    └── images/
```

---

## 4. Design System

### 4.1 Brand Colors

```css
--color-primary   : #E8738A;
--color-secondary : #F9B9C5;
--color-accent    : #FF4D6D;
--color-bg        : #FFFAF9;
--color-surface   : #FFFFFF;
--color-text      : #2D2D2D;
--color-muted     : #9CA3AF;
--color-border    : #F0E4E7;
--color-danger    : #EF4444;
--color-success   : #22C55E;
--color-warning   : #F59E0B;
```

### 4.2 Typography

```
Display font : Playfair Display — heading lớn, tên sản phẩm, hero title
Body font    : Inter — paragraph, UI text, giá, mô tả
Mono font    : JetBrains Mono — code, ID đơn hàng

Scale (rem): xs=0.75 | sm=0.875 | base=1 | lg=1.125 | xl=1.25
             2xl=1.5 | 3xl=1.875 | 4xl=2.25 | 5xl=3 | 6xl=3.75
```

### 4.3 Spacing & Layout

```
Spacing scale : 4px base unit (4, 8, 12, 16, 24, 32, 48, 64, 96px)
Container max : 1280px
Content max   : 768px
Breakpoints   : sm=640 | md=768 | lg=1024 | xl=1280 | 2xl=1536
Border radius : sm=4px | md=8px | lg=12px | xl=16px | full=9999px
```

### 4.4 Component Conventions

- Mỗi component có file riêng, đặt tên PascalCase
- Props interface đặt ngay trên component, tên `[ComponentName]Props`
- Export default cho component chính, named export cho sub-components
- Variants dùng `cva()` nếu có nhiều kiểu

---

## 5. Coding Standards

### 5.1 TypeScript

```typescript
// Luôn dùng type/interface rõ ràng, không dùng `any`
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const ORDER_STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'] as const
type OrderStatus = typeof ORDER_STATUSES[number]

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'code' in error
}
```

### 5.2 React Components

```tsx
import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-4 shadow-sm', className)}>
      <h3 className="font-display text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-muted">{product.description}</p>
      <p className="mt-2 font-bold text-accent">{formatPrice(product.price)}</p>
    </div>
  )
}

export default ProductCard
```

### 5.3 File naming

```
Components : PascalCase.tsx       → ProductCard.tsx, CartSidebar.tsx
Hooks      : camelCase với use-   → useCart.ts, useProducts.ts
Utils      : camelCase            → formatPrice.ts, formatDate.ts
Types      : camelCase            → index.ts
Constants  : UPPER_SNAKE_CASE     → CATEGORIES, ORDER_STATUS
Pages      : lowercase/kebab      → products/[id]/page.tsx
API routes : lowercase/kebab      → route.ts
```

### 5.4 Import order

```typescript
// 1. React & Next.js
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 2. Third-party
import { motion } from 'framer-motion'
import { z } from 'zod'

// 3. Internal
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { supabase } from '@/lib/supabase'
import { cn, formatPrice } from '@/lib/utils'

// 4. Types
import type { Product, Order } from '@/types'
```

---

## 6. Accessibility (a11y)

```
✅ Semantic HTML — nav, main, section, article, header, footer
✅ Alt text cho tất cả ảnh hoa (mô tả loài hoa, màu sắc)
✅ aria-label cho icon buttons: "Thêm vào giỏ", "Xóa sản phẩm", "Đóng"
✅ Focus visible — không xóa outline, dùng focus-visible:
✅ Color contrast — tối thiểu 4.5:1 cho text, 3:1 cho UI
✅ Keyboard navigable — Escape đóng CartSidebar/modal
✅ ARIA roles — role="dialog" cho CartSidebar, aria-expanded cho dropdown
✅ Skip navigation link ở đầu trang
✅ Form labels liên kết với input (htmlFor / id)
```

---

## 7. Performance

```
✅ Ảnh hoa — next/image + Cloudinary URL tối ưu
✅ Fonts — next/font cho Playfair Display và Inter
✅ Dynamic imports — lazy load CartSidebar, ProductModal, AdminTable
✅ Skeleton loading — ProductCardSkeleton khi danh sách đang load
✅ React.memo cho ProductCard — render nhiều trong grid
```

---

## 8. SEO

```typescript
// Trang chủ
export const metadata: Metadata = {
  title: 'Flower Shop — Hoa tươi đẹp nhất mỗi ngày',
  description: 'Mua hoa tươi online với đa dạng mẫu hoa đẹp — hoa sinh nhật, hoa cưới, hoa tặng. Giao hàng nhanh, giá tốt.',
  openGraph: {
    title: 'Flower Shop — Hoa tươi đẹp nhất mỗi ngày',
    description: 'Mua hoa tươi online với đa dạng mẫu hoa đẹp.',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
}

// Trang sản phẩm — dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id)
  return {
    title: `${product.name} | Flower Shop`,
    description: product.description.slice(0, 155),
  }
}
```

---

## 9. Responsive Design

```
Mobile-first — viết styles mobile trước, dùng md: lg: xl: để mở rộng

Breakpoints cần test:
- 375px  (iPhone SE)
- 390px  (iPhone 14)
- 768px  (iPad)
- 1024px (iPad landscape)
- 1280px (Desktop)
- 1536px (Large desktop)

Product Grid:
- Mobile  : 2 cột
- Tablet  : 3 cột
- Desktop : 4 cột

Touch targets — tối thiểu 44x44px cho mọi interactive element
```

---

## 10. Quy trình làm việc với Claude Code

### 10.1 Trước khi bắt đầu task

```
1. Đọc section liên quan trong CLAUDE.md này
2. Hiểu rõ yêu cầu — hỏi lại nếu mơ hồ TRƯỚC khi code
3. Lên plan ngắn (2-3 dòng) nếu task phức tạp
4. Kiểm tra file/component đã tồn tại chưa trước khi tạo mới
```

### 10.2 Trong khi code

```
- Viết TypeScript strict, không dùng any hoặc ts-ignore
- Áp dụng design tokens đã định nghĩa, không hardcode màu/spacing
- Commit sau mỗi feature nhỏ hoàn chỉnh
- Không xóa code cũ nếu chưa có replacement — comment TODO thay vì xóa
```

### 10.3 Sau khi hoàn thành

```
- Tự review: đúng design system? đúng naming? có a11y không?
- Kiểm tra responsive trên ít nhất mobile + desktop
- Chạy linter: npm run lint
- Build check: npm run build
```

### 10.4 Những điều Claude KHÔNG được làm

```
❌ Không thay đổi next.config.ts, tailwind.config.ts mà không hỏi
❌ Không cài thêm package mà không đề xuất trước
❌ Không xóa hoặc rename file đã có mà không xác nhận
❌ Không push lên git — chỉ tạo commit message đề xuất
❌ Không hardcode API keys, secrets, env variables
❌ Không dùng inline styles nếu Tailwind class giải quyết được
```

---

## 11. Environment Variables

```bash
# Public
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=

# Private (server-only)
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 12. Common Patterns

### 12.1 Data Fetching (Server Component)

```typescript
async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return <ProductGrid products={products ?? []} />
}
```

### 12.2 Client Component — Thêm vào giỏ hàng

```typescript
'use client'
function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      onClick={() => startTransition(() => addItem(product))}
      disabled={isPending}
    >
      {isPending ? 'Đang thêm...' : 'Thêm vào giỏ'}
    </Button>
  )
}
```

### 12.3 Error Boundary

```
- Mỗi route segment có error.tsx riêng
- Dùng notFound() khi product/order không tồn tại
- API errors trả về NextResponse với status code phù hợp
```

### 12.4 Form Checkout

```typescript
const checkoutSchema = z.object({
  full_name : z.string().min(2, 'Vui lòng nhập họ tên'),
  phone     : z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  address   : z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  note      : z.string().optional(),
})
type CheckoutForm = z.infer<typeof checkoutSchema>
```

---

## 13. Testing Conventions (TDD)

### 13.1 Quy tắc bắt buộc

```
✅ Luôn viết FAILING test trước khi implement
✅ Pattern AAA: Arrange - Act - Assert
✅ Một assertion per test khi có thể
✅ Tên test mô tả behavior: "should_add_item_to_cart"
```

### 13.2 Vòng lặp Red → Green → Refactor

**RED:** "Write a failing test for [feature]. Do NOT write the implementation yet."

**GREEN:** "Implement the minimum code to make these tests pass. Nothing more."

**REFACTOR:** "Refactor the implementation. Tests must stay green."

### 13.3 Hook tự động chạy test

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npm test --watchAll=false 2>&1 | head -20"
      }
    ]
  }
}
```

### 13.4 Anti-patterns

| Prompt sai | Thay bằng |
|---|---|
| "Write tests for this feature" | "Write FAILING tests, do NOT implement" |
| "Add tests and implementation" | Tách thành 2 prompt riêng biệt |
| "Make sure tests pass" | "Write tests first, then implement minimally" |

---

## 14. Lịch sử quyết định kỹ thuật

| Ngày | Quyết định | Lý do |
|------|-----------|-------|
| 20/04/2025 | Chọn App Router | Support React Server Components, SEO tốt hơn |
| 20/04/2025 | Chọn Supabase | Có sẵn Auth, Storage, Realtime — tiết kiệm thời gian |
| 20/04/2025 | Chọn Zustand cho cart | Nhẹ hơn Redux, persist dễ với localStorage |
| 20/04/2025 | Cloudinary cho ảnh hoa | Tự động tối ưu ảnh, free tier đủ dùng |

---

## 15. Liên kết quan trọng

```
Design file      : [Figma link]
Supabase DB      : https://app.supabase.com/project/[your-project-id]
Stripe Dashboard : https://dashboard.stripe.com
Cloudinary       : https://cloudinary.com/console
Deploy (Vercel)  : https://vercel.com/dashboard
```

---

*Cập nhật lần cuối: 20/04/2025*
*Maintainer: [Syx]*