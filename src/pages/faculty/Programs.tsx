import { useState } from 'react'
import { CalendarDays, GraduationCap, MapPin } from 'lucide-react'
import { facultyPrograms } from '@/lib/data'
import { skillIndex } from '@/lib/data/skills'
import type { FacultyProgram } from '@/lib/types'
import { useApp } from '@/store'
import { Badge, Button, Card, CardBody, EmptyState, PageHeading, Tabs } from '@/components/ui/primitives'
import { formatDate } from '@/lib/utils'

const TYPES: (FacultyProgram['type'] | 'all')[] = [
  'all', 'Faculty Internship', 'Industrial Training', 'FDP', 'Workshop', 'Research Collaboration', 'Consultancy', 'Guest Lecture', 'Live Project',
]

export default function Programs() {
  const { notify } = useApp()
  const [type, setType] = useState<(typeof TYPES)[number]>('all')
  const [applied, setApplied] = useState<string[]>([])

  const visible = facultyPrograms.filter((p) => type === 'all' || p.type === type)

  const apply = (p: FacultyProgram) => {
    setApplied((a) => [...a, p.id])
    notify('Expression of interest sent', `${p.company} will contact you about ${p.title}.`)
  }

  return (
    <div>
      <PageHeading title="Industry programmes"
        lede="Faculty internships, industrial training, FDPs, workshops, consultancy and research collaborations published by partner companies." />

      <div className="mb-5">
        <Tabs active={type} onChange={setType}
          tabs={TYPES.map((t) => ({
            id: t, label: t === 'all' ? 'All programmes' : t,
            count: t === 'all' ? facultyPrograms.length : facultyPrograms.filter((p) => p.type === t).length,
          }))} />
      </div>

      {visible.length === 0 ? (
        <Card><EmptyState icon={<GraduationCap size={28} />} title="No programmes of this type right now"
          body="New programmes are published by partner companies throughout the semester. Check another category in the meantime." /></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((p) => {
            const done = applied.includes(p.id)
            return (
              <Card key={p.id} className="flex flex-col">
                <CardBody className="flex-1 py-5">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="min-w-0 flex-1 text-[15.5px] font-semibold leading-snug text-ink-900">{p.title}</h3>
                    <Badge tone="navy">{p.type}</Badge>
                  </div>
                  <p className="mt-1.5 text-[13px] font-medium text-ink-700">{p.company}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{p.description}</p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-500">
                    <span className="inline-flex items-center gap-1.5"><MapPin size={12.5} />{p.mode}</span>
                    <span className="inline-flex items-center gap-1.5">{p.duration}</span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-ink-700">{p.stipend}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={12.5} />Closes {formatDate(p.deadline)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.skillIds.map((s) => <Badge key={s} tone="neutral">{skillIndex[s]?.name ?? s}</Badge>)}
                  </div>
                </CardBody>
                <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
                  <span className="text-[12px] text-ink-500 tnum">{p.seats} {p.seats === 1 ? 'seat' : 'seats'} available</span>
                  <Button size="sm" variant={done ? 'secondary' : 'primary'} disabled={done} onClick={() => apply(p)}>
                    {done ? 'Interest sent' : 'Express interest'}
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
