---
name: commit
description: Tạo commit message chuẩn conventional commits từ staged changes — bao gồm scope cụ thể cho flower shop (cart, product, checkout, admin, auth, payment)
---

Analyze the staged changes with `git diff --staged`.

Generate a commit message following Conventional Commits format.

## Type

| Type | Khi nào dùng |
|---|---|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `refactor` | Cấu trúc lại code, không thay đổi behavior |
| `style` | Formatting, Tailwind class, không ảnh hưởng logic |
| `docs` | Cập nhật CLAUDE.md, README, comments |
| `test` | Thêm hoặc sửa test |
| `chore` | Cài package, config, CI/CD, env vars |
| `perf` | Cải thiện performance (memo, lazy load, ISR) |
| `a11y` | Cải thiện accessibility (aria, alt, focus) |
| `security` | Vá lỗ hổng bảo mật |

## Scope — flower shop specific

```
product     → ProductCard, ProductGrid, ProductDetail, /products pages
cart        → cartStore, CartSidebar, CartItem, CartSummary
checkout    → checkout form, validation, /checkout page
payment     → Stripe integration, /api/payment, webhook handler
order       → order creation, order history, /api/orders, /account/orders
auth        → login, register, Supabase Auth, /api/auth, middleware
admin       → admin dashboard, product management, order management
cloudinary  → image upload, Cloudinary helpers
db          → Supabase queries, schema changes, RLS policies
ui          → primitive components (Button, Input, Badge, Card)
layout      → Navbar, Footer, CartSidebar layout
seo         → metadata, og images, generateMetadata
config      → next.config.ts, tailwind.config.ts, vitest.config.ts
types       → TypeScript type definitions in src/types/
hooks       → custom hooks in src/hooks/
```

## Format

```
<type>(<scope>): <description>

[optional body — nếu thay đổi phức tạp]

[optional footer — breaking changes hoặc issue reference]
```

## Rules

- Description tối đa 72 ký tự
- Dùng tiếng Anh, động từ nguyên mẫu (add, fix, update, remove — không phải added/fixing)
- Body giải thích WHY, không phải WHAT (code đã thể hiện WHAT rồi)
- Nếu diff chạm nhiều scope → chọn scope chính, hoặc bỏ scope
- Breaking change → thêm `BREAKING CHANGE:` vào footer

## Examples

```
feat(cart): add quantity update on cart item

fix(checkout): validate Vietnamese phone format (must start with 0)

feat(payment): verify Stripe webhook signature before processing

fix(product): disable add-to-cart button when stock is zero

refactor(hooks): extract useProducts from ProductsPage component

feat(admin): add product image upload via Cloudinary

fix(auth): read user_id from session instead of request body

perf(product): add React.memo to ProductCard for grid rendering

a11y(cart): add aria-label to cart icon and close button

chore(config): add Cloudinary domain to next.config remotePatterns

test(cart): add failing tests for cartStore quantity edge cases

docs(claude): update CLAUDE.md with Stripe webhook security decision
```

## Output

Output ONLY the commit message — no explanation, no markdown fences.
If staged changes are empty, report: "No staged changes found. Run git add first."
Do NOT run git commit. Only output the message for review.