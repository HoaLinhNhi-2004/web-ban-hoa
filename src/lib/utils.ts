import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── Tailwind class merging ──────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Định dạng giá tiền VND ─────────────────
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style   : 'currency',
    currency: 'VND',
  }).format(price)
}

// ── Định dạng ngày tháng tiếng Việt ────────
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day  : '2-digit',
    month: '2-digit',
    year : 'numeric',
  }).format(new Date(date))
}

// ── Định dạng ngày + giờ ───────────────────
export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day   : '2-digit',
    month : '2-digit',
    year  : 'numeric',
    hour  : '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// ── Cắt ngắn text ──────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// ── Tạo slug từ tên ────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// ── Validate số điện thoại VN ──────────────
export function isValidPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone)
}

// ── Parse price từ Supabase (DECIMAL → number) ──
export function parsePrice(value: string | number): number {
  return typeof value === 'string' ? parseFloat(value) : value
}