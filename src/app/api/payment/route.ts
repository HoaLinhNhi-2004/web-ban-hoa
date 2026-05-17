import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe-server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { amount } = body

  if (!amount || amount < 10000) {
    return NextResponse.json({ error: 'Số tiền không hợp lệ' }, { status: 400 })
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount  : Math.round(amount), // VND, không nhân 100
    currency: 'vnd',
    metadata: { user_id: session.user.id },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  })
}