import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useApp } from '@/store'
import { companyIndex } from '@/lib/data'
import { skillIndex } from '@/lib/data/skills'
import { Badge, Card, CardBody, EmptyState, LinkButton, PageHeading } from '@/components/ui/primitives'
import { relativeDate } from '@/lib/utils'

const MY_COMPANY = 'co-001'

export default function Postings() {
  const { opportunities } = useApp()
  const mine = opportunities.filter((o) => o.companyId === MY_COMPANY)

  return (
    <div>
      <PageHeading title="My postings"
        lede="Each posting carries its own required skills and minimum eligibility, which is what the matching engine scores students against."
        action={<LinkButton to="/industry/post" size="sm">Post an opportunity</LinkButton>} />

      {mine.length === 0 ? (
        <Card>
          <EmptyState icon={<Users size={28} />} title="No postings yet"
            body="Publish an internship, job or live project and matched students will start appearing immediately."
            action={<LinkButton to="/industry/post" size="sm">Post an opportunity</LinkButton>} />
        </Card>
      ) : (
        <div className="space-y-4">
          {mine.map((o) => (
            <Card key={o.id}>
              <CardBody className="flex flex-wrap items-start gap-4 py-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15.5px] font-semibold text-ink-900">
                      <Link to={`/industry/postings/${o.id}`} className="hover:text-navy-700">{o.title}</Link>
                    </h3>
                    <Badge tone="navy">{o.type}</Badge>
                    {o.offersTraining && <Badge tone="ready">Training offered</Badge>}
                  </div>
                  <p className="mt-1 text-[12.5px] text-ink-500">
                    {companyIndex[o.companyId].name} · {o.location} · {o.stipend} · posted {relativeDate(o.postedOn)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.requirements.map((r) => (
                      <Badge key={r.skillId} tone={r.critical ? 'high' : 'neutral'}>
                        {skillIndex[r.skillId]?.name ?? r.skillId} · {r.level}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-[12px] text-ink-400">
                    Eligibility: CGPA {o.eligibility.minCgpa}+ · {o.eligibility.years.join(', ')} year · {o.eligibility.branches.join(', ')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-display text-[24px] font-bold leading-none text-ink-900 tnum">{o.applicants}</p>
                  <p className="text-[12px] text-ink-500">applications</p>
                  <LinkButton to={`/industry/postings/${o.id}`} size="sm" variant="secondary">View matches</LinkButton>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
