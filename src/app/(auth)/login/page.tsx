'use client'

import { type FC, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Flower2, Eye, EyeOff } from 'lucide-react'
import { signIn, resendConfirmation } from '@/lib/auth'
import GoogleButton from '@/components/auth/GoogleButton'

const LoginForm: FC = () => {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('redirect') ?? '/'
  const [showPassword,      setShowPassword]      = useState(false)
  const [isLoading,         setIsLoading]         = useState(false)
  const [isResending,       setIsResending]        = useState(false)
  const [resendSuccess,     setResendSuccess]      = useState(false)
  const [emailUnconfirmed,  setEmailUnconfirmed]   = useState(false)
  const [error,             setError]              = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setEmailUnconfirmed(false)
    setResendSuccess(false)
  }

  const handleResend = async () => {
    setIsResending(true)
    const { error } = await resendConfirmation(form.email)
    setIsResending(false)
    if (!error) {
      setResendSuccess(true)
    } else {
      setError('Không thể gửi lại email. Vui lòng thử lại sau.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error } = await signIn(form.email, form.password)

    if (error) {
      if (
        error.message.toLowerCase().includes('email not confirmed') ||
        error.message.toLowerCase().includes('email_not_confirmed')
      ) {
        setEmailUnconfirmed(true)
      } else {
        setError(
          error.message.includes('Invalid login credentials')
            ? 'Email hoặc mật khẩu không đúng'
            : 'Đã có lỗi xảy ra, vui lòng thử lại'
        )
      }
      setIsLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
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
            Đăng nhập
          </h1>
          <p className="text-sm text-muted">
            Chào mừng bạn trở lại Flower Shop 🌸
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-card space-y-5">

          {/* Google */}
          <GoogleButton />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted">hoặc đăng nhập bằng email</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[#2D2D2D]">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
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
            </div>

            {/* Error */}
            {error && (
              <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}

            {/* Email chưa xác nhận */}
            {emailUnconfirmed && (
              <div role="alert" className="rounded-lg bg-warning/10 px-4 py-3 space-y-2">
                <p className="text-sm text-warning font-medium">
                  Email chưa được xác nhận
                </p>
                <p className="text-xs text-warning/80">
                  Vui lòng kiểm tra hộp thư{' '}
                  <strong>{form.email}</strong>{' '}
                  và click vào link xác nhận.
                </p>
                {resendSuccess ? (
                  <p className="text-xs text-success font-medium">
                    ✓ Đã gửi lại email xác nhận!
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleResend()}
                    disabled={isResending}
                    className="text-xs font-medium text-warning underline hover:no-underline disabled:opacity-50"
                  >
                    {isResending ? 'Đang gửi...' : 'Gửi lại email xác nhận'}
                  </button>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="btn-primary w-full py-3 text-base"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-muted">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const LoginPage: FC = () => (
  <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background" />}>
    <LoginForm />
  </Suspense>
)

export default LoginPage