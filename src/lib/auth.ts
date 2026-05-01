import { supabase } from './supabase'
import { SITE } from './constants'

// Đăng ký bằng email
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data            : { full_name: fullName },
      emailRedirectTo : `${SITE.url}/auth/callback`,
    },
  })
  return { data, error }
}

// Đăng nhập bằng email
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Đăng nhập bằng Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options : {
      redirectTo: `${SITE.url}/auth/callback`,
    },
  })
  return { data, error }
}

// Đăng xuất
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Gửi lại email xác nhận
export async function resendConfirmation(email: string) {
  const { error } = await supabase.auth.resend({
    type : 'signup',
    email,
    options: { emailRedirectTo: `${SITE.url}/auth/callback` },
  })
  return { error }
}

// Lấy session hiện tại
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}