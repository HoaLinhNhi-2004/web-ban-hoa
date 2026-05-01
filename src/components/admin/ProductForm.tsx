'use client'

import { type FC, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Upload, ImageOff } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import type { Product } from '@/types'

interface ProductFormProps {
  product?: Product
  onClose : () => void
}

const ProductForm: FC<ProductFormProps> = ({ product, onClose }) => {
  const router  = useRouter()
  const isEdit  = Boolean(product)
  const fileRef = useRef<HTMLInputElement>(null)

  const [isLoading,   setIsLoading]   = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error,       setError]       = useState('')
  const [previewUrl,  setPreviewUrl]  = useState(product?.image_url ?? '')
  const [form, setForm] = useState({
    name       : product?.name        ?? '',
    price      : product?.price       ?? '',
    description: product?.description ?? '',
    image_url  : product?.image_url   ?? '',
    category   : product?.category    ?? CATEGORIES[0],
    stock      : product?.stock       ?? 0,
    is_featured: product?.is_featured ?? false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh (jpg, png, webp)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh không được vượt quá 5MB')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) {
        setError('Chưa cấu hình Cloudinary — thêm NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME vào .env.local')
        setIsUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'flower_shop')
      formData.append('folder', 'flower-shop/products')

      const res  = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json() as { secure_url?: string }

      if (data.secure_url) {
        setForm(prev => ({ ...prev, image_url: data.secure_url! }))
        setPreviewUrl(data.secure_url!)
      } else {
        setError('Upload ảnh thất bại — kiểm tra Cloudinary preset "flower_shop"')
      }
    } catch {
      setError('Upload ảnh thất bại — kiểm tra kết nối')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim())       { setError('Vui lòng nhập tên sản phẩm'); return }
    if (!form.price)             { setError('Vui lòng nhập giá'); return }
    if (Number(form.price) <= 0) { setError('Giá phải lớn hơn 0'); return }

    setIsLoading(true)
    try {
      const url    = isEdit ? `/api/products/${product!.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(form),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) { setError(json.error ?? 'Lưu thất bại'); return }

      router.refresh()
      onClose()
    } catch {
      setError('Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FAF8F5] border border-[rgba(195,130,120,0.2)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(195,130,120,0.18)] px-6 py-4">
          <h2 className="font-display text-xl font-light text-[#1E1714]">
            {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            suppressHydrationWarning
            className="flex h-8 w-8 items-center justify-center text-[rgba(30,23,20,0.4)] hover:text-[#A85448] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">

            {/* Tên sản phẩm */}
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="name" className="block font-sans text-[11px] tracking-[2px] uppercase text-[rgba(30,23,20,0.45)]">
                Tên sản phẩm *
              </label>
              <input
                id="name" name="name" type="text" required
                value={form.name} onChange={handleChange}
                placeholder="VD: Hoa Hồng Đỏ Ecuador"
                className="w-full border border-[rgba(195,130,120,0.25)] bg-transparent px-4 py-2.5 text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.2)]"
              />
            </div>

            {/* Giá */}
            <div className="space-y-1.5">
              <label htmlFor="price" className="block font-sans text-[11px] tracking-[2px] uppercase text-[rgba(30,23,20,0.45)]">
                Giá (VND) *
              </label>
              <input
                id="price" name="price" type="number" required min="0"
                value={form.price} onChange={handleChange}
                placeholder="250000"
                className="w-full border border-[rgba(195,130,120,0.25)] bg-transparent px-4 py-2.5 text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.2)]"
              />
              {form.price && Number(form.price) > 0 && (
                <p className="text-xs text-[rgba(30,23,20,0.4)]">{formatPrice(Number(form.price))}</p>
              )}
            </div>

            {/* Tồn kho */}
            <div className="space-y-1.5">
              <label htmlFor="stock" className="block font-sans text-[11px] tracking-[2px] uppercase text-[rgba(30,23,20,0.45)]">
                Tồn kho
              </label>
              <input
                id="stock" name="stock" type="number" min="0" step="1"
                value={form.stock} onChange={handleChange}
                className="w-full border border-[rgba(195,130,120,0.25)] bg-transparent px-4 py-2.5 text-sm text-[#1E1714] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.2)]"
              />
              {Number(form.stock) === 0 && (
                <p className="text-[11px] text-red-500">⚠️ Sản phẩm sẽ bị đánh dấu hết hàng</p>
              )}
              {Number(form.stock) > 0 && Number(form.stock) <= 5 && (
                <p className="text-[11px] text-yellow-600">⚠️ Tồn kho thấp — cân nhắc nhập thêm</p>
              )}
            </div>

            {/* Danh mục */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block font-sans text-[11px] tracking-[2px] uppercase text-[rgba(30,23,20,0.45)]">
                Danh mục *
              </label>
              <select
                id="category" name="category"
                value={form.category as string} onChange={handleChange}
                className="w-full border border-[rgba(195,130,120,0.25)] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#1E1714] focus:border-[#A85448] focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Nổi bật */}
            <div className="flex items-center gap-3 self-end pb-2.5">
              <input
                id="is_featured" name="is_featured" type="checkbox"
                checked={form.is_featured as boolean}
                onChange={handleChange}
                className="h-4 w-4 accent-[#A85448]"
              />
              <label htmlFor="is_featured" className="font-sans text-sm text-[rgba(30,23,20,0.6)]">
                Đánh dấu nổi bật
              </label>
            </div>

            {/* Mô tả */}
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="description" className="block font-sans text-[11px] tracking-[2px] uppercase text-[rgba(30,23,20,0.45)]">
                Mô tả
              </label>
              <textarea
                id="description" name="description" rows={3}
                value={form.description as string} onChange={handleChange}
                placeholder="Mô tả ngắn về sản phẩm..."
                className="w-full resize-none border border-[rgba(195,130,120,0.25)] bg-transparent px-4 py-2.5 text-sm text-[#1E1714] placeholder:text-[rgba(30,23,20,0.3)] focus:border-[#A85448] focus:outline-none focus:ring-1 focus:ring-[rgba(168,84,72,0.2)]"
              />
            </div>

            {/* Upload ảnh */}
            <div className="col-span-2 space-y-1.5">
              <label className="block font-sans text-[11px] tracking-[2px] uppercase text-[rgba(30,23,20,0.45)]">
                Ảnh sản phẩm
              </label>
              <div className="flex gap-4">
                {/* Preview */}
                <div className={cn(
                  'h-24 w-24 flex-shrink-0 overflow-hidden border border-[rgba(195,130,120,0.2)] bg-[#F5EDE8] flex items-center justify-center',
                )}>
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Preview ảnh sản phẩm" className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff className="h-6 w-6 text-[rgba(30,23,20,0.2)]" />
                  )}
                </div>

                {/* Upload */}
                <div className="flex flex-col justify-center gap-2">
                  <input
                    ref={fileRef} type="file" accept="image/*"
                    onChange={handleImageUpload} className="hidden"
                    aria-label="Chọn ảnh sản phẩm"
                  />
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => fileRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 border border-[rgba(168,84,72,0.3)] px-4 py-2 font-sans text-[10px] tracking-[2px] uppercase text-[#A85448] transition-colors hover:bg-[rgba(168,84,72,0.06)] disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {isUploading ? 'Đang upload...' : 'Chọn ảnh'}
                  </button>
                  <p className="font-sans text-[11px] text-[rgba(30,23,20,0.35)]">
                    JPG, PNG, WEBP · Tối đa 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p role="alert" className="rounded bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-[rgba(195,130,120,0.15)] pt-5">
            <button
              type="button"
              suppressHydrationWarning
              onClick={onClose}
              className="border border-[rgba(168,84,72,0.25)] px-6 py-2.5 font-sans text-[10px] tracking-[2px] uppercase text-[rgba(30,23,20,0.5)] transition-colors hover:border-[#A85448] hover:text-[#A85448]"
            >
              Hủy
            </button>
            <button
              type="submit"
              suppressHydrationWarning
              disabled={isLoading}
              className="bg-[#A85448] px-6 py-2.5 font-sans text-[10px] tracking-[2px] uppercase text-[#FAF8F5] transition-colors hover:bg-[#8B3D33] disabled:opacity-50"
            >
              {isLoading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
