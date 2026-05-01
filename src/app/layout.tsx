import type { Metadata } from 'next'
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google'
import Navbar      from '@/components/layout/Navbar'
import Footer      from '@/components/layout/Footer'
import CartSidebar from '@/components/cart/CartSidebar'
import ChatWidget  from '@/components/chat/ChatWidget'
import './globals.css'

const playfair = Playfair_Display({
  subsets : ['latin', 'vietnamese'],
  weight  : ['400', '500', '700'],
  style   : ['normal', 'italic'],
  variable: '--font-playfair',
  display : 'swap',
})

const beVietnam = Be_Vietnam_Pro({
  subsets : ['latin', 'vietnamese'],
  weight  : ['300', '400', '500', '600'],
  variable: '--font-be-vietnam',
  display : 'swap',
})

export const metadata: Metadata = {
  title: 'Flower Shop — Hoa tươi đẹp nhất mỗi ngày',
  description:
    'Mua hoa tươi online với đa dạng mẫu hoa đẹp — hoa sinh nhật, hoa cưới, hoa tặng. Giao hàng nhanh, giá tốt.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnam.variable}`}>
      <body className="font-sans antialiased bg-[#FAF8F5] flex min-h-screen flex-col">
        <Navbar />
        <CartSidebar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
