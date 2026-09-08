import { computeReadiness, computeMatch, projectReadiness, buildRoadmap, rankCandidates, aggregateReadiness, topSkillGaps } from '../src/lib/engine'
import { skillIndex, careerRoles, roleIndex, rolePathways, resourceIndex } from '../src/lib/data/skills'
import { adityaSoni, cohort, homeCohort } from '../src/lib/data/students'
import { opportunityIndex } from '../src/lib/data/opportunities'

const role = roleIndex[adityaSoni.careerGoalId]
const r = computeReadiness(adityaSoni, role, skillIndex)
console.log('READINESS =', r.score, '| target 62')
console.log('  components:', r.contributions.map(c => `${c.label}=${c.raw.toFixed(3)}→${c.points.toFixed(2)}pts`).join('\n              '))
console.log('  delta vs last month:', r.score - adityaSoni.readinessLastMonth, '| target +8')
console.log('PROJECTED =', projectReadiness(adityaSoni, role).score, '| target 84')

const m = computeMatch(adityaSoni, opportunityIndex['opp-001'], careerRoles, skillIndex)
console.log('\nMATCH opp-001 (ABC Technologies) =', m.score, '| target 87')
console.log('  met:', m.met.map(s => s.name).join(', '))
console.log('  close:', m.close.map(s => s.name).join(', '))
console.log('  missing:', m.missing.map(s => s.name).join(', '))

console.log('\nGAP TABLE (demo step 2):')
for (const g of r.gaps) console.log(`  ${g.name.padEnd(14)} ${g.have}/${g.need}  ${g.status}${g.critical ? '  [critical]' : ''}`)

console.log('\nROADMAP:')
for (const s of buildRoadmap(adityaSoni, rolePathways[role.id], resourceIndex, r.gaps, skillIndex))
  console.log(`  ${s.status.padEnd(10)} ${s.order}. ${s.resource.title}`)

console.log('\nALL MATCHES for Aditya:')
for (const o of Object.values(opportunityIndex)) {
  const mm = computeMatch(adityaSoni, o, careerRoles, skillIndex)
  console.log(`  ${String(mm.score).padStart(3)}%  ${o.title} — ${o.type}${mm.eligible ? '' : '  (not eligible)'}`)
}

console.log('\nRECRUITER RANKING opp-001:')
for (const c of rankCandidates(cohort, opportunityIndex['opp-001'], careerRoles, skillIndex).slice(0, 6))
  console.log(`  ${c.match.score}%  ${c.student.name} (${c.student.institution})`)

const agg = aggregateReadiness(homeCohort, careerRoles, skillIndex)
console.log('\nINSTITUTION bands:', agg.bandPct, 'avg', agg.average, '| target ~38/44/18')
console.log('TOP GAPS:', topSkillGaps(homeCohort, careerRoles, skillIndex, 5).map(g => `${g.name} (${g.affectedPct}%)`).join(', '))
