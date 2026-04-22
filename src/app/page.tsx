export default function Home() {
  return (
    <main className="container-shop py-16">
      <h1 className="font-display text-5xl text-primary">
        🌸 Flower Shop
      </h1>
      <p className="mt-4 text-muted">
        Hoa tươi đẹp nhất mỗi ngày
      </p>
      <div className="mt-8 flex gap-4">
        <button className="btn-primary">Mua ngay</button>
        <button className="btn-secondary">Xem thêm</button>
      </div>
      <div className="mt-6">
        <span className="badge">Hoa hồng</span>
      </div>
    </main>
  )
}