'use client'

import { type FC, useState } from 'react'
import Link from 'next/link'
import { Flower2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { signUp } from '@/lib/auth'
import GoogleButton from '@/components/auth/GoogleButton'

const RegisterPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading,    setIsLoading]    = useState(false)
  const [isSuccess,    setIsSuccess]    = useState(false)
  const [error,        setError]        = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email   : '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setIsLoading(false)
      return
    }

    const { error } = await signUp(form.email, form.password, form.fullName)

    if (error) {
      setError(
        error.message.includes('already registered')
          ? 'Email này đã được đăng ký'
          : 'Đã có lỗi xảy ra, vui lòng thử lại'
      )
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    setIsLoading(false)
  }

  // Thành công — yêu cầu xác nhận email
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#2D2D2D]">
            Xác nhận email của bạn
          </h2>
          <p className="text-muted">
            Mình đã gửi link xác nhận đến{' '}
            <strong className="text-[#2D2D2D]">{form.email}</strong>.
            Vui lòng kiểm tra hộp thư và click vào link để kích hoạt tài khoản.
          </p>
          <Link href="/login" className="btn-primary inline-block mt-4 px-8">
            Về trang đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Flower2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#2D2D2D]">
            Tạo tài khoản
          </h1>
          <p className="text-sm text-muted">
            Đăng ký để đặt hàng và theo dõi đơn hàng của bạn
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-card space-y-5">

          {/* Google */}
          <GoogleButton />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted">hoặc đăng ký bằng email</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium text-[#2D2D2D]">
                Họ và tên
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#2D2D2D]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="hello@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#2D2D2D]">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Ít nhất 6 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-11"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  suppressHydrationWarning
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#2D2D2D] transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye    className="h-4 w-4" />
                  }
                </button>
              </div>

              {/* Password strength hint */}
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < Math.min(4, Math.floor(form.password.length / 2))
                          ? form.password.length >= 10 ? 'bg-success'
                          : form.password.length >= 6  ? 'bg-warning'
                          : 'bg-danger'
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}

            {/* Terms */}
            <p className="text-xs text-muted">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Điều khoản sử dụng
              </Link>{' '}
              và{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Chính sách bảo mật
              </Link>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="btn-primary w-full py-3 text-base"
            >
              {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage