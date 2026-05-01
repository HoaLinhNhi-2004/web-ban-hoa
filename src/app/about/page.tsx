export default function AboutPage() {
  return (
    <div className="container-shop py-16 max-w-prose">
      <div className="mb-6 flex items-center gap-3">
        <span className="block h-px w-5 bg-[#C4796A]" />
        <span className="font-sans text-[9px] tracking-[5px] uppercase text-[#C4796A]">Flower Shop</span>
      </div>
      <h1 className="font-display text-4xl font-light text-[#1E1714] mb-6">Về chúng tôi</h1>
      <div className="space-y-4 font-sans text-sm font-light leading-relaxed text-[rgba(30,23,20,0.6)]">
        <p>Flower Shop được thành lập với sứ mệnh mang đến những bông hoa tươi đẹp nhất đến tay khách hàng một cách nhanh chóng và tiện lợi nhất.</p>
        <p>Chúng tôi chuyên cung cấp hoa tươi nhập khẩu cao cấp từ Ecuador, Hà Lan và các vùng trồng hoa nổi tiếng thế giới. Mỗi bó hoa đều được tuyển chọn kỹ lưỡng, đảm bảo độ tươi và thẩm mỹ cao nhất.</p>
        <p>Với đội ngũ giao hàng chuyên nghiệp, chúng tôi cam kết giao hoa trong vòng 2 tiếng tại nội thành — đúng giờ, đúng địa chỉ, đúng cảm xúc.</p>
      </div>
    </div>
  )
}