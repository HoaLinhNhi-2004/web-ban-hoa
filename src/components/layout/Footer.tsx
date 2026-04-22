import { type FC } from 'react'
import Link from 'next/link'
import { Flower2, MapPin, Phone, Mail } from 'lucide-react'

const FOOTER_LINKS = {
  'Sản phẩm': [
    { href: '/products?category=Hoa hồng',  label: 'Hoa hồng' },
    { href: '/products?category=Hoa cưới',  label: 'Hoa cưới' },
    { href: '/products?category=Hoa bó',    label: 'Hoa bó' },
    { href: '/products?category=Hoa giỏ',   label: 'Hoa giỏ' },
  ],
  'Hỗ trợ': [
    { href: '/about',    label: 'Về chúng tôi' },
    { href: '/faq',      label: 'Câu hỏi thường gặp' },
    { href: '/shipping', label: 'Chính sách giao hàng' },
    { href: '/returns',  label: 'Đổi trả & hoàn tiền' },
  ],
}

const Footer: FC = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-shop py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Flower2 className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-primary">
                Flower Shop
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">
              Hoa tươi đẹp nhất mỗi ngày — giao hàng nhanh, tươi lâu, giá tốt.
              Mang niềm vui đến mọi dịp đặc biệt của bạn.
            </p>

            {/* Contact info */}
            <ul className="mt-6 flex flex-col gap-2">
              <li className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                123 Đường Hoa, Quận 1, TP.HCM
              </li>
              <li className="flex items-center gap-2 text-sm text-muted">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:0901234567" className="hover:text-primary transition-colors">
                  0901 234 567
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:hello@flowershop.vn" className="hover:text-primary transition-colors">
                  hello@flowershop.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text">{title}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Flower Shop. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-xs text-muted hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer