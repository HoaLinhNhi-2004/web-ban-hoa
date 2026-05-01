import { createSupabaseServer } from '@/lib/supabase-server'
import BannerSliderClient from './BannerSliderClient'
import HeroBanner from './HeroBanner'
import type { Product } from '@/types'

const BannerSlider = async () => {
  const supabase = await createSupabaseServer()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, image_url, category, price')
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(5)

  if (!products || products.length === 0) return <HeroBanner />

  return <BannerSliderClient products={products as Product[]} />
}

export default BannerSlider
