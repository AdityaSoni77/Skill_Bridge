import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, GraduationCap, ShieldCheck, User, TriangleAlert } from 'lucide-react'
import { useApp, demoAccounts, type DemoAccount } from '@/store'
import { Button } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const roleIcon = { student: User, industry: Building2, institution: ShieldCheck, faculty: GraduationCap }

const chain = [
  'Industry publishes the skills it is hiring for',
  'Students assess themselves against that bar',
  'SkillBridge measures the exact gap',
  'A roadmap closes it, step by step',
  'Matching surfaces the roles they are now ready for',
  'Institutions see the gap across every student',
]

export default function Login() {
  const { signIn } = useApp()
  const nav = useNavigate()
  const [email, setEmail] = useState('student@demo.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = () => {
    setError(null)
    setBusy(true)
    const res = signIn(email, password)
    if (!res.ok) { setError(res.error!); setBusy(false); return }
    nav(res.account!.home)
  }

  const fill = (a: DemoAccount) => { setEmail(a.email); setPassword(a.password); setError(null) }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_520px]">
      {/* Story panel — the 30-second pitch a judge reads before anyone speaks. */}
      <div className="relative flex flex-col justify-between bg-navy-900 px-7 py-10 text-white sm:px-12 lg:py-14">
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="7" fill="#ffffff" fillOpacity="0.1" />
            <path d="M7 20c4-7 14-7 18 0" stroke="#E08A18" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M11 20v-4M21 20v-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <span className="font-display text-[19px] font-bold tracking-[-0.02em]">SkillBridge</span>
        </div>

        <div className="max-w-xl py-12">
          <h1 className="font-display text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[44px]">
            From classroom skills to industry careers.
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/70">
            Students rarely know which skills industry is actually hiring for. Companies cannot
            tell which students hold those skills. Colleges cannot see where their gaps are.
            SkillBridge measures all three against the same live standard.
          </p>

          <ol className="mt-9 space-y-0">
            {chain.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex flex-col items-center">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-saffron-500" />
                  {i < chain.length - 1 && <span className="my-0.5 w-px flex-1 bg-white/15" />}
                </span>
                <span className="pb-4 text-[14px] leading-snug text-white/85">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-[12.5px] text-white/40">
          An industry readiness intelligence platform · Smart India Hackathon prototype
        </p>
      </div>

      {/* Sign in */}
      <div className="flex flex-col justify-center px-7 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-[380px]">
          <h2 className="font-display text-[24px] font-bold text-ink-900">Sign in</h2>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Pick a demo account to see the platform from that persona's side.
          </p>

          <div className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()} autoComplete="username"
                className="h-10 w-full rounded-lg border border-hairline px-3 text-[14px] text-ink-900 placeholder:text-ink-400 focus:border-navy-500" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()} autoComplete="current-password"
                className="h-10 w-full rounded-lg border border-hairline px-3 text-[14px] text-ink-900 focus:border-navy-500" />
            </label>
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-[13px] text-gap-high">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button className="mt-5 w-full" onClick={submit} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={15} />
          </Button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-hairline" />
            <span className="text-[12px] text-ink-400">Demo accounts</span>
            <span className="h-px flex-1 bg-hairline" />
          </div>

          <div className="space-y-2">
            {demoAccounts.map((a) => {
              const Icon = roleIcon[a.role]
              const active = email === a.email
              return (
                <button key={a.role} onClick={() => fill(a)}
                  className={cn('flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
                    active ? 'border-navy-500 bg-navy-50' : 'border-hairline bg-white hover:bg-canvas')}>
                  <span className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    active ? 'bg-navy-900 text-white' : 'bg-canvas text-ink-500')}>
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium text-ink-900">{a.label} · {a.name}</span>
                    <span className="block truncate text-[12px] text-ink-500 tnum">{a.email} · demo123</span>
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-ink-400">
            Authentication is simulated locally for the prototype. No data leaves your machine
            and no API keys are required.
          </p>
        </div>
      </div>
    </div>
  )
}
