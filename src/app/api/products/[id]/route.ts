import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'

type Context = { params: Promise<{ id: string }> }

async function checkAdmin(supabase: Awaited<ReturnType<typeof createSupabaseServer>>) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  const { data } = await supabase
    .from('profiles').select('role').eq('id', session.user.id).single()
  return data?.role === 'admin'
}

export async function PUT(request: NextRequest, { params }: Context) {
  const supabase = await createSupabaseServer()
  if (!await checkAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json() as {
    name: string; price: number; description?: string
    image_url?: string; category: string; stock?: number; is_featured?: boolean
  }
  const { name, price, description, image_url, category, stock, is_featured } = body

  const admin = createSupabaseAdmin()
  const { data, error } = await admin
    .from('products')
    .update({
      name,
      price      : Number(price),
      description: description ?? null,
      image_url  : image_url ?? null,
      category,
      stock      : Number(stock ?? 0),
      is_featured: Boolean(is_featured),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const supabase = await createSupabaseServer()
  if (!await checkAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const admin = createSupabaseAdmin()
  const { error } = await admin.from('products').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
