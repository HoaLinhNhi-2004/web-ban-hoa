import { type FC } from 'react'
import { createSupabaseAdmin } from '@/lib/supabase-server'
import { formatDate } from '@/lib/utils'
import UserRoleSelect from '@/components/admin/UserRoleSelect'

const AdminUsersPage: FC = async () => {
  const supabase = createSupabaseAdmin()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2D2D2D]">Người dùng</h1>
        <p className="mt-1 text-sm text-muted">{profiles?.length ?? 0} tài khoản</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted bg-background">
                <th className="px-5 py-3 font-medium">Họ tên</th>
                <th className="px-5 py-3 font-medium">Số điện thoại</th>
                <th className="px-5 py-3 font-medium">Địa chỉ</th>
                <th className="px-5 py-3 font-medium">Ngày đăng ký</th>
                <th className="px-5 py-3 font-medium">Quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles?.map(profile => (
                <tr key={profile.id} className="hover:bg-background transition-colors">
                  <td className="px-5 py-3 font-medium text-[#2D2D2D]">
                    {profile.full_name ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {profile.phone ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-muted max-w-[200px] truncate">
                    {profile.address ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {formatDate(profile.created_at)}
                  </td>
                  <td className="px-5 py-3">
                    <UserRoleSelect
                      userId     ={profile.id}
                      currentRole={profile.role}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage