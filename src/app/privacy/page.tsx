export default function PrivacyPage() {
  return (
    <div className="container-shop py-16 max-w-prose">
      <div className="mb-6 flex items-center gap-3">
        <span className="block h-px w-5 bg-[#C4796A]" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">Pháp lý</span>
      </div>
      <h1 className="font-display text-4xl font-light text-[#1E1714] mb-8">Chính sách bảo mật</h1>
      <div className="space-y-6 font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.6)]">
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Thu thập thông tin</h2>
          <p>Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng: họ tên, số điện thoại, địa chỉ giao hàng và email.</p>
        </div>
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Sử dụng thông tin</h2>
          <p>Thông tin của bạn chỉ được dùng để xử lý đơn hàng và liên lạc khi cần thiết. Chúng tôi không chia sẻ thông tin với bên thứ ba.</p>
        </div>
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Bảo mật dữ liệu</h2>
          <p>Toàn bộ dữ liệu được mã hóa và lưu trữ an toàn trên Supabase với tiêu chuẩn bảo mật cao nhất.</p>
        </div>
      </div>
    </div>
  )
}