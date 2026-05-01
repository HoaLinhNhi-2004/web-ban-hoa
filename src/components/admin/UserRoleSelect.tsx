'use client'

import { type FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'

interface UserRoleSelectProps {
  userId      : string
  currentRole : string
}

const UserRoleSelect: FC<UserRoleSelectProps> = ({ userId, currentRole }) => {
  const [role,     setRole]     = useState<UserRole>(currentRole as UserRole)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = async (newRole: UserRole) => {
    setIsSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (!error) setRole(newRole)
    setIsSaving(false)
  }

  return (
    <select
      value={role}
      onChange={e => handleChange(e.target.value as UserRole)}
      disabled={isSaving}
      aria-label="Cập nhật quyền người dùng"
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60',
        role === 'admin'
          ? 'bg-primary/10 text-primary'
          : 'bg-border text-muted'
      )}
    >
      <option value="customer">Khách hàng</option>
      <option value="admin">Admin</option>
    </select>
  )
}

export default UserRoleSelect