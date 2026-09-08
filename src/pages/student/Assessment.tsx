import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, RotateCcw, ClipboardCheck } from 'lucide-react'
import { useApp } from '@/store'
import { useIntel } from '@/lib/useIntel'
import { roleIndex, careerRoles, skillIndex } from '@/lib/data/skills'
import { computeReadiness } from '@/lib/engine'
import { Badge, Button, Card, CardBody, CardHeader, PageHeading, Progress } from '@/components/ui/primitives'
import { ReadinessGauge } from '@/components/ReadinessGauge'
import { cn } from '@/lib/utils'

/** Five confidence bands map to a proficiency value the engine can score. */
const BANDS = [
  { label: 'Never used it', value: 15 },
  { label: 'Tried the basics', value: 35 },
  { label: 'Can build with guidance', value: 55 },
  { label: 'Build independently', value: 75 },
  { label: 'Confident in production', value: 90 },
]

export default function Assessment() {
  const { student, updateSkills, notify } = useApp()
  const { readiness, role } = useIntel()
  const nav = useNavigate()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const questions = roleIndex[student.careerGoalId]?.benchmark ?? []
  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === questions.length

  // Live preview: what the score becomes if these answers are saved.
  const preview = useMemo(() => {
    if (!answeredCount) return null
    const hypothetical = { ...student, skills: { ...student.skills, ...answers } }
    return computeReadiness(hypothetical, roleIndex[student.careerGoalId] ?? careerRoles[0], skillIndex)
  }, [answers, student, answeredCount])

  const save = () => {
    updateSkills(answers)
    setSubmitted(true)
    notify('Assessment saved', 'Your skill profile and every match score have been recalculated.')
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl">
        <Card>
          <CardBody className="flex flex-col items-center py-10 text-center">
            <ReadinessGauge score={readiness.score} size={168} caption="Industry readiness" />
            <h2 className="mt-5 font-display text-[20px] font-bold text-ink-900">Profile updated</h2>
            <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-ink-500">
              Your readiness for {role.title} roles, your skill gaps and every opportunity match
              have been recalculated from these answers.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button size="sm" onClick={() => nav('/student/gap')}>See my skill gaps <ArrowRight size={14} /></Button>
              <Button size="sm" variant="secondary" onClick={() => { setSubmitted(false); setAnswers({}) }}>
                <RotateCcw size={14} /> Assess again
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeading
        title="Skill assessment"
        lede={`Answer honestly — the whole platform works off these numbers. This assessment covers the ${questions.length} skills industry benchmarks for a ${role.title}.`}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card>
          <CardHeader title="Self assessment"
            subtitle={`${answeredCount} of ${questions.length} answered`}
            action={<Progress value={(answeredCount / questions.length) * 100} showTarget={false} className="w-24" />} />
          <div className="divide-y divide-hairline">
            {questions.map((q, i) => {
              const name = skillIndex[q.skillId]?.name ?? q.skillId
              const current = student.skills[q.skillId] ?? 0
              return (
                <div key={q.skillId} className="px-5 py-4">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[12px] font-semibold text-ink-400 tnum">{i + 1}</span>
                    <p className="text-[14.5px] font-semibold text-ink-900">{name}</p>
                    {q.critical && <Badge tone="high">Critical for this role</Badge>}
                    <span className="ml-auto text-[12px] text-ink-500 tnum">
                      on record: {current} · industry bar: {q.level}
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-ink-500">How would you describe your working level with {name}?</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {BANDS.map((b) => (
                      <button key={b.label}
                        onClick={() => setAnswers((a) => ({ ...a, [q.skillId]: b.value }))}
                        className={cn('rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors',
                          answers[q.skillId] === b.value
                            ? 'border-navy-900 bg-navy-900 text-white'
                            : 'border-hairline bg-white text-ink-700 hover:bg-canvas')}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <CardBody className="flex flex-wrap items-center gap-3 border-t border-hairline">
            <Button onClick={save} disabled={!complete}>
              Save and recalculate my readiness
            </Button>
            {!complete && <p className="text-[12.5px] text-ink-500">Answer all {questions.length} skills to continue.</p>}
          </CardBody>
        </Card>

        <div className="space-y-5 lg:sticky lg:top-[88px] lg:self-start">
          <Card>
            <CardBody className="flex flex-col items-center text-center">
              <p className="mb-3 text-[12.5px] font-medium text-ink-500">
                {preview ? 'Readiness with these answers' : 'Current readiness'}
              </p>
              <ReadinessGauge score={preview?.score ?? readiness.score} size={148} />
              {preview && preview.score !== readiness.score && (
                <p className={cn('mt-3 text-[13px] font-semibold', preview.score > readiness.score ? 'text-gap-ready' : 'text-gap-high')}>
                  {preview.score > readiness.score ? '↑' : '↓'} {Math.abs(preview.score - readiness.score)} points vs your saved profile
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-900">
                <ClipboardCheck size={13} className="text-ink-400" /> Verified assessments
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-500">
                Self-assessment gets you a working profile. A proctored SkillBridge assessment
                marks the skill verified, which carries more weight with recruiters and lifts the
                proof-of-work part of your score.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
