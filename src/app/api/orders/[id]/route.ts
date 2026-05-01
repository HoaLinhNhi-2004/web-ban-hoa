import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import { ORDER_STATUSES } from '@/types'
import type { OrderStatus } from '@/types'

type Context = { params: Promise<{ id: string }> }

async function checkAdmin(supabase: Awaited<ReturnType<typeof createSupabaseServer>>) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  const { data } = await supabase
    .from('profiles').select('role').eq('id', session.user.id).single()
  return data?.role === 'admin'
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const supabase = await createSupabaseServer()
  if (!await checkAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json() as { status?: string; internal_note?: string }
  const { status, internal_note } = body

  if (status !== undefined && !ORDER_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 })
  }

  const updateData: { status?: OrderStatus; internal_note?: string } = {}
  if (status        !== undefined) updateData.status        = status as OrderStatus
  if (internal_note !== undefined) updateData.internal_note = internal_note

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Không có gì để cập nhật' }, { status: 400 })
  }

  const admin = createSupabaseAdmin()
  const { data, error } = await admin
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
