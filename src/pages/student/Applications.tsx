import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { useApp } from '@/store'
import { useIntel } from '@/lib/useIntel'
import { companyIndex, opportunityIndex } from '@/lib/data'
import type { ApplicationStage } from '@/lib/types'
import { Avatar, Badge, Card, CardBody, EmptyState, LinkButton, PageHeading, Tabs } from '@/components/ui/primitives'
import { MatchRing } from '@/components/MatchRing'
import { formatDate, cn } from '@/lib/utils'

const STAGES: ApplicationStage[] = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']

function StageTrack({ stage, timeline }: { stage: ApplicationStage; timeline: { stage: ApplicationStage; date: string; note?: string }[] }) {
  const currentIdx = STAGES.indexOf(stage)
  return (
    <ol className="mt-4 grid gap-y-4 sm:grid-cols-5">
      {STAGES.map((s, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        const entry = timeline.find((t) => t.stage === s)
        return (
          <li key={s} className="relative sm:pr-3">
            <div className="flex items-center gap-2 sm:block">
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold tnum',
                done && 'bg-gap-ready/15 text-gap-ready',
                active && 'bg-navy-900 text-white',
                !done && !active && 'bg-canvas text-ink-400 ring-1 ring-inset ring-hairline')}>
                {done ? '✓' : i + 1}
              </span>
              <p className={cn('mt-2 text-[12.5px] font-medium sm:mt-2', active ? 'text-ink-900' : done ? 'text-ink-700' : 'text-ink-400')}>{s}</p>
            </div>
            {entry && <p className="mt-0.5 pl-7 text-[11.5px] text-ink-500 sm:pl-0">{formatDate(entry.date)}</p>}
            {/* Connector */}
            {i < STAGES.length - 1 && (
              <span className={cn('absolute left-[9px] top-6 h-[calc(100%-0.25rem)] w-px sm:left-0 sm:top-[9px] sm:h-px sm:w-full sm:translate-x-6',
                done ? 'bg-gap-ready/35' : 'bg-hairline')} aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default function Applications() {
  const { student } = useApp()
  const { myApplications } = useIntel()
  const [tab, setTab] = useState<'all' | 'active' | 'progressing'>('all')

  const visible = myApplications.filter((a) =>
    tab === 'all' ? true
      : tab === 'progressing' ? a.stage === 'Shortlisted' || a.stage === 'Interview' || a.stage === 'Selected'
        : a.stage !== 'Selected')

  return (
    <div>
      <PageHeading
        title="Application tracker"
        lede="Every application you have submitted, with the stage each employer has moved you to."
      />

      <div className="mb-5">
        <Tabs
          active={tab} onChange={setTab}
          tabs={[
            { id: 'all' as const, label: 'All', count: myApplications.length },
            { id: 'active' as const, label: 'In progress', count: myApplications.filter((a) => a.stage !== 'Selected').length },
            { id: 'progressing' as const, label: 'Shortlisted or beyond', count: myApplications.filter((a) => ['Shortlisted', 'Interview', 'Selected'].includes(a.stage)).length },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState icon={<ClipboardList size={28} />} title="Nothing here yet"
            body="Applications you submit will appear here with their live stage, so you always know where you stand."
            action={<LinkButton to="/student/opportunities" size="sm">Browse opportunities</LinkButton>} />
        </Card>
      ) : (
        <div className="space-y-4">
          {visible.map((a) => {
            const opp = opportunityIndex[a.opportunityId]
            const co = opp ? companyIndex[opp.companyId] : undefined
            const latest = a.timeline[a.timeline.length - 1]
            return (
              <Card key={a.id}>
                <CardBody className="py-5">
                  <div className="flex flex-wrap items-start gap-3">
                    {co && <Avatar initials={co.logoInitials} size={38} tone="light" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink-900">{opp?.title ?? 'Opportunity'}</p>
                      <p className="mt-0.5 truncate text-[12.5px] text-ink-500">
                        {co?.name} · {opp?.location} · applied {formatDate(a.appliedOn)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.matchAtApply > 0 && (
                        <div className="hidden items-center gap-2 sm:flex">
                          <MatchRing score={a.matchAtApply} size={40} />
                          <span className="text-[11.5px] text-ink-500">match<br />at apply</span>
                        </div>
                      )}
                      <Badge tone={a.stage === 'Selected' ? 'ready' : a.stage === 'Interview' || a.stage === 'Shortlisted' ? 'navy' : a.stage === 'Under Review' ? 'mid' : 'neutral'}>
                        {a.stage}
                      </Badge>
                    </div>
                  </div>

                  <StageTrack stage={a.stage} timeline={a.timeline} />

                  {latest?.note && (
                    <p className="mt-4 rounded-lg bg-canvas px-3.5 py-2.5 text-[12.5px] text-ink-700">
                      <span className="font-medium">Latest update — </span>{latest.note}
                    </p>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      <p className="mt-5 text-[12px] text-ink-400">
        {student.name} · {myApplications.length} applications this semester
      </p>
    </div>
  )
}
