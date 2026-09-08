import { Check, Circle, Dot, Flag, PlayCircle } from 'lucide-react'
import { useIntel } from '@/lib/useIntel'
import { Badge, Card, CardBody, CardHeader, PageHeading, Progress } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const typeTone = { Course: 'navy', Project: 'saffron', Assessment: 'neutral', Mentorship: 'ready' } as const

export default function Roadmap() {
  const { roadmap, role, roadmapProgress, projection, readiness } = useIntel()
  const totalHours = roadmap.filter((s) => s.status !== 'completed').reduce((n, s) => n + s.resource.hours, 0)

  return (
    <div>
      <PageHeading
        title="Personalised learning roadmap"
        lede={`Modules are selected by your live skill gaps and ordered by what each one depends on. Finishing this pathway takes you from ${readiness.score}% to an estimated ${projection.score}% readiness for a ${role.title} role.`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Pathway progress</p>
          <p className="mt-1.5 font-display text-[26px] font-bold leading-none text-ink-900 tnum">{roadmapProgress}%</p>
          <Progress value={roadmapProgress} showTarget={false} className="mt-3" />
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Learning time remaining</p>
          <p className="mt-1.5 font-display text-[26px] font-bold leading-none text-ink-900 tnum">{totalHours} hrs</p>
          <p className="mt-2 text-[12px] text-ink-500">{roadmap.filter((s) => s.status !== 'completed').length} modules left</p>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Readiness at completion</p>
          <p className="mt-1.5 font-display text-[26px] font-bold leading-none text-ink-900 tnum">{projection.score}%</p>
          <p className="mt-2 text-[12px] text-ink-500">Up {projection.score - readiness.score} points from today</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Your pathway" subtitle={`${role.title} · ${roadmap.length} modules`} />
        <CardBody className="px-5 py-5">
          <ol className="relative">
            {roadmap.map((step, i) => {
              const done = step.status === 'completed'
              const current = step.status === 'current'
              return (
                <li key={step.resource.id} className="relative flex gap-4 pb-5 last:pb-0">
                  {/* Connector */}
                  {i < roadmap.length - 1 && (
                    <span className={cn('absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-[2px]', done ? 'bg-gap-ready/35' : 'bg-hairline')} aria-hidden />
                  )}
                  <span className={cn('relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-white',
                    done && 'border-gap-ready bg-gap-ready text-white',
                    current && 'border-saffron-500 text-saffron-600',
                    !done && !current && 'border-hairline text-ink-400')}>
                    {done ? <Check size={14} strokeWidth={3} /> : current ? <Dot size={22} strokeWidth={4} /> : <Circle size={9} strokeWidth={3} />}
                  </span>

                  <div className={cn('min-w-0 flex-1 rounded-xl border px-4 py-3.5',
                    current ? 'border-saffron-300 bg-saffron-50/60' : 'border-hairline bg-white')}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn('text-[14.5px] font-semibold', done ? 'text-ink-500' : 'text-ink-900')}>
                        {step.resource.title}
                      </p>
                      <Badge tone={typeTone[step.resource.type]}>{step.resource.type}</Badge>
                      {current && <Badge tone="saffron">In progress</Badge>}
                      {done && <Badge tone="ready">Completed</Badge>}
                    </div>
                    <p className="mt-1 text-[12.5px] text-ink-500">
                      {step.resource.provider} · {step.resource.hours} hours · builds {step.targetSkills.join(', ')}
                    </p>
                    {!done && step.closesGap > 0 && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-navy-50 px-2 py-1 text-[12px] font-medium text-navy-700">
                        Closes {step.closesGap} points of your current gap
                      </p>
                    )}
                    {current && (
                      <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-navy-800">
                        <PlayCircle size={14} /> Continue module
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="mt-1 flex gap-4">
            <span className="ml-[3px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
              <Flag size={13} />
            </span>
            <div className="rounded-xl bg-navy-900 px-4 py-3">
              <p className="font-display text-[15px] font-bold text-white">Ready for internship</p>
              <p className="mt-0.5 text-[12.5px] text-white/70">
                At {projection.score}% readiness you clear every critical requirement for {role.title} internships.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
