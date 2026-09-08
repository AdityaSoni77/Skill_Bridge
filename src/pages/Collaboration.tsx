import { useState } from 'react'
import { CalendarDays, Handshake, Users } from 'lucide-react'
import { collaborations } from '@/lib/data'
import type { CollaborationItem } from '@/lib/types'
import { useApp } from '@/store'
import { Badge, Button, Card, CardBody, EmptyState, PageHeading, Tabs } from '@/components/ui/primitives'
import { formatDate } from '@/lib/utils'

const KINDS: (CollaborationItem['kind'] | 'all')[] = [
  'all', 'Mentorship', 'Guest Lecture', 'Workshop', 'Live Project', 'Innovation Challenge', 'Research',
]

export default function Collaboration() {
  const { account, notify } = useApp()
  const [kind, setKind] = useState<(typeof KINDS)[number]>('all')
  const [joined, setJoined] = useState<string[]>([])

  const visible = collaborations.filter((c) => kind === 'all' || c.kind === kind)
  const isStudent = account?.role === 'student'

  const join = (c: CollaborationItem) => {
    setJoined((j) => [...j, c.id])
    notify(isStudent ? 'Registration confirmed' : 'Interest recorded',
      `${c.company} will follow up about ${c.title}.`)
  }

  return (
    <div>
      <PageHeading title="Collaboration"
        lede="Mentorship, guest lectures, workshops, live projects, innovation challenges and research partnerships — the direct connection between campuses and companies." />

      <div className="mb-5">
        <Tabs active={kind} onChange={setKind}
          tabs={KINDS.map((k) => ({
            id: k, label: k === 'all' ? 'Everything' : k,
            count: k === 'all' ? collaborations.length : collaborations.filter((c) => c.kind === k).length,
          }))} />
      </div>

      {visible.length === 0 ? (
        <Card><EmptyState icon={<Handshake size={28} />} title="Nothing open in this category"
          body="Partner companies publish new collaborations every few weeks. Try another category." /></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((c) => {
            const closed = c.status === 'Closed'
            const done = joined.includes(c.id)
            return (
              <Card key={c.id} className="flex flex-col">
                <CardBody className="flex-1 py-5">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="min-w-0 flex-1 text-[15.5px] font-semibold leading-snug text-ink-900">{c.title}</h3>
                    <Badge tone={c.status === 'Open' ? 'ready' : c.status === 'Filling fast' ? 'mid' : 'neutral'}>{c.status}</Badge>
                  </div>
                  <p className="mt-1.5 text-[13px] font-medium text-ink-700">{c.company}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{c.detail}</p>
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-500">
                    <Badge tone="navy">{c.kind}</Badge>
                    <span className="inline-flex items-center gap-1.5"><Users size={12.5} />{c.audience}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={12.5} />{formatDate(c.date)}</span>
                  </div>
                </CardBody>
                <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
                  <span className="text-[12px] text-ink-500 tnum">
                    {closed ? 'Programme completed' : `${c.seatsLeft} places left`}
                  </span>
                  <Button size="sm" variant={done || closed ? 'secondary' : 'primary'} disabled={done || closed}
                    onClick={() => join(c)}>
                    {closed ? 'Closed' : done ? (isStudent ? 'Registered' : 'Interest sent') : (isStudent ? 'Register' : 'Express interest')}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
