export default function ContactPage() {
  return (
    <div className="container-shop py-16 max-w-prose">
      <div className="mb-6 flex items-center gap-3">
        <span className="block h-px w-5 bg-[#C4796A]" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">Hỗ trợ</span>
      </div>
      <h1 className="font-display text-4xl font-light text-[#1E1714] mb-8">Liên hệ</h1>
      <div className="space-y-4 font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.6)]">
        <div className="flex gap-3"><span className="text-[#A85448]">📍</span><span>123 Đường Hoa, Quận 1, TP.HCM</span></div>
        <div className="flex gap-3"><span className="text-[#A85448]">📞</span><a href="tel:0901234567" className="hover:text-[#A85448] transition-colors">0901 234 567</a></div>
        <div className="flex gap-3"><span className="text-[#A85448]">✉️</span><a href="mailto:hello@flowershop.vn" className="hover:text-[#A85448] transition-colors">hello@flowershop.vn</a></div>
        <div className="flex gap-3"><span className="text-[#A85448]">🕐</span><span>Thứ 2 – Chủ nhật: 7:00 – 21:00</span></div>
      </div>
    </div>
  )
}