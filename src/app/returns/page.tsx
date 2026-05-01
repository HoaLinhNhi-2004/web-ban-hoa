export default function ReturnsPage() {
  return (
    <div className="container-shop py-16 max-w-prose">
      <div className="mb-6 flex items-center gap-3">
        <span className="block h-px w-5 bg-[#C4796A]" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">Hỗ trợ</span>
      </div>
      <h1 className="font-display text-4xl font-light text-[#1E1714] mb-8">Đổi trả & hoàn tiền</h1>
      <div className="space-y-6 font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.6)]">
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Điều kiện đổi trả</h2>
          <p>Chúng tôi hỗ trợ đổi trả trong vòng 24 giờ kể từ khi nhận hàng trong các trường hợp: hoa bị hỏng, không đúng loại đã đặt, hoặc thiếu sản phẩm.</p>
        </div>
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Quy trình đổi trả</h2>
          <p>Chụp ảnh sản phẩm và liên hệ hotline hoặc email trong vòng 24 giờ. Chúng tôi sẽ xác nhận và giao hàng đổi trả trong ngày.</p>
        </div>
        <div className="border-b border-[rgba(195,130,120,0.18)] pb-5">
          <h2 className="font-display text-lg font-light text-[#1E1714] mb-2">Hoàn tiền</h2>
          <p>Trường hợp không thể đổi hàng, chúng tôi hoàn tiền 100% trong vòng 3-5 ngày làm việc qua phương thức thanh toán ban đầu.</p>
        </div>
      </div>
    </div>
  )
}