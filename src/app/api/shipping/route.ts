import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { address } = body as { address?: string }

  if (!address?.trim()) {
    return NextResponse.json({ error: 'Thiếu địa chỉ' }, { status: 400 })
  }

  const supabase = await createSupabaseServer()
  const { data: zones } = await supabase
    .from('shipping_zones')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (!zones?.length) {
    return NextResponse.json({ data: { name: 'Mặc định', fee: 30000 } })
  }

  const lowerAddress = address.toLowerCase()
  const matched = zones.find((zone: { keywords: string[] }) =>
    zone.keywords.some((kw: string) => lowerAddress.includes(kw.toLowerCase()))
  )

  const zone = matched ?? zones[zones.length - 1]

  return NextResponse.json({
    data: { name: zone.name, fee: zone.fee },
  })
}
