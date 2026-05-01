'use client'

import { type FC, useState } from 'react'
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import AccountSidebar from '@/components/account/AccountSidebar'

function getStrength(pw: string): { level: number; label: string; pct: number; color: string } {
  if (!pw) return { level: 0, label: '', pct: 0, color: '' }
  let score = 0
  if (pw.length >= 6)  score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const meta = [
    { label: '', color: '' },
    { label: 'Quá yếu',    color: '#EF4444' },
    { label: 'Yếu',        color: '#F59E0B' },
    { label: 'Khá tốt',    color: '#E8738A' },
    { label: 'Mạnh',       color: '#22C55E' },
  ]
  return { level: score, pct: score * 25, ...meta[score] }
}

const PasswordPage: FC = () => {
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSaving,    setIsSaving]    = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [error,       setError]       = useState('')
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })

  const strength = getStrength(form.newPassword)
  const mismatch  = form.confirmPassword.length > 0 && form.confirmPassword !== form.newPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (form.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setIsSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: form.newPassword })

    if (updateError) {
      setError('Đổi mật khẩu thất bại: ' + updateError.message)
    } else {
      setSuccess(true)
      setForm({ newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(false), 4000)
    }
    setIsSaving(false)
  }

  return (
    <>
      {/* Component-scoped keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pw-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pw-petal-a {
          0%,100% { transform: translateY(0)   rotate(0deg)   scale(1);    opacity:.18; }
          50%     { transform: translateY(-14px) rotate(18deg) scale(1.06); opacity:.3;  }
        }
        @keyframes pw-petal-b {
          0%,100% { transform: translateY(0) rotate(0deg);   opacity:.12; }
          33%     { transform: translateY(-9px) rotate(-12deg); opacity:.22; }
          66%     { transform: translateY(7px)  rotate(9deg);  opacity:.14; }
        }
        @keyframes pw-petal-c {
          0%,100% { transform: translateY(0) rotate(0deg);    opacity:.1;  }
          50%     { transform: translateY(-6px) rotate(-20deg); opacity:.18; }
        }
        @keyframes pw-bloom {
          0%   { transform: scale(0) rotate(-90deg); opacity:0; }
          60%  { transform: scale(1.18) rotate(6deg); opacity:1; }
          100% { transform: scale(1)   rotate(0deg);  opacity:1; }
        }
        @keyframes pw-slide-up {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes pw-check-draw {
          from { stroke-dashoffset: 30; }
          to   { stroke-dashoffset: 0;  }
        }
        .pw-bar-fill  { transition: width .55s cubic-bezier(.4,0,.2,1), background-color .3s ease; }
        .pw-petal-a   { animation: pw-petal-a 6.5s ease-in-out infinite;        }
        .pw-petal-b   { animation: pw-petal-b 8s   ease-in-out infinite 1.2s;   }
        .pw-petal-c   { animation: pw-petal-c 7.2s ease-in-out infinite 3s;     }
        .pw-slide-up  { animation: pw-slide-up .32s ease-out forwards;           }
        .pw-bloom-icon{ animation: pw-bloom   .65s cubic-bezier(.34,1.56,.64,1) forwards; }
        .pw-check     { stroke-dasharray:30; animation: pw-check-draw .5s .4s ease-out forwards; stroke-dashoffset:30; }
      ` }} />

      <div className="container-shop py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <AccountSidebar />

          <main className="flex-1 min-w-0">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">

              {/* Animated gradient top stripe */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{
                  background: 'linear-gradient(90deg,#E8738A,#F9B9C5,#FF4D6D,#F9B9C5,#E8738A)',
                  backgroundSize: '200% 100%',
                  animation: 'pw-shimmer 4s linear infinite',
                }}
              />

              {/* Decorative petals — top-right quadrant */}
              <div aria-hidden="true" className="pointer-events-none select-none">
                {/* Large petal */}
                <div className="pw-petal-a absolute right-6 top-6 h-20 w-20 opacity-20">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="40" cy="40" rx="16" ry="30" fill="#E8738A" transform="rotate(0 40 40)" />
                    <ellipse cx="40" cy="40" rx="16" ry="30" fill="#F9B9C5" transform="rotate(45 40 40)" />
                    <ellipse cx="40" cy="40" rx="16" ry="30" fill="#E8738A" transform="rotate(90 40 40)" opacity=".7" />
                    <ellipse cx="40" cy="40" rx="16" ry="30" fill="#F9B9C5" transform="rotate(135 40 40)" opacity=".7" />
                    <circle cx="40" cy="40" r="6" fill="#FF4D6D" />
                  </svg>
                </div>
                {/* Medium petal */}
                <div className="pw-petal-b absolute bottom-14 right-14 h-12 w-12 opacity-15">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="24" cy="24" rx="9" ry="17" fill="#F9B9C5" transform="rotate(30 24 24)" />
                    <ellipse cx="24" cy="24" rx="9" ry="17" fill="#E8738A" transform="rotate(90 24 24)" opacity=".6" />
                    <ellipse cx="24" cy="24" rx="9" ry="17" fill="#F9B9C5" transform="rotate(150 24 24)" opacity=".8" />
                    <circle cx="24" cy="24" r="3.5" fill="#FF4D6D" />
                  </svg>
                </div>
                {/* Small petal */}
                <div className="pw-petal-c absolute right-5 top-1/2 h-8 w-8 opacity-20">
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="16" cy="16" rx="6" ry="12" fill="#F9B9C5" transform="rotate(60 16 16)" />
                    <ellipse cx="16" cy="16" rx="6" ry="12" fill="#E8738A" transform="rotate(120 16 16)" opacity=".5" />
                    <circle cx="16" cy="16" r="2.5" fill="#FF4D6D" />
                  </svg>
                </div>
              </div>

              {/* Main content */}
              <div className="relative p-6 md:p-8 md:pr-36">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm"
                    style={{ background: 'linear-gradient(135deg,#F9B9C5,#E8738A)' }}
                  >
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-bold text-[#2D2D2D]">
                      Đổi mật khẩu
                    </h1>
                    <p className="mt-0.5 text-sm text-muted">
                      Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.
                    </p>
                  </div>
                </div>

                {/* ── Success state ── */}
                {success ? (
                  <div className="pw-slide-up flex flex-col items-center py-10 text-center">
                    <div
                      className="pw-bloom-icon mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                      style={{ background: 'linear-gradient(135deg,#DCFCE7,#BBF7D0)' }}
                    >
                      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none">
                        <polyline
                          className="pw-check"
                          points="20,6 9,17 4,12"
                          stroke="#22C55E"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 className="font-display text-xl font-bold text-[#22C55E]">
                      Đổi mật khẩu thành công!
                    </h2>
                    <p className="mt-2 max-w-xs text-sm text-muted">
                      Mật khẩu của bạn đã được cập nhật. Hãy dùng mật khẩu mới trong lần đăng nhập tiếp theo.
                    </p>
                  </div>
                ) : (

                  /* ── Form ── */
                  <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-6">

                    {/* Mật khẩu mới */}
                    <div className="space-y-2">
                      <label
                        htmlFor="newPassword"
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#2D2D2D]"
                      >
                        <Lock className="h-3.5 w-3.5 text-muted" />
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNew ? 'text' : 'password'}
                          placeholder="Ít nhất 6 ký tự"
                          value={form.newPassword}
                          onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                          className="input-field pr-11"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(p => !p)}
                          aria-label={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-[#2D2D2D]"
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Strength bar */}
                      {form.newPassword.length > 0 && (
                        <div className="pw-slide-up space-y-1.5">
                          {/* 4-segment track */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map(n => (
                              <div
                                key={n}
                                className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
                              >
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: n <= strength.level ? '100%' : '0%',
                                    backgroundColor: strength.color,
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className="text-xs font-semibold transition-colors"
                              style={{ color: strength.color }}
                            >
                              {strength.label}
                            </span>
                            {strength.level < 3 && (
                              <span className="text-xs text-muted">
                                Thêm chữ hoa, số, ký tự đặc biệt
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#2D2D2D]"
                      >
                        <Lock className="h-3.5 w-3.5 text-muted" />
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Nhập lại mật khẩu mới"
                          value={form.confirmPassword}
                          onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                          className={cn(
                            'input-field pr-11',
                            mismatch
                              ? 'border-danger focus:border-danger focus:ring-danger/20'
                              : form.confirmPassword && !mismatch
                                ? 'border-success focus:border-success focus:ring-success/20'
                                : ''
                          )}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(p => !p)}
                          aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-[#2D2D2D]"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>

                        {/* Inline match indicator */}
                        {form.confirmPassword && !mismatch && (
                          <svg
                            aria-hidden="true"
                            className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-success"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                          >
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                      </div>
                      {mismatch && (
                        <p className="pw-slide-up text-xs text-danger">Mật khẩu không khớp</p>
                      )}
                    </div>

                    {/* Error banner */}
                    {error && (
                      <p
                        role="alert"
                        className="pw-slide-up rounded-xl border border-danger/20 bg-danger/8 px-4 py-3 text-sm text-danger"
                      >
                        {error}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      style={{
                        background: isSaving
                          ? 'var(--color-primary)'
                          : 'linear-gradient(135deg,#E8738A 0%,#FF4D6D 100%)',
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSaving ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" className="opacity-75" />
                            </svg>
                            Đang cập nhật...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            Đổi mật khẩu
                          </>
                        )}
                      </span>
                    </button>

                  </form>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default PasswordPage
