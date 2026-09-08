import { Check, CircleAlert, X } from 'lucide-react'
import type { SkillStatus as Status } from '@/lib/engine'
import { cn } from '@/lib/utils'

export const statusMeta: Record<Status, { label: string; tone: 'ready' | 'mid' | 'high'; text: string; bg: string }> = {
  met: { label: 'Ready', tone: 'ready', text: 'text-gap-ready', bg: 'bg-emerald-50' },
  close: { label: 'Small gap', tone: 'mid', text: 'text-gap-mid', bg: 'bg-amber-50' },
  missing: { label: 'High gap', tone: 'high', text: 'text-gap-high', bg: 'bg-red-50' },
}

/** Icon + colour are always paired, so status never relies on colour alone. */
export function StatusIcon({ status, size = 14 }: { status: Status; size?: number }) {
  const m = statusMeta[status]
  const Icon = status === 'met' ? Check : status === 'close' ? CircleAlert : X
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full', m.bg, m.text)}
      style={{ width: size + 8, height: size + 8 }}>
      <Icon size={size} strokeWidth={3} />
    </span>
  )
}

export function StatusChip({ status, name }: { status: Status; name: string }) {
  const m = statusMeta[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] font-medium', m.bg, m.text)}>
      <StatusIcon status={status} size={11} />
      {name}
    </span>
  )
}
