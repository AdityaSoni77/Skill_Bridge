import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus, Users } from 'lucide-react'
import { useApp } from '@/store'
import { allStudents } from '@/lib/data'
import { careerRoles, roleIndex, skillIndex, skills as allSkills } from '@/lib/data/skills'
import { rankCandidates } from '@/lib/engine'
import type { Opportunity, OpportunityType, SkillRequirement } from '@/lib/types'
import { Avatar, Badge, Button, Card, CardBody, CardHeader, PageHeading } from '@/components/ui/primitives'
import { MatchRing } from '@/components/MatchRing'
import { cn } from '@/lib/utils'

const inputCls = 'h-10 w-full rounded-lg border border-hairline px-3 text-[14px] text-ink-900 placeholder:text-ink-400 focus:border-navy-500'

export default function PostOpportunity() {
  const { addOpportunity } = useApp()
  const nav = useNavigate()

  const [title, setTitle] = useState('Full Stack Developer Intern — Winter Cohort')
  const [type, setType] = useState<OpportunityType>('Internship')
  const [roleId, setRoleId] = useState('fsd')
  const [location, setLocation] = useState('Indore, MP')
  const [stipend, setStipend] = useState('₹25,000/month')
  const [duration, setDuration] = useState('6 months')
  const [minCgpa, setMinCgpa] = useState(7)
  const [description, setDescription] = useState('Work with the platform team on customer-facing dashboards, with a senior engineer reviewing every change you ship.')
  const [reqs, setReqs] = useState<SkillRequirement[]>(roleIndex.fsd.benchmark.slice(0, 5).map((r) => ({ ...r, level: Math.max(50, r.level - 5) })))

  const draft: Opportunity = useMemo(() => ({
    id: 'draft', companyId: 'co-001', title, type, location, workMode: 'Hybrid',
    stipend, duration, postedOn: new Date().toISOString().slice(0, 10), applicants: 0,
    roleId, requirements: reqs, offersTraining: true,
    eligibility: { minCgpa, years: ['3rd', '4th'], branches: ['Computer Science', 'Information Technology', 'Electronics & Telecom'] },
    description, perks: ['Assigned mentor', 'Certificate on completion'],
  }), [title, type, location, stipend, duration, roleId, reqs, minCgpa, description])

  // Live preview: who would match the moment this goes live.
  const preview = useMemo(() => rankCandidates(allStudents, draft, careerRoles, skillIndex).slice(0, 5), [draft])

  const setLevel = (skillId: string, level: number) =>
    setReqs((rs) => rs.map((r) => (r.skillId === skillId ? { ...r, level } : r)))
  const toggleCritical = (skillId: string) =>
    setReqs((rs) => rs.map((r) => (r.skillId === skillId ? { ...r, critical: !r.critical } : r)))
  const removeReq = (skillId: string) => setReqs((rs) => rs.filter((r) => r.skillId !== skillId))
  const addReq = (skillId: string) => {
    if (!skillId || reqs.some((r) => r.skillId === skillId)) return
    setReqs((rs) => [...rs, { skillId, level: 60, weight: 2 }])
  }

  const publish = () => {
    addOpportunity({ ...draft, id: 'opp-' + Math.random().toString(36).slice(2, 7) })
    nav('/industry/postings')
  }

  return (
    <div>
      <PageHeading title="Post an opportunity"
        lede="Define the skills and the level you actually need. Students are scored against these numbers, and you can see who matches before you publish." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Role details" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Title</span>
                <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Type</span>
                <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as OpportunityType)}>
                  <option>Internship</option><option>Job</option><option>Live Project</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Benchmark role</span>
                <select className={inputCls} value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                  {careerRoles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Location</span>
                <input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Stipend or salary</span>
                <input className={inputCls} value={stipend} onChange={(e) => setStipend(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Duration</span>
                <input className={inputCls} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Minimum CGPA</span>
                <input type="number" step={0.1} min={0} max={10} className={inputCls} value={minCgpa}
                  onChange={(e) => setMinCgpa(+e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-700">Description</span>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-hairline p-3 text-[14px] text-ink-900 focus:border-navy-500" />
              </label>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Required skills"
              subtitle="Set the proficiency you need out of 100. Mark a skill as must-have if you would not interview without it." />
            <div className="divide-y divide-hairline">
              {reqs.map((r) => (
                <div key={r.skillId} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span className="min-w-[150px] flex-1 text-[13.5px] font-medium text-ink-900">
                    {skillIndex[r.skillId]?.name ?? r.skillId}
                  </span>
                  <input type="range" min={30} max={95} step={5} value={r.level}
                    onChange={(e) => setLevel(r.skillId, +e.target.value)} className="w-32 accent-navy-900" />
                  <span className="w-8 text-[13px] font-semibold text-ink-900 tnum">{r.level}</span>
                  <button onClick={() => toggleCritical(r.skillId)}
                    className={cn('rounded-md border px-2 py-1 text-[12px] font-medium transition-colors',
                      r.critical ? 'border-gap-high bg-red-50 text-gap-high' : 'border-hairline text-ink-500 hover:bg-canvas')}>
                    {r.critical ? 'Must have' : 'Nice to have'}
                  </button>
                  <button onClick={() => removeReq(r.skillId)} className="text-[12px] text-ink-400 hover:text-gap-high">Remove</button>
                </div>
              ))}
            </div>
            <CardBody className="border-t border-hairline">
              <label className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] text-ink-700">Add a skill</span>
                <select className="h-9 rounded-lg border border-hairline px-2 text-[13px]" defaultValue=""
                  onChange={(e) => { addReq(e.target.value); e.currentTarget.value = '' }}>
                  <option value="" disabled>Choose from catalogue…</option>
                  {allSkills.filter((s) => !reqs.some((r) => r.skillId === s.id)).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <Plus size={14} className="text-ink-400" />
              </label>
            </CardBody>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button onClick={publish} disabled={!title || reqs.length === 0}>
              <Check size={15} /> Publish opportunity
            </Button>
            <Button variant="secondary" onClick={() => nav('/industry/postings')}>Cancel</Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-[88px] lg:self-start">
          <Card>
            <CardHeader title="Who would match" subtitle="Recalculated as you change the requirements" />
            <div className="divide-y divide-hairline">
              {preview.map(({ student, match }) => (
                <div key={student.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar initials={student.avatarInitials} size={32} tone="light" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink-900">{student.name}</p>
                    <p className="truncate text-[11.5px] text-ink-500">{student.branch} · {student.year} year</p>
                  </div>
                  <MatchRing score={match.score} size={38} />
                </div>
              ))}
            </div>
            <CardBody className="border-t border-hairline">
              <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-500">
                <Users size={14} className="mt-0.5 shrink-0" />
                {preview.filter((p) => p.match.score >= 85).length} of {allStudents.length} students in the
                demo pool would score 85% or above. Raise a requirement and watch this list thin out.
              </p>
              <Badge tone="navy" className="mt-3">{reqs.filter((r) => r.critical).length} must-have skills</Badge>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
