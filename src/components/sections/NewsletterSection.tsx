'use client'

import { type FC, useState } from 'react'

const NewsletterSection: FC = () => {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section
      aria-label="Đăng ký nhận tin"
      className="bg-gradient-to-br from-[#F7EEE9] via-[#F2E8E2] to-[#EDE0D8] py-14 md:py-20"
    >
      <div className="container-shop">
        <div className="mx-auto max-w-lg text-center">

          {/* Decorative label */}
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-[rgba(196,121,106,0.4)]" aria-hidden="true" />
            <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">
              Ưu đãi độc quyền
            </span>
            <span className="block h-px w-10 bg-[rgba(196,121,106,0.4)]" aria-hidden="true" />
          </div>

          <h2 className="font-display text-[28px] font-light text-[#1E1714] md:text-[36px]">
            Nhận ưu đãi & tin tức hoa
          </h2>
          <p className="mt-2 mb-8 font-sans text-[13px] font-light text-[rgba(30,23,20,0.5)]">
            Giảm{' '}
            <strong className="font-medium text-[#A85448]">10%</strong>
            {' '}cho đơn hàng tiếp theo khi đăng ký nhận bản tin hàng tuần.
          </p>

          {submitted ? (
            <div className="rounded-xl border border-[rgba(168,84,72,0.18)] bg-[rgba(250,248,245,0.7)] px-6 py-5 backdrop-blur-sm">
              <p className="font-display text-[15px] font-light text-[#A85448]">
                🌸 Cảm ơn bạn! Mã giảm giá đã được gửi vào email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2" noValidate suppressHydrationWarning>
              <label htmlFor="newsletter-email" className="sr-only">
                Địa chỉ email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email của bạn..."
                required
                suppressHydrationWarning
                className="flex-1 border border-[rgba(168,84,72,0.28)] bg-[rgba(250,248,245,0.75)] px-4 py-3 font-sans text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] outline-none backdrop-blur-sm transition-colors focus:border-[#A85448] focus:ring-1 focus:ring-[#A85448]"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="whitespace-nowrap bg-[#A85448] px-6 py-3 font-sans text-[10px] font-medium tracking-[2px] uppercase text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85448]"
              >
                Đăng ký
              </button>
            </form>
          )}

          <p className="mt-4 font-sans text-[10px] text-[rgba(30,23,20,0.35)]">
            Không spam. Hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
