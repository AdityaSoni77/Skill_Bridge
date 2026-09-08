import { Link } from 'react-router-dom'
import { MapPin, IndianRupee, Clock, Bookmark, BookmarkCheck, GraduationCap } from 'lucide-react'
import type { Opportunity } from '@/lib/types'
import type { MatchResult } from '@/lib/engine'
import { companyIndex } from '@/lib/data'
import { Avatar, Badge, Card, VerifiedTag } from './ui/primitives'
import { MatchRing } from './MatchRing'
import { StatusChip } from './SkillStatus'
import { useApp } from '@/store'
import { cn } from '@/lib/utils'

export function OpportunityCard({
  opp, match, advice,
}: { opp: Opportunity; match: MatchResult; advice: string }) {
  const co = companyIndex[opp.companyId]
  const { savedIds, toggleSave, hasApplied } = useApp()
  const saved = savedIds.includes(opp.id)
  const applied = hasApplied(opp.id)
  // Order the requirement chips the way a student reads them: wins, then work.
  const ordered = [...match.met, ...match.close, ...match.missing]

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-pop">
      <div className="flex items-start gap-3 p-5 pb-4">
        <Avatar initials={co.logoInitials} size={40} tone="light" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[13px] font-medium text-ink-700">{co.name}</p>
            {co.verified && <VerifiedTag label="Verified" />}
          </div>
          <h3 className="mt-0.5 truncate text-[15.5px] font-semibold text-ink-900">
            <Link to={`/student/opportunities/${opp.id}`} className="hover:text-navy-700">{opp.title}</Link>
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px] text-ink-500">
            <span className="inline-flex items-center gap-1"><MapPin size={12.5} />{opp.location} · {opp.workMode}</span>
            <span className="inline-flex items-center gap-1 tnum"><IndianRupee size={12.5} />{opp.stipend.replace('₹', '')}</span>
            <span className="inline-flex items-center gap-1"><Clock size={12.5} />{opp.duration}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <MatchRing score={match.score} />
          <span className="text-[11px] font-medium text-ink-500">match</span>
        </div>
      </div>

      <div className="border-t border-hairline px-5 py-3.5">
        <div className="flex flex-wrap gap-1.5">
          {ordered.map((s) => <StatusChip key={s.skillId} status={s.status} name={s.name} />)}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">{advice}</p>
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-hairline px-5 py-3">
        <Badge tone={opp.type === 'Internship' ? 'navy' : opp.type === 'Job' ? 'saffron' : 'neutral'}>{opp.type}</Badge>
        {opp.offersTraining && (
          <Badge tone="neutral"><GraduationCap size={11} /> Training offered</Badge>
        )}
        {applied && <Badge tone="ready">Applied</Badge>}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => toggleSave(opp.id)} title={saved ? 'Remove from saved' : 'Save for later'}
            className={cn('rounded-md p-1.5 transition-colors', saved ? 'text-navy-700' : 'text-ink-400 hover:text-ink-700')}>
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          <Link to={`/student/opportunities/${opp.id}`}
            className="rounded-lg border border-hairline px-3 py-1.5 text-[13px] font-medium text-ink-700 hover:bg-canvas hover:text-ink-900">
            View opportunity
          </Link>
        </div>
      </div>
    </Card>
  )
}
