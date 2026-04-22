import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Navbar      from '@/components/layout/Navbar'
import Footer      from '@/components/layout/Footer'
import CartSidebar from '@/components/cart/CartSidebar'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Flower Shop — Hoa tươi đẹp nhất mỗi ngày',
  description:
    'Mua hoa tươi online với đa dạng mẫu hoa đẹp — hoa sinh nhật, hoa cưới, hoa tặng. Giao hàng nhanh, giá tốt.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background flex min-h-screen flex-col">
        <Navbar />
        <CartSidebar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}