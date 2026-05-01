'use client'

import { type FC, useEffect, useState } from 'react'
import { User, Phone, MapPin, Mail, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isValidPhone } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'

const AccountPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving,  setIsSaving]  = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')
  const [email,     setEmail]     = useState('')
  const [form, setForm] = useState({
    full_name: '',
    phone    : '',
    address  : '',
  })

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      setEmail(session.user.email ?? '')

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setForm({
          full_name: data.full_name ?? '',
          phone    : data.phone    ?? '',
          address  : data.address  ?? '',
        })
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (form.phone && !isValidPhone(form.phone)) {
      setError('Số điện thoại không hợp lệ (phải bắt đầu bằng 0, đủ 10 số)')
      return
    }

    setIsSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        phone    : form.phone,
        address  : form.address,
      })
      .eq('id', session.user.id)

    if (updateError) {
      setError('Cập nhật thất bại, vui lòng thử lại')
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setIsSaving(false)
  }

  return (
    <div className="container-shop py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />

        <main className="flex-1 min-w-0">
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <h1 className="font-display text-2xl font-bold text-[#2D2D2D] mb-6">
              Thông tin cá nhân
            </h1>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-border" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Email — readonly */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted" /> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    aria-readonly="true"
                    className="input-field cursor-not-allowed bg-background text-muted"
                  />
                  <p className="text-xs text-muted">Email không thể thay đổi</p>
                </div>

                {/* Họ tên */}
                <div className="space-y-1.5">
                  <label htmlFor="full_name" className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted" /> Họ và tên
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                    className="input-field"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted" /> Số điện thoại
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0901234567"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="input-field"
                  />
                </div>

                {/* Địa chỉ */}
                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-sm font-medium text-[#2D2D2D] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted" /> Địa chỉ mặc định
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Số nhà, đường, phường, quận, tỉnh"
                    value={form.address}
                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    className="input-field"
                  />
                </div>

                {/* Error / Success */}
                {error && (
                  <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
                    {error}
                  </p>
                )}
                {success && (
                  <p role="status" className="rounded-lg bg-success/10 px-4 py-2.5 text-sm text-success font-medium">
                    ✅ Cập nhật thành công!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2 px-8"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AccountPage