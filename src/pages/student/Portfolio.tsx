import { Award, Briefcase, ExternalLink, FileDown, FolderGit2, GraduationCap, Mail, MapPin, Trophy } from 'lucide-react'
import { useApp } from '@/store'
import { useIntel } from '@/lib/useIntel'
import { skillIndex } from '@/lib/data/skills'
import { Avatar, Badge, Button, Card, CardBody, CardHeader, PageHeading, Progress, VerifiedTag } from '@/components/ui/primitives'
import { ReadinessGauge } from '@/components/ReadinessGauge'
import { formatDate } from '@/lib/utils'

export default function Portfolio() {
  const { student, notify } = useApp()
  const { readiness, role, myApplications } = useIntel()

  const topSkills = Object.entries(student.skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  return (
    <div>
      <PageHeading
        title="Digital portfolio"
        lede="This is what a recruiter sees. Verified items were confirmed by the issuing institution, a company or a SkillBridge assessment."
        action={
          <Button size="sm" variant="secondary" onClick={() => notify('Resume generated', 'A PDF of this portfolio has been prepared for download.')}>
            <FileDown size={14} /> Download resume
          </Button>
        }
      />

      <Card className="mb-6 overflow-hidden">
        <div className="h-20 bg-navy-900" />
        <div className="px-6 pb-6">
          <div className="-mt-9 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <span className="rounded-full ring-4 ring-white"><Avatar initials={student.avatarInitials} size={72} /></span>
              <div className="pb-1">
                <h2 className="font-display text-[22px] font-bold leading-tight text-ink-900">{student.name}</h2>
                <p className="mt-0.5 text-[13.5px] text-ink-500">
                  {student.year} year · {student.branch} · CGPA {student.cgpa}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-1">
              <ReadinessGauge score={readiness.score} size={104} caption="industry ready" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-ink-500">
            <span className="inline-flex items-center gap-1.5"><GraduationCap size={13} />{student.institution}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} />{student.city}</span>
            <span className="inline-flex items-center gap-1.5"><Mail size={13} />{student.email}</span>
            <Badge tone="navy">Career goal: {role.title}</Badge>
          </div>

          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-ink-700">{student.about}</p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Projects" subtitle={`${student.projects.filter((p) => p.verified).length} of ${student.projects.length} verified`} />
            <div className="divide-y divide-hairline">
              {student.projects.map((p) => (
                <div key={p.title} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <FolderGit2 size={14} className="text-ink-400" />
                    <p className="text-[14.5px] font-semibold text-ink-900">{p.title}</p>
                    {p.verified ? <VerifiedTag /> : <Badge tone="neutral">Self-reported</Badge>}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{p.description}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {p.stack.map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
                    {p.link && (
                      <span className="ml-1 inline-flex items-center gap-1 text-[12px] text-navy-700">
                        <ExternalLink size={11} />{p.link}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Certifications" />
            <div className="divide-y divide-hairline">
              {student.certifications.map((c) => (
                <div key={c.title} className="flex items-center gap-3 px-5 py-3.5">
                  <Award size={15} className="shrink-0 text-ink-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-ink-900">{c.title}</p>
                    <p className="text-[12px] text-ink-500">{c.issuer} · {formatDate(c.issued)}</p>
                  </div>
                  {c.verified ? <VerifiedTag /> : <Badge tone="neutral">Unverified</Badge>}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Achievements" />
            <div className="divide-y divide-hairline">
              {student.achievements.map((a) => (
                <div key={a.title} className="flex items-start gap-3 px-5 py-3.5">
                  <Trophy size={15} className="mt-0.5 shrink-0 text-saffron-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink-900">{a.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-[12px] text-ink-400 tnum">{a.year}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Education" />
            <div className="divide-y divide-hairline">
              {student.education.map((e) => (
                <div key={e.degree} className="flex items-center gap-3 px-5 py-3.5">
                  <GraduationCap size={15} className="shrink-0 text-ink-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-ink-900">{e.degree}</p>
                    <p className="text-[12px] text-ink-500">{e.institution} · {e.period}</p>
                  </div>
                  <span className="shrink-0 text-[12.5px] font-medium text-ink-700 tnum">{e.score}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Verified skills" subtitle="Top proficiencies on record" />
            <CardBody className="space-y-2.5">
              {topSkills.map(([id, v]) => (
                <div key={id}>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="flex items-center gap-1.5 text-ink-700">
                      {skillIndex[id]?.name ?? id}
                      {student.verifiedSkillIds.includes(id) && <VerifiedTag label="✓" />}
                    </span>
                    <span className="text-ink-500 tnum">{v}</span>
                  </div>
                  <Progress value={v} showTarget={false} className="mt-1 h-1.5" />
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Internships & experience" />
            <CardBody>
              {student.evidence.internships > 0 ? (
                <p className="text-[13px] text-ink-700">{student.evidence.internships} completed internships on record.</p>
              ) : (
                <div className="flex items-start gap-2.5">
                  <Briefcase size={15} className="mt-0.5 shrink-0 text-ink-400" />
                  <p className="text-[12.5px] leading-relaxed text-ink-500">
                    No internship yet. You have {myApplications.length} live applications — one is
                    already at interview stage.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-[12.5px] font-semibold text-ink-900">Shareable profile</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">
                skillbridge.gov.in/p/{student.name.toLowerCase().replace(/ /g, '-')}
              </p>
              <Button size="sm" variant="secondary" className="mt-3 w-full"
                onClick={() => notify('Link copied', 'Your public portfolio link is ready to share.')}>
                Copy profile link
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
