import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Briefcase } from 'lucide-react'
import { useIntel } from '@/lib/useIntel'
import { OpportunityCard } from '@/components/OpportunityCard'
import { Card, EmptyState, PageHeading, Tabs, Button } from '@/components/ui/primitives'
import { companyIndex } from '@/lib/data'
import { useApp } from '@/store'

type Filter = 'recommended' | 'Internship' | 'Job' | 'Live Project' | 'saved'

export default function Opportunities() {
  const { matches, role } = useIntel()
  const { savedIds } = useApp()
  const [tab, setTab] = useState<Filter>('recommended')
  const [q, setQ] = useState('')
  const [minMatch, setMinMatch] = useState(0)
  const [eligibleOnly, setEligibleOnly] = useState(false)

  const visible = useMemo(() => {
    return matches.filter(({ opp, match }) => {
      if (tab === 'saved' && !savedIds.includes(opp.id)) return false
      if (tab !== 'recommended' && tab !== 'saved' && opp.type !== tab) return false
      if (match.score < minMatch) return false
      if (eligibleOnly && !match.eligible) return false
      if (q) {
        const hay = `${opp.title} ${companyIndex[opp.companyId].name} ${opp.location}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) return false
      }
      return true
    })
  }, [matches, tab, q, minMatch, eligibleOnly, savedIds])

  return (
    <div>
      <PageHeading
        title="Opportunities"
        lede={`Every posting is scored against your live skill profile: 60% skill compatibility, 20% career interest, 10% eligibility, 10% experience. You are being matched as a ${role.title}.`}
      />

      <Card className="mb-5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search role, company or city"
              className="h-9 w-full rounded-lg border border-hairline pl-9 pr-3 text-[13.5px] placeholder:text-ink-400 focus:border-navy-500" />
          </div>
          <label className="flex items-center gap-2 text-[13px] text-ink-700">
            <SlidersHorizontal size={14} className="text-ink-400" />
            Minimum match
            <input type="range" min={0} max={95} step={5} value={minMatch} onChange={(e) => setMinMatch(+e.target.value)}
              className="w-24 accent-navy-900" />
            <span className="w-8 text-[13px] font-semibold tnum">{minMatch}%</span>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-ink-700">
            <input type="checkbox" checked={eligibleOnly} onChange={(e) => setEligibleOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded accent-navy-900" />
            Only where I am eligible
          </label>
        </div>
      </Card>

      <div className="mb-5">
        <Tabs<Filter>
          active={tab} onChange={setTab}
          tabs={[
            { id: 'recommended', label: 'All matches', count: matches.length },
            { id: 'Internship', label: 'Internships', count: matches.filter((m) => m.opp.type === 'Internship').length },
            { id: 'Job', label: 'Jobs', count: matches.filter((m) => m.opp.type === 'Job').length },
            { id: 'Live Project', label: 'Live projects', count: matches.filter((m) => m.opp.type === 'Live Project').length },
            { id: 'saved', label: 'Saved', count: savedIds.length },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No opportunities match these filters"
            body="Lower the minimum match or clear the search to see the full list. Postings are added by companies throughout the semester."
            action={<Button size="sm" variant="secondary" onClick={() => { setQ(''); setMinMatch(0); setEligibleOnly(false); setTab('recommended') }}>Clear filters</Button>}
          />
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((m) => <OpportunityCard key={m.opp.id} {...m} />)}
        </div>
      )}
    </div>
  )
}
