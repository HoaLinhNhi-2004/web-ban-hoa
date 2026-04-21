import { createSupabaseServer } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createSupabaseServer()
  const { data: products, error } = await supabase.from('products').select('*')

  if (error) return <p>Lỗi kết nối: {error.message}</p>

  return (
    <main>
      <p>✅ Kết nối Supabase thành công! Có {products.length} sản phẩm.</p>
    </main>
  )
}