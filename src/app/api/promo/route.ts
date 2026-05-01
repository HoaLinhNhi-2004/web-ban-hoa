import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { code, subtotal } = body as { code?: string; subtotal?: number }

  if (!code?.trim()) {
    return NextResponse.json({ error: 'Vui lòng nhập mã giảm giá' }, { status: 400 })
  }

  const supabase = await createSupabaseServer()
  const { data: promo } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single()

  if (!promo) {
    return NextResponse.json({ error: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' }, { status: 400 })
  }

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Mã giảm giá đã hết hạn' }, { status: 400 })
  }

  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng' }, { status: 400 })
  }

  const orderTotal = subtotal ?? 0
  if (orderTotal < promo.min_order) {
    const minFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.min_order)
    return NextResponse.json(
      { error: `Đơn hàng tối thiểu ${minFormatted} để dùng mã này` },
      { status: 400 }
    )
  }

  const discount = promo.type === 'percent'
    ? Math.round(orderTotal * promo.value / 100)
    : Math.min(promo.value, orderTotal)

  return NextResponse.json({
    data: {
      code    : promo.code,
      type    : promo.type,
      value   : promo.value,
      discount,
    },
  })
}
