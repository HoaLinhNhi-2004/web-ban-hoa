---
description: Rules for React components in the Flower Shop project — covers component structure, accessibility, design tokens, and flower shop specific patterns (ProductCard, CartSidebar, checkout forms, admin tables)
globs: ["src/components/**/*.tsx"]
alwaysApply: false
---

## Component structure

- Always use `FC<Props>` type — never use `function Component()` without explicit return type
- Props interface must be defined directly above the component, named `[ComponentName]Props`
- Export default at the bottom of the file — never inline with the declaration
- Sub-components (if any) go after the main component, exported as named exports

```tsx
// ✅ Correct structure
interface ProductCardProps {
  product: Product
  className?: string
}

const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  return (...)
}

export default ProductCard
```

## Styling

- Always use `cn()` from `@/lib/utils` for className merging — never string concatenation
- Use only Tailwind CSS — no inline styles, no CSS modules, no hardcoded hex colors
- Use design tokens from CLAUDE.md, not arbitrary values:
  - Colors: `text-primary`, `bg-surface`, `border-border`, `text-muted`, `text-accent`
  - Rounded: `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-full`
  - Never use arbitrary values like `text-[#E8738A]` or `p-[13px]`
- Use `cva()` from `class-variance-authority` when a component has multiple visual variants

## Accessibility (mandatory)

- Every interactive element without visible text needs `aria-label` in Vietnamese:
  - Cart icon button → `aria-label="Mở giỏ hàng"`
  - Close button → `aria-label="Đóng"`
  - Delete from cart → `aria-label="Xóa khỏi giỏ hàng"`
  - Quantity decrease → `aria-label="Giảm số lượng"`
  - Quantity increase → `aria-label="Tăng số lượng"`
- All flower images must have descriptive `alt` text — never empty for product images:
  - ✅ `alt="Hoa hồng đỏ Ecuador - bó 12 bông"`
  - ❌ `alt=""` on a product image
  - ✅ `alt=""` only for purely decorative images
- Modals and sidebars must have `role="dialog"` and `aria-modal="true"`
- Form inputs must be paired with `<label>` via `htmlFor` / `id`
- Focus must be visible — never remove `outline`, use `focus-visible:ring-2` instead

## Images

- Always use `next/image`, never raw `<img>` tag
- Flower product images must include `width`, `height` or `fill` + `sizes` prop
- Cloudinary images should use transformation string for optimization:

```tsx
// ✅ Correct
<Image
  src={`${product.image_url}?f_auto,q_auto,w_400`}
  alt={`${product.name} - ${product.category}`}
  width={400}
  height={400}
  className="rounded-lg object-cover"
/>
```

## Flower shop specific rules

### ProductCard
- Must show out-of-stock state when `product.stock === 0`
- "Thêm vào giỏ" button must be `disabled` when `stock === 0`
- Price must always use `formatPrice(product.price)` — never render raw number
- Apply `React.memo` — ProductCard renders many times in grid

```tsx
// ✅ Price display
<p className="font-bold text-accent">{formatPrice(product.price)}</p>

// ❌ Never
<p>{product.price} đ</p>
```

### CartSidebar
- Must have `role="dialog"`, `aria-modal="true"`, `aria-label="Giỏ hàng"`
- Must close on `Escape` key press
- Must show empty state when `items.length === 0`
- Total must use `formatPrice(total())`

### Checkout form fields
- Every `<input>` must have a matching `<label htmlFor>`
- Show validation errors below the field, not in an alert
- Error message color: `text-danger`
- Use `react-hook-form` + `zod` — never manage form state with `useState`

### Admin components
- Admin tables must check user role before rendering — never rely on route protection alone
- Destructive actions (xóa sản phẩm, hủy đơn) must show a confirmation dialog first
- Use `role="alert"` on success/error feedback messages

## TypeScript

- Never use `any` — use `unknown` and narrow with type guards if needed
- All event handlers must be typed: `onClick: (e: React.MouseEvent<HTMLButtonElement>) => void`
- Optional props should have sensible defaults via destructuring

## Performance

- Apply `React.memo` to: `ProductCard` (used in grid), `CartItem`, `OrderRow` (admin table)
- Use `useCallback` for handlers passed as props to memoized children
- Dynamic import heavy components not needed on initial render:

```tsx
const AdminTable = dynamic(() => import('@/components/admin/AdminTable'), {
  loading: () => <TableSkeleton />,
})
```