import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import type { CartItem } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { items, shipping_address, phone, note, total, payment_method, stripe_payment_id } = body

  if (!items?.length || !shipping_address || !phone || !total) {
    return NextResponse.json({ error: 'Thiếu thông tin đơn hàng' }, { status: 400 })
  }

  const admin = createSupabaseAdmin()

  // Kiểm tra tồn kho trước khi tạo đơn
  for (const item of items as CartItem[]) {
    const { data: product } = await admin
      .from('products')
      .select('stock, name')
      .eq('id', item.product.id)
      .single()

    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Sản phẩm "${item.product.name}" không đủ hàng trong kho` },
        { status: 400 }
      )
    }
  }

  // Tạo order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id          : session.user.id,
      status           : 'pending',
      total,
      shipping_address,
      phone,
      note             : note ?? null,
      stripe_payment_id: stripe_payment_id ?? null,
    })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message }, { status: 500 })
  }

  // Tạo order_items
  const orderItems = (items as CartItem[]).map((item) => ({
    order_id     : order.id,
    product_id   : item.product.id,
    product_name : item.product.name,
    product_image: item.product.image_url,
    quantity     : item.quantity,
    price        : item.product.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  // Giảm tồn kho cho từng sản phẩm
  for (const item of items as CartItem[]) {
    const { data: product } = await admin
      .from('products')
      .select('stock')
      .eq('id', item.product.id)
      .single()

    if (product) {
      await admin
        .from('products')
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq('id', item.product.id)
    }
  }

  return NextResponse.json({ data: order }, { status: 201 })
}

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}