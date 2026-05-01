import { type FC, type ElementType } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title    : string
  value    : string
  sub?     : string
  icon     : ElementType
  color    : 'primary' | 'success' | 'warning' | 'blue'
}

const COLOR_MAP = {
  primary: 'bg-secondary text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  blue   : 'bg-blue-50 text-blue-600',
}

const StatCard: FC<StatCardProps> = ({ title, value, sub, icon: Icon, color }) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#2D2D2D]">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', COLOR_MAP[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default StatCard