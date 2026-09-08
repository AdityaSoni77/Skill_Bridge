import { cn } from '@/lib/utils'

/** Compact match percentage used on every opportunity card. */
export function MatchRing({ score, size = 52 }: { score: number; size?: number }) {
  const stroke = 5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const tone = score >= 85 ? '#1F8A5B' : score >= 65 ? '#B45309' : '#C0392B'
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4E7EC" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * score) / 100}
          style={{ transition: 'stroke-dashoffset .7s cubic-bezier(0.16,1,0.3,1)' }} />
      </svg>
      <span className={cn('absolute font-display font-bold tnum', size < 50 ? 'text-[12px]' : 'text-[14px]')}
        style={{ color: tone }}>
        {score}
      </span>
    </div>
  )
}
