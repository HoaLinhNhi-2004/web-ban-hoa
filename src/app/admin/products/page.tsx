'use client'

import { type FC, useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Package, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import ProductForm         from '@/components/admin/ProductForm'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import type { Product } from '@/types'

const AdminProductsPage: FC = () => {
  const [products,      setProducts]      = useState<Product[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [showForm,      setShowForm]      = useState(false)
  const [editProduct,   setEditProduct]   = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [error,         setError]         = useState('')

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res  = await fetch('/api/products')
      const json = await res.json() as { data?: Product[] }
      setProducts(json.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { void fetchProducts() }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteProduct) return
    const res = await fetch(`/api/products/${deleteProduct.id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== deleteProduct.id))
      setDeleteProduct(null)
    } else {
      setError('Xóa thất bại — vui lòng thử lại')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditProduct(null)
    void fetchProducts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-light text-[#1E1714]">Sản phẩm</h1>
          <p className="mt-1 font-sans text-sm text-[rgba(30,23,20,0.4)]">
            {products.length} sản phẩm
          </p>
          {!isLoading && products.length > 0 && (
            <div className="mt-1 flex items-center gap-4 font-sans text-[11px] text-[rgba(30,23,20,0.4)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                {products.filter(p => p.stock === 0).length} hết hàng
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                {products.filter(p => p.stock > 0 && p.stock <= 5).length} sắp hết
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                {products.filter(p => p.stock > 5).length} còn hàng
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => void fetchProducts()}
            suppressHydrationWarning
            aria-label="Làm mới danh sách"
            className="flex h-9 w-9 items-center justify-center border border-[rgba(195,130,120,0.25)] text-[rgba(30,23,20,0.4)] hover:border-[#A85448] hover:text-[#A85448] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setEditProduct(null); setShowForm(true) }}
            suppressHydrationWarning
            className="flex items-center gap-2 bg-[#A85448] px-4 py-2 font-sans text-[10px] tracking-[2px] uppercase text-[#FAF8F5] hover:bg-[#8B3D33] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}

      {/* Table */}
      <div className="border border-[rgba(195,130,120,0.18)] bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(195,130,120,0.12)] bg-[rgba(168,84,72,0.02)]">
                {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Nổi bật', 'Thao tác'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-sans text-[9px] tracking-[3px] uppercase text-[rgba(30,23,20,0.35)] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(195,130,120,0.1)]">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-[rgba(195,130,120,0.1)]" />
                        </td>
                      ))}
                    </tr>
                  ))
                : products.map(product => (
                    <tr key={product.id} className="hover:bg-[rgba(168,84,72,0.02)] transition-colors">

                      {/* Tên + ảnh */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden border border-[rgba(195,130,120,0.14)] bg-[#F5EDE8]">
                            {product.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-4 w-4 text-[rgba(30,23,20,0.2)]" />
                              </div>
                            )}
                          </div>
                          <span className="max-w-[180px] truncate font-sans text-sm font-medium text-[#1E1714]">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 font-sans text-sm text-[rgba(30,23,20,0.5)]">{product.category}</td>

                      <td className="px-5 py-3 font-display text-[13px] text-[#A85448]">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-sans text-sm font-medium ${
                            product.stock === 0   ? 'text-red-500'
                            : product.stock <= 5  ? 'text-yellow-600'
                            : 'text-green-600'
                          }`}>
                            {product.stock === 0 ? 'Hết hàng' : product.stock}
                          </span>
                          <div className="hidden sm:block w-16 h-1.5 rounded-full bg-[rgba(195,130,120,0.15)] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                product.stock === 0  ? 'bg-red-400'
                                : product.stock <= 5 ? 'bg-yellow-400'
                                : 'bg-green-400'
                              }`}
                              style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        {product.is_featured
                          ? <span className="inline-block bg-[rgba(168,84,72,0.1)] px-2.5 py-0.5 font-sans text-[10px] tracking-[1px] uppercase text-[#A85448]">Có</span>
                          : <span className="text-[rgba(30,23,20,0.3)]">—</span>
                        }
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditProduct(product); setShowForm(true) }}
                            suppressHydrationWarning
                            aria-label={`Sửa ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center border border-[rgba(195,130,120,0.2)] text-[rgba(30,23,20,0.4)] hover:border-[#A85448] hover:text-[#A85448] transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteProduct(product)}
                            suppressHydrationWarning
                            aria-label={`Xóa ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center border border-[rgba(195,130,120,0.2)] text-[rgba(30,23,20,0.4)] hover:border-red-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ProductForm
          product={editProduct ?? undefined}
          onClose={handleFormClose}
        />
      )}

      {deleteProduct && (
        <DeleteConfirmDialog
          productName={deleteProduct.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteProduct(null)}
        />
      )}
    </div>
  )
}

export default AdminProductsPage
