const FAQS = [
  { q: 'Thời gian giao hàng là bao lâu?',        a: 'Chúng tôi giao hàng trong vòng 2 tiếng tại nội thành TP.HCM và Hà Nội. Các tỉnh thành khác từ 1-3 ngày làm việc.' },
  { q: 'Hoa có tươi lâu không?',                  a: 'Hoa tươi của chúng tôi được nhập khẩu trực tiếp và bảo quản đúng cách, đảm bảo tươi từ 5-7 ngày nếu chăm sóc đúng hướng dẫn.' },
  { q: 'Tôi có thể đặt hoa theo yêu cầu không?', a: 'Có! Bạn có thể ghi chú yêu cầu trong phần ghi chú khi đặt hàng, hoặc liên hệ hotline để được tư vấn thiết kế riêng.' },
  { q: 'Chính sách đổi trả như thế nào?',         a: 'Chúng tôi hỗ trợ đổi trả trong vòng 24 giờ nếu hoa không đúng mô tả hoặc bị hỏng trong quá trình giao hàng.' },
  { q: 'Có giao hàng vào cuối tuần không?',       a: 'Có! Chúng tôi giao hàng 7 ngày/tuần, kể cả lễ tết từ 7:00 – 21:00.' },
]

export default function FAQPage() {
  return (
    <div className="container-shop py-16 max-w-prose">
      <div className="mb-6 flex items-center gap-3">
        <span className="block h-px w-5 bg-[#C4796A]" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">Hỗ trợ</span>
      </div>
      <h1 className="font-display text-4xl font-light text-[#1E1714] mb-8">Câu hỏi thường gặp</h1>
      <div className="space-y-6">
        {FAQS.map((item, i) => (
          <div key={i} className="border-b border-[rgba(195,130,120,0.18)] pb-6">
            <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">{item.q}</h2>
            <p className="font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.6)]">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}