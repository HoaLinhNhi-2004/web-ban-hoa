import { type FC } from 'react'
import Link from 'next/link'
import { Flower2 } from 'lucide-react'

const PRODUCT_LINKS = [
  { href: '/products?category=Hoa hồng',  label: 'Hoa hồng'  },
  { href: '/products?category=Hoa cưới',  label: 'Hoa cưới'  },
  { href: '/products?category=Hoa bó',    label: 'Hoa bó'    },
  { href: '/products?category=Hoa giỏ',   label: 'Hoa giỏ'   },
  { href: '/products?category=Hoa ly',    label: 'Hoa ly'    },
  { href: '/products?category=Hoa tulip', label: 'Hoa tulip' },
]

const SUPPORT_LINKS = [
  { href: '/about',    label: 'Về chúng tôi'          },
  { href: '/contact',  label: 'Liên hệ'                },
  { href: '/faq',      label: 'Câu hỏi thường gặp'    },
  { href: '/guide',    label: 'Hướng dẫn đặt hàng'    },
  { href: '/shipping', label: 'Chính sách giao hàng'  },
  { href: '/returns',  label: 'Đổi trả & hoàn tiền'   },
  { href: '/privacy',  label: 'Chính sách bảo mật'    },
]

const CONTACT_INFO = [
  { icon: '📍', text: '123 Đường Hoa, Quận 1, TP.HCM', href: null                        },
  { icon: '📞', text: '0901 234 567',                   href: 'tel:0901234567'            },
  { icon: '✉️', text: 'hello@flowershop.vn',            href: 'mailto:hello@flowershop.vn' },
]

const Footer: FC = () => {
  return (
    <footer className="border-t border-[rgba(195,130,120,0.18)] bg-[#FAF8F5]">
      <div className="container-shop py-14">

        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-5 focus-visible:outline-none">
              <Flower2 className="h-5 w-5 text-[#A85448]" />
              <span className="font-display text-[15px] font-light tracking-[5px] uppercase text-[#A85448]">
                Flower Shop
              </span>
            </Link>
            <p className="text-[13px] font-light leading-relaxed text-[rgba(30,23,20,0.45)] max-w-[200px]">
              Hoa tươi nhập khẩu cao cấp — giao hàng trong 2 tiếng, tươi lâu, giá tốt.
            </p>
          </div>

          {/* Col 2 — Sản phẩm */}
          <div>
            <p className="mb-4 text-[9px] font-medium tracking-[4px] uppercase text-[rgba(30,23,20,0.35)]">
              Sản phẩm
            </p>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-light text-[rgba(30,23,20,0.5)] hover:text-[#A85448] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Hỗ trợ */}
          <div>
            <p className="mb-4 text-[9px] font-medium tracking-[4px] uppercase text-[rgba(30,23,20,0.35)]">
              Hỗ trợ
            </p>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-light text-[rgba(30,23,20,0.5)] hover:text-[#A85448] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Liên hệ */}
          <div>
            <p className="mb-4 text-[9px] font-medium tracking-[4px] uppercase text-[rgba(30,23,20,0.35)]">
              Liên hệ
            </p>
            <ul className="space-y-3">
              {CONTACT_INFO.map(item => (
                <li key={item.text}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-start gap-2.5 text-[13px] font-light text-[rgba(30,23,20,0.5)] hover:text-[#A85448] transition-colors"
                    >
                      <span className="flex-shrink-0 text-[12px]">{item.icon}</span>
                      {item.text}
                    </a>
                  ) : (
                    <p className="flex items-start gap-2.5 text-[13px] font-light text-[rgba(30,23,20,0.5)]">
                      <span className="flex-shrink-0 text-[12px]">{item.icon}</span>
                      {item.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(195,130,120,0.15)] pt-6 sm:flex-row">
          <p className="text-[11px] font-light text-[rgba(30,23,20,0.3)]">
            © {new Date().getFullYear()} Flower Shop. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-[11px] font-light text-[rgba(30,23,20,0.3)] hover:text-[#A85448] transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <span className="text-[rgba(30,23,20,0.2)]">·</span>
            <Link
              href="/terms"
              className="text-[11px] font-light text-[rgba(30,23,20,0.3)] hover:text-[#A85448] transition-colors"
            >
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
