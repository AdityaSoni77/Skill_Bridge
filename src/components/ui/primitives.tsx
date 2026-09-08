import type { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BadgeCheck } from 'lucide-react'

/* ---------------- Card ---------------- */
export function Card({ className, children, ...p }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-xl border border-hairline bg-white shadow-card', className)} {...p}>
      {children}
    </div>
  )
}

export function CardHeader({
  title, subtitle, action, className,
}: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-hairline px-5 py-4', className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] leading-snug text-ink-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}

/* ---------------- Button ---------------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}
const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap'
const btnVariants = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800',
  secondary: 'border border-hairline bg-white text-ink-700 hover:bg-canvas hover:text-ink-900',
  ghost: 'text-ink-700 hover:bg-canvas hover:text-ink-900',
  danger: 'bg-gap-high text-white hover:opacity-90',
}
const btnSizes = { sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-4 text-sm' }

export function Button({ variant = 'primary', size = 'md', className, ...p }: BtnProps) {
  return <button className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...p} />
}

export function LinkButton({
  to, variant = 'primary', size = 'md', className, children,
}: { to: string; variant?: keyof typeof btnVariants; size?: 'sm' | 'md'; className?: string; children: ReactNode }) {
  return (
    <Link to={to} className={cn(btnBase, btnVariants[variant], btnSizes[size], className)}>
      {children}
    </Link>
  )
}

/* ---------------- Badge ---------------- */
const badgeTones = {
  neutral: 'bg-canvas text-ink-700 border-hairline',
  navy: 'bg-navy-50 text-navy-700 border-navy-100',
  ready: 'bg-emerald-50 text-gap-ready border-emerald-100',
  mid: 'bg-amber-50 text-gap-mid border-amber-100',
  high: 'bg-red-50 text-gap-high border-red-100',
  saffron: 'bg-saffron-50 text-saffron-600 border-saffron-300/50',
}
export type BadgeTone = keyof typeof badgeTones

export function Badge({
  tone = 'neutral', className, children,
}: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[12px] font-medium', badgeTones[tone], className)}>
      {children}
    </span>
  )
}

export function VerifiedTag({ label = 'Verified' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-navy-100 bg-navy-50 px-1.5 py-0.5 text-[11px] font-medium text-navy-700"
      title="Credential confirmed by the issuing institution or company">
      <BadgeCheck size={12} strokeWidth={2.5} />
      {label}
    </span>
  )
}

/* ---------------- Progress ---------------- */
export function Progress({
  value, target, tone = 'navy', className, showTarget = true,
}: { value: number; target?: number; tone?: 'navy' | 'ready' | 'mid' | 'high'; className?: string; showTarget?: boolean }) {
  const fill = { navy: 'bg-navy-500', ready: 'bg-gap-ready', mid: 'bg-gap-mid', high: 'bg-gap-high' }[tone]
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-canvas ring-1 ring-inset ring-hairline', className)}>
      <div className={cn('h-full rounded-full transition-[width] duration-700 ease-out', fill)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      {showTarget && target !== undefined && (
        <div className="absolute inset-y-0 w-[2px] bg-ink-900/70" style={{ left: `${Math.min(100, target)}%` }}
          title={`Industry requirement: ${target}`} />
      )}
    </div>
  )
}

/* ---------------- Stat ---------------- */
export function Stat({
  label, value, sub, tone,
}: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'ready' | 'mid' | 'high' }) {
  const toneClass = tone ? { ready: 'text-gap-ready', mid: 'text-gap-mid', high: 'text-gap-high' }[tone] : 'text-ink-900'
  return (
    <div>
      <p className="text-[13px] text-ink-500">{label}</p>
      <p className={cn('mt-1 font-display text-2xl font-bold tnum', toneClass)}>{value}</p>
      {sub && <p className="mt-0.5 text-[12px] text-ink-500">{sub}</p>}
    </div>
  )
}

/* ---------------- Avatar ---------------- */
export function Avatar({
  initials, size = 36, tone = 'navy',
}: { initials: string; size?: number; tone?: 'navy' | 'light' }) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold',
        tone === 'navy' ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-700')}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials}
    </span>
  )
}

/* ---------------- Empty state ---------------- */
export function EmptyState({
  icon, title, body, action,
}: { icon?: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="mb-3 text-ink-400">{icon}</div>}
      <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ink-500">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/* ---------------- Page heading ---------------- */
export function PageHeading({
  title, lede, action,
}: { title: string; lede?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[26px] font-bold leading-tight text-ink-900">{title}</h1>
        {lede && <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-ink-500">{lede}</p>}
      </div>
      {action}
    </div>
  )
}

/* ---------------- Section label ---------------- */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 text-[13px] font-semibold text-ink-700">{children}</h3>
}

/* ---------------- Tabs ---------------- */
export function Tabs<T extends string>({
  tabs, active, onChange,
}: { tabs: { id: T; label: string; count?: number }[]; active: T; onChange: (id: T) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-hairline scrollbar-thin" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            '-mb-px shrink-0 border-b-2 px-3 py-2.5 text-[13.5px] font-medium transition-colors',
            active === t.id
              ? 'border-navy-900 text-ink-900'
              : 'border-transparent text-ink-500 hover:text-ink-700',
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={cn('ml-1.5 rounded px-1.5 py-0.5 text-[11px] tnum', active === t.id ? 'bg-navy-50 text-navy-700' : 'bg-canvas text-ink-500')}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
