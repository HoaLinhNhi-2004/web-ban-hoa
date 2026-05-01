export default function ShippingPage() {
  return (
    <div className="container-shop py-16 max-w-prose">
      <div className="mb-6 flex items-center gap-3">
        <span className="block h-px w-5 bg-[#C4796A]" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">Hỗ trợ</span>
      </div>
      <h1 className="font-display text-4xl font-light text-[#1E1714] mb-8">Chính sách giao hàng</h1>
      <div className="space-y-6 font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.6)]">
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Thời gian giao hàng</h2>
          <p>Nội thành TP.HCM và Hà Nội: giao trong vòng 2 tiếng kể từ khi xác nhận đơn. Các tỉnh thành khác: 1-3 ngày làm việc.</p>
        </div>
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Phí giao hàng</h2>
          <p>Phí giao hàng 30.000đ cho đơn dưới 500.000đ. Miễn phí giao hàng cho đơn từ 500.000đ trở lên.</p>
        </div>
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Lưu ý khi nhận hàng</h2>
          <p>Vui lòng kiểm tra hoa ngay khi nhận. Nếu hoa bị hỏng hoặc không đúng mô tả, liên hệ ngay trong vòng 1 tiếng để được hỗ trợ.</p>
        </div>
      </div>
    </div>
  )
}