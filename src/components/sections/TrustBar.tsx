import { type FC } from 'react'
import { Zap, Shield, RefreshCw, Truck } from 'lucide-react'

const ITEMS = [
  { icon: Zap,       stat: 'Giao trong 2 giờ',      sub: 'Nội thành HCM & Hà Nội' },
  { icon: Shield,    stat: '100% hoa tươi',          sub: 'Cam kết chất lượng'     },
  { icon: RefreshCw, stat: 'Đổi trả miễn phí',       sub: 'Trong vòng 24 giờ'      },
  { icon: Truck,     stat: 'Miễn phí vận chuyển',    sub: 'Đơn hàng từ 500.000đ'   },
]

const TrustBar: FC = () => (
  <section
    aria-label="Cam kết dịch vụ"
    className="border-y border-[rgba(195,130,120,0.14)] bg-[#FAF8F5]"
  >
    <div className="container-shop">
      <ul className="grid grid-cols-2 divide-x divide-y divide-[rgba(195,130,120,0.12)] md:grid-cols-4 md:divide-y-0">
        {ITEMS.map(({ icon: Icon, stat, sub }) => (
          <li key={stat} className="flex items-center gap-3 px-5 py-4 md:py-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(168,84,72,0.07)]">
              <Icon className="h-4 w-4 text-[#A85448]" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-[13px] font-light leading-snug text-[#1E1714]">
                {stat}
              </p>
              <p className="font-sans text-[10px] leading-snug text-[rgba(30,23,20,0.4)]">
                {sub}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default TrustBar
