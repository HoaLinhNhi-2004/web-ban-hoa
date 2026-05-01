'use client'

import { type FC, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  productName : string
  onConfirm   : () => Promise<void>
  onCancel    : () => void
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({ productName, onConfirm, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    await onConfirm()
    setIsLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Xác nhận xóa sản phẩm"
    >
      <div className="w-full max-w-sm bg-[#FAF8F5] border border-[rgba(195,130,120,0.2)] p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="font-display text-lg font-light text-[#1E1714]">Xóa sản phẩm</h2>
        </div>
        <p className="mb-6 font-sans text-sm text-[rgba(30,23,20,0.55)]">
          Bạn có chắc muốn xóa{' '}
          <strong className="text-[#1E1714]">&ldquo;{productName}&rdquo;</strong>?
          Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            suppressHydrationWarning
            className="border border-[rgba(168,84,72,0.25)] px-5 py-2 font-sans text-[10px] tracking-[2px] uppercase text-[rgba(30,23,20,0.5)] hover:border-[#A85448] hover:text-[#A85448] transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            suppressHydrationWarning
            disabled={isLoading}
            className="bg-red-500 px-5 py-2 font-sans text-[10px] tracking-[2px] uppercase text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmDialog
