const STEPS = [
  { num: '01', title: 'Chọn hoa',       desc: 'Duyệt qua bộ sưu tập và chọn loại hoa phù hợp với dịp của bạn.' },
  { num: '02', title: 'Thêm vào giỏ',   desc: 'Click nút + để thêm sản phẩm vào giỏ hàng. Bạn có thể điều chỉnh số lượng.' },
  { num: '03', title: 'Điền thông tin', desc: 'Nhập địa chỉ giao hàng, số điện thoại và ghi chú nếu có yêu cầu đặc biệt.' },
  { num: '04', title: 'Thanh toán',     desc: 'Chọn thanh toán khi nhận hàng (COD) hoặc thanh toán online qua thẻ tín dụng.' },
  { num: '05', title: 'Nhận hoa',       desc: 'Chúng tôi sẽ giao hoa đến bạn trong vòng 2 tiếng. Theo dõi đơn hàng tại trang Tài khoản.' },
]

export default function GuidePage() {
  return (
    <div className="container-shop py-16 max-w-prose">
      <div className="mb-6 flex items-center gap-3">
        <span className="block h-px w-5 bg-[#C4796A]" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">Hỗ trợ</span>
      </div>
      <h1 className="font-display text-4xl font-light text-[#1E1714] mb-8">Hướng dẫn đặt hàng</h1>
      <div className="space-y-8">
        {STEPS.map(step => (
          <div key={step.num} className="flex gap-5">
            <span className="font-display text-3xl font-light text-[rgba(168,84,72,0.25)] flex-shrink-0 w-10">
              {step.num}
            </span>
            <div>
              <h2 className="font-display text-lg font-light text-[#1E1714] mb-1">{step.title}</h2>
              <p className="font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.6)]">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}