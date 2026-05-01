import { type FC } from 'react'
import { Star } from 'lucide-react'

const REVIEWS = [
  {
    name   : 'Nguyễn Minh Anh',
    date   : 'Tháng 4, 2025',
    text   : 'Hoa đẹp hơn cả trong ảnh, giao đúng giờ hẹn, đóng gói rất cẩn thận. Mình rất hài lòng và chắc chắn sẽ quay lại shop nhiều lần nữa!',
    rating : 5,
    initial: 'A',
  },
  {
    name   : 'Trần Thu Hà',
    date   : 'Tháng 3, 2025',
    text   : 'Đặt hoa tặng sinh nhật bạn thân, shop tư vấn rất nhiệt tình. Hoa tươi lâu hơn 5 ngày, bạn mình thích lắm. Cực kỳ ưng ý!',
    rating : 5,
    initial: 'H',
  },
  {
    name   : 'Lê Hoàng Khoa',
    date   : 'Tháng 3, 2025',
    text   : 'Tặng hoa cho vợ nhân kỷ niệm ngày cưới, cô ấy xúc động lắm. Bó hoa cắm rất nghệ thuật, hương thơm dịu nhẹ rất đặc biệt.',
    rating : 5,
    initial: 'K',
  },
]

const TestimonialsSection: FC = () => (
  <section aria-label="Đánh giá khách hàng" className="container-shop py-12 md:py-16">

    {/* Heading */}
    <div className="mb-8 flex flex-col items-center text-center">
      <div className="mb-3 flex items-center gap-4">
        <span className="block h-px w-10 bg-[rgba(196,121,106,0.4)]" aria-hidden="true" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">
          Đánh giá
        </span>
        <span className="block h-px w-10 bg-[rgba(196,121,106,0.4)]" aria-hidden="true" />
      </div>
      <h2 className="font-display text-[28px] font-light text-[#1E1714] md:text-[36px]">
        Khách hàng nói gì về chúng tôi
      </h2>
    </div>

    {/* Cards */}
    <div className="grid gap-4 md:grid-cols-3">
      {REVIEWS.map(({ name, date, text, rating, initial }) => (
        <article
          key={name}
          className="flex flex-col gap-4 rounded-2xl border border-[rgba(195,130,120,0.16)] bg-[#FFFDF9] p-6"
        >
          {/* Stars */}
          <div
            className="flex items-center gap-0.5"
            aria-label={`${rating} sao`}
            role="img"
          >
            {Array.from({ length: rating }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]"
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Quote */}
          <p className="flex-1 font-sans text-[13px] font-light leading-relaxed text-[rgba(30,23,20,0.6)]">
            <span
              className="font-display text-xl leading-none text-[rgba(168,84,72,0.25)]"
              aria-hidden="true"
            >
              "
            </span>
            {text}
            <span
              className="font-display text-xl leading-none text-[rgba(168,84,72,0.25)]"
              aria-hidden="true"
            >
              "
            </span>
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 border-t border-[rgba(195,130,120,0.14)] pt-4">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(168,84,72,0.08)] font-display text-sm text-[#A85448]"
              aria-hidden="true"
            >
              {initial}
            </div>
            <div>
              <p className="font-sans text-[12px] font-medium text-[#1E1714]">{name}</p>
              <p className="font-sans text-[10px] text-[rgba(30,23,20,0.4)]">{date}</p>
            </div>
          </div>
        </article>
      ))}
    </div>

  </section>
)

export default TestimonialsSection
