import { type FC } from 'react'
import Link from 'next/link'

const OCCASIONS = [
  { label: 'Sinh nhật',   emoji: '🎂', href: '/products'                                              },
  { label: 'Lễ cưới',     emoji: '💒', href: `/products?category=${encodeURIComponent('Hoa cưới')}`   },
  { label: 'Khai trương', emoji: '🎉', href: '/products'                                              },
  { label: 'Tình yêu',    emoji: '💕', href: `/products?category=${encodeURIComponent('Hoa hồng')}`   },
  { label: 'Cảm ơn',      emoji: '🙏', href: '/products'                                              },
  { label: 'Thăm hỏi',    emoji: '🌿', href: '/products'                                              },
]

const OccasionsSection: FC = () => (
  <section aria-label="Chọn theo dịp" className="bg-[#FBF6F3] py-12 md:py-16">
    <div className="container-shop">

      {/* Heading — centered editorial */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-3 flex items-center gap-4">
          <span className="block h-px w-10 bg-[rgba(196,121,106,0.4)]" aria-hidden="true" />
          <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">
            Tặng hoa theo dịp
          </span>
          <span className="block h-px w-10 bg-[rgba(196,121,106,0.4)]" aria-hidden="true" />
        </div>
        <h2 className="font-display text-[28px] font-light text-[#1E1714] md:text-[36px]">
          Mỗi khoảnh khắc, một bó hoa
        </h2>
        <p className="mt-2 font-sans text-[12px] font-light text-[rgba(30,23,20,0.45)]">
          Chọn đúng loài hoa cho từng dịp đặc biệt của bạn
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:gap-4">
        {OCCASIONS.map(({ label, emoji, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-[rgba(195,130,120,0.14)] bg-[#FFFDF9] px-4 py-5 text-center transition-all hover:border-[rgba(168,84,72,0.28)] hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448] md:py-6"
          >
            <span className="text-[32px] leading-none transition-transform duration-300 group-hover:scale-110">
              {emoji}
            </span>
            <span className="font-sans text-[10px] font-medium tracking-[1px] text-[rgba(30,23,20,0.6)] transition-colors group-hover:text-[#A85448]">
              {label}
            </span>
          </Link>
        ))}
      </div>

    </div>
  </section>
)

export default OccasionsSection
