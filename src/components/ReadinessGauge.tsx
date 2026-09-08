import { cn } from '@/lib/utils'

/**
 * The one deliberately bold element in the product: a student's industry
 * readiness, drawn once on load. Everything around it stays quiet.
 */
export function ReadinessGauge({
  score, size = 208, delta, caption,
}: { score: number; size?: number; delta?: number; caption?: string }) {
  const stroke = size < 140 ? 9 : 13
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  // 270° sweep, opening at the bottom.
  const sweep = 0.75
  const track = circumference * sweep
  const filled = track * (Math.min(100, Math.max(0, score)) / 100)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[225deg]" role="img"
        aria-label={`Industry readiness ${score} percent`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4E7EC" strokeWidth={stroke}
          strokeDasharray={`${track} ${circumference}`} strokeLinecap="round" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E08A18" strokeWidth={stroke}
          strokeDasharray={`${track} ${circumference}`} strokeLinecap="round"
          className="animate-draw-in"
          style={{ ['--dash-from' as string]: `${track}`, ['--dash-to' as string]: `${track - filled}`, strokeDashoffset: track }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-display font-bold tnum leading-none text-ink-900', size < 140 ? 'text-3xl' : 'text-display-lg')}>
          {score}
          <span className={cn('font-semibold text-ink-400', size < 140 ? 'text-lg' : 'text-2xl')}>%</span>
        </span>
        {caption && <span className="mt-1.5 text-[12px] font-medium text-ink-500">{caption}</span>}
        {delta !== undefined && delta !== 0 && (
          <span className={cn('mt-1 text-[13px] font-semibold tnum', delta > 0 ? 'text-gap-ready' : 'text-gap-high')}>
            {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}% this month
          </span>
        )}
      </div>
    </div>
  )
}
