/**
 * SKILL INTELLIGENCE ENGINE
 * =========================
 * Deterministic, explainable scoring. No API keys, no network, no randomness —
 * the same inputs always produce the same numbers, which is what makes the
 * analysis defensible to a student ("why am I 62% ready?").
 *
 * Every exported function is pure and takes plain data, so any single scorer
 * can later be swapped for a trained ML model without touching the UI layer.
 */
import type {
  Application, CareerRole, LearningResource, Opportunity,
  PortfolioEvidence, Skill, SkillRequirement, Student,
} from './types'

/* ------------------------------------------------------------------ *
 * Tunable model constants — the whole model is legible in one screen.
 * ------------------------------------------------------------------ */
export const READINESS_WEIGHTS = {
  /** How much of the required proficiency the student actually covers. */
  coverage: 0.60,
  /** Critical skills must be cleared outright; they cannot be averaged away. */
  criticalClearance: 0.25,
  /** Verified proof of work: projects, certifications, internships. */
  evidence: 0.15,
} as const

export const MATCH_WEIGHTS = {
  skillCompatibility: 0.60,
  careerInterest: 0.20,
  eligibility: 0.10,
  experience: 0.10,
} as const

/** Self-paced learning rarely lands at 100%, so projections are discounted. */
export const ROADMAP_CONFIDENCE = 0.9

/** Ratio thresholds that turn a raw number into a status a student understands. */
export const GAP_THRESHOLDS = { met: 1.0, close: 0.6 } as const

export type SkillStatus = 'met' | 'close' | 'missing'

export interface SkillGap {
  skillId: string
  name: string
  category: string
  have: number
  need: number
  /** Points of proficiency still to gain. 0 when already met. */
  deficit: number
  ratio: number
  status: SkillStatus
  critical: boolean
  weight: number
  verified: boolean
}

export interface ReadinessBreakdown {
  score: number
  coverage: number
  criticalClearance: number
  evidence: number
  contributions: { label: string; weight: number; raw: number; points: number }[]
  gaps: SkillGap[]
  criticalSkillsTotal: number
  criticalSkillsCleared: number
}

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/** Capped coverage: exceeding the industry bar earns no bonus credit. */
export function coverageRatio(have: number, need: number) {
  if (need <= 0) return 1
  return Math.min(1, have / need)
}

export function statusFor(ratio: number): SkillStatus {
  if (ratio >= GAP_THRESHOLDS.met) return 'met'
  if (ratio >= GAP_THRESHOLDS.close) return 'close'
  return 'missing'
}

/** Weighted, capped coverage across a requirement set. Returns 0..1. */
export function weightedCoverage(
  skills: Record<string, number>,
  requirements: SkillRequirement[],
) {
  const totalWeight = requirements.reduce((s, r) => s + r.weight, 0)
  if (!totalWeight) return 0
  const earned = requirements.reduce(
    (s, r) => s + r.weight * coverageRatio(skills[r.skillId] ?? 0, r.level),
    0,
  )
  return earned / totalWeight
}

/**
 * Fraction of critical skills where the student has actually reached the
 * industry bar. Deliberately binary: being "almost there" on a core skill
 * still means a recruiter's filter rejects you.
 */
export function criticalClearance(
  skills: Record<string, number>,
  requirements: SkillRequirement[],
) {
  const critical = requirements.filter((r) => r.critical)
  if (!critical.length) return 1
  const cleared = critical.filter((r) => (skills[r.skillId] ?? 0) >= r.level).length
  return cleared / critical.length
}

/** Proof-of-work signal, 0..1. Verified evidence is what industry trusts. */
export function evidenceScore(e: PortfolioEvidence) {
  const raw =
    0.10 * e.verifiedProjects +
    0.08 * e.certifications +
    0.20 * e.internships +
    0.05 * e.assessmentsCompleted
  return Math.min(1, raw)
}

/* ------------------------------------------------------------------ *
 * 1. Industry Readiness
 * ------------------------------------------------------------------ */
export function computeReadiness(
  student: Student,
  role: CareerRole,
  skillIndex: Record<string, Skill>,
): ReadinessBreakdown {
  const cov = weightedCoverage(student.skills, role.benchmark)
  const crit = criticalClearance(student.skills, role.benchmark)
  const ev = evidenceScore(student.evidence)

  const contributions = [
    { label: 'Skill coverage vs industry bar', weight: READINESS_WEIGHTS.coverage, raw: cov, points: READINESS_WEIGHTS.coverage * cov * 100 },
    { label: 'Critical skills cleared', weight: READINESS_WEIGHTS.criticalClearance, raw: crit, points: READINESS_WEIGHTS.criticalClearance * crit * 100 },
    { label: 'Verified proof of work', weight: READINESS_WEIGHTS.evidence, raw: ev, points: READINESS_WEIGHTS.evidence * ev * 100 },
  ]

  const criticalReqs = role.benchmark.filter((r) => r.critical)

  return {
    score: Math.round(contributions.reduce((s, c) => s + c.points, 0)),
    coverage: cov,
    criticalClearance: crit,
    evidence: ev,
    contributions,
    gaps: buildGaps(student, role.benchmark, skillIndex),
    criticalSkillsTotal: criticalReqs.length,
    criticalSkillsCleared: criticalReqs.filter((r) => (student.skills[r.skillId] ?? 0) >= r.level).length,
  }
}

export function buildGaps(
  student: Student,
  requirements: SkillRequirement[],
  skillIndex: Record<string, Skill>,
): SkillGap[] {
  return requirements
    .map((r) => {
      const have = student.skills[r.skillId] ?? 0
      const ratio = coverageRatio(have, r.level)
      return {
        skillId: r.skillId,
        name: skillIndex[r.skillId]?.name ?? r.skillId,
        category: skillIndex[r.skillId]?.category ?? 'Technical Skills',
        have,
        need: r.level,
        deficit: Math.max(0, r.level - have),
        ratio,
        status: statusFor(ratio),
        critical: !!r.critical,
        weight: r.weight,
        verified: student.verifiedSkillIds.includes(r.skillId),
      }
    })
    .sort((a, b) => b.deficit * b.weight - a.deficit * a.weight)
}

/**
 * "How can I become ready?" — readiness recomputed as if every gap were
 * closed to exactly the industry bar, discounted by a completion-confidence
 * factor so the projection stays honest.
 */
export function projectReadiness(student: Student, role: CareerRole) {
  const projectedSkills = { ...student.skills }
  for (const r of role.benchmark) {
    projectedSkills[r.skillId] = Math.max(projectedSkills[r.skillId] ?? 0, r.level)
  }
  const cov = weightedCoverage(projectedSkills, role.benchmark)
  const crit = criticalClearance(projectedSkills, role.benchmark)
  const ev = evidenceScore(student.evidence)
  const skillPoints =
    (READINESS_WEIGHTS.coverage * cov + READINESS_WEIGHTS.criticalClearance * crit) * 100
  const score = skillPoints * ROADMAP_CONFIDENCE + READINESS_WEIGHTS.evidence * ev * 100
  return { score: Math.round(score), projectedSkills }
}

/* ------------------------------------------------------------------ *
 * 2. Opportunity Matching
 * ------------------------------------------------------------------ */
export interface MatchResult {
  score: number
  skillCompatibility: number
  careerInterest: number
  eligibility: number
  experience: number
  breakdown: { label: string; weight: number; raw: number; points: number }[]
  skills: SkillGap[]
  met: SkillGap[]
  close: SkillGap[]
  missing: SkillGap[]
  eligible: boolean
  eligibilityNotes: string[]
}

/** Alignment between the posting and what the student is actually aiming for. */
export function careerInterestScore(student: Student, opp: Opportunity, roles: CareerRole[]) {
  if (opp.roleId === student.careerGoalId) return 1
  const goal = roles.find((r) => r.id === student.careerGoalId)
  const oppRole = roles.find((r) => r.id === opp.roleId)
  if (goal && oppRole && goal.family === oppRole.family) return 0.7
  return 0.35
}

export function eligibilityScore(student: Student, opp: Opportunity) {
  const notes: string[] = []
  let passed = 0
  const checks = 3
  if (student.cgpa >= opp.eligibility.minCgpa) passed++
  else notes.push(`Needs CGPA ${opp.eligibility.minCgpa}+ (you have ${student.cgpa})`)
  if (opp.eligibility.years.includes(student.year)) passed++
  else notes.push(`Open to ${opp.eligibility.years.join(', ')} year students`)
  if (opp.eligibility.branches.includes('Any') || opp.eligibility.branches.includes(student.branch)) passed++
  else notes.push(`Open to ${opp.eligibility.branches.join(', ')}`)
  return { score: passed / checks, notes, eligible: passed === checks }
}

export function experienceScore(e: PortfolioEvidence) {
  const raw =
    0.30 * e.internships + 0.18 * e.verifiedProjects + 0.08 * e.certifications + 0.10 * e.hackathons
  return Math.min(1, raw)
}

export function computeMatch(
  student: Student,
  opp: Opportunity,
  roles: CareerRole[],
  skillIndex: Record<string, Skill>,
): MatchResult {
  const compat = weightedCoverage(student.skills, opp.requirements)
  const interest = careerInterestScore(student, opp, roles)
  const elig = eligibilityScore(student, opp)
  const exp = experienceScore(student.evidence)

  const breakdown = [
    { label: 'Skill compatibility', weight: MATCH_WEIGHTS.skillCompatibility, raw: compat, points: MATCH_WEIGHTS.skillCompatibility * compat * 100 },
    { label: 'Career interest fit', weight: MATCH_WEIGHTS.careerInterest, raw: interest, points: MATCH_WEIGHTS.careerInterest * interest * 100 },
    { label: 'Eligibility', weight: MATCH_WEIGHTS.eligibility, raw: elig.score, points: MATCH_WEIGHTS.eligibility * elig.score * 100 },
    { label: 'Experience & proof of work', weight: MATCH_WEIGHTS.experience, raw: exp, points: MATCH_WEIGHTS.experience * exp * 100 },
  ]

  const skills = buildGaps(student, opp.requirements, skillIndex)

  return {
    score: Math.round(breakdown.reduce((s, b) => s + b.points, 0)),
    skillCompatibility: compat,
    careerInterest: interest,
    eligibility: elig.score,
    experience: exp,
    breakdown,
    skills,
    met: skills.filter((s) => s.status === 'met'),
    close: skills.filter((s) => s.status === 'close'),
    missing: skills.filter((s) => s.status === 'missing'),
    eligible: elig.eligible,
    eligibilityNotes: elig.notes,
  }
}

/** Plain-language explanation of a match score, for the opportunity card. */
export function matchAdvice(m: MatchResult) {
  if (m.score >= 90) return 'Strong match. Your verified skills clear every requirement in this posting.'
  if (m.score >= 75) {
    const names = [...m.close, ...m.missing].slice(0, 2).map((s) => s.name)
    return names.length
      ? `You are close to being ready. Improve ${names.join(' and ')} to increase your match score.`
      : 'You are close to being ready for this role.'
  }
  if (m.score >= 55) {
    const names = m.missing.slice(0, 2).map((s) => s.name)
    return `Worth building towards. ${names.join(' and ')} ${names.length > 1 ? 'are' : 'is'} the blocker here.`
  }
  return 'A stretch role for now. Follow your roadmap and revisit this in a few weeks.'
}

/* ------------------------------------------------------------------ *
 * 3. Personalised Roadmap
 * ------------------------------------------------------------------ */
export interface RoadmapStep {
  order: number
  resource: LearningResource
  targetSkills: string[]
  status: 'completed' | 'current' | 'upcoming'
  /** Points of proficiency this module closes for the student's live gaps. */
  closesGap: number
}

/**
 * A roadmap is the role's prerequisite-ordered pathway, with each module's
 * status derived from the student's actual proficiency. A module counts as
 * completed only when every skill it teaches is at or above its mastery level,
 * so the roadmap doubles as a progress record rather than a static syllabus.
 */
export function buildRoadmap(
  student: Student,
  pathwayIds: string[],
  resourceIndex: Record<string, LearningResource>,
  gaps: SkillGap[],
  skillIndex: Record<string, Skill>,
): RoadmapStep[] {
  const gapById = new Map(gaps.map((g) => [g.skillId, g]))
  let currentAssigned = false

  return pathwayIds
    .map((id) => resourceIndex[id])
    .filter(Boolean)
    .sort((a, b) => a.sequence - b.sequence)
    .map((resource, i) => {
      const complete = resource.skillIds.every(
        (sid) => (student.skills[sid] ?? 0) >= resource.masteryLevel,
      )
      let status: RoadmapStep['status']
      if (complete) status = 'completed'
      else if (!currentAssigned) { status = 'current'; currentAssigned = true }
      else status = 'upcoming'

      const closesGap = resource.skillIds.reduce(
        (sum, sid) => sum + Math.min(resource.levelGain, gapById.get(sid)?.deficit ?? 0),
        0,
      )

      return {
        order: i + 1,
        resource,
        targetSkills: resource.skillIds.map((sid) => skillIndex[sid]?.name ?? sid),
        status,
        closesGap,
      }
    })
}

/** Gaps a student should attack first: critical skills, nearest bar first. */
export function prioritiseGaps(gaps: SkillGap[]) {
  return gaps
    .filter((g) => g.deficit > 0)
    .sort((a, b) => {
      if (a.critical !== b.critical) return a.critical ? -1 : 1
      return a.deficit - b.deficit
    })
}

/**
 * Skill depth: how far a student is *above* the bar, credited up to 130% of
 * the requirement. Not part of the match score — it exists to separate
 * candidates who all clear every requirement.
 */
export function skillDepth(
  skills: Record<string, number>,
  requirements: SkillRequirement[],
  cap = 1.3,
) {
  const totalWeight = requirements.reduce((s, r) => s + r.weight, 0)
  if (!totalWeight) return 0
  const earned = requirements.reduce(
    (s, r) => s + r.weight * Math.min(cap, (skills[r.skillId] ?? 0) / (r.level || 1)),
    0,
  )
  return earned / totalWeight / cap
}

/* ------------------------------------------------------------------ *
 * 4. Recruiter-side ranking
 * ------------------------------------------------------------------ */
export function rankCandidates(
  students: Student[],
  opp: Opportunity,
  roles: CareerRole[],
  skillIndex: Record<string, Skill>,
) {
  return students
    .map((student) => ({
      student,
      match: computeMatch(student, opp, roles, skillIndex),
      depth: skillDepth(student.skills, opp.requirements),
    }))
    // Candidates who clear every requirement all score 100, so depth of
    // proficiency is the honest tie-breaker rather than an arbitrary nudge.
    .sort((a, b) => b.match.score - a.match.score || b.depth - a.depth)
}

/* ------------------------------------------------------------------ *
 * 5. Institution-level aggregation
 * ------------------------------------------------------------------ */
export type ReadinessBandName = 'Industry ready' | 'Developing' | 'Needs training'

/**
 * A student is only "industry ready" when they clear *every* critical skill.
 * A strong average with one unmet core skill still fails a recruiter's filter,
 * so averaging it away would give institutions a falsely comfortable picture.
 */
export function readinessBand(score: number, criticalClearanceRatio = 1): ReadinessBandName {
  if (score >= 75 && criticalClearanceRatio >= 1) return 'Industry ready'
  if (score >= 50) return 'Developing'
  return 'Needs training'
}

export function aggregateReadiness(
  students: Student[],
  roles: CareerRole[],
  skillIndex: Record<string, Skill>,
) {
  const roleById = Object.fromEntries(roles.map((r) => [r.id, r]))
  const scored = students.map((s) => {
    const role = roleById[s.careerGoalId] ?? roles[0]
    const r = computeReadiness(s, role, skillIndex)
    return {
      student: s, role, readiness: r.score, breakdown: r,
      band: readinessBand(r.score, r.criticalClearance),
    }
  })
  const bands = { 'Industry ready': 0, Developing: 0, 'Needs training': 0 }
  for (const s of scored) bands[s.band]++
  const total = scored.length || 1
  return {
    scored,
    average: Math.round(scored.reduce((a, b) => a + b.readiness, 0) / total),
    bands,
    bandPct: {
      'Industry ready': Math.round((bands['Industry ready'] / total) * 100),
      Developing: Math.round((bands.Developing / total) * 100),
      'Needs training': Math.round((bands['Needs training'] / total) * 100),
    },
  }
}

/** Which skills the largest share of our students are short on. */
export function topSkillGaps(
  students: Student[],
  roles: CareerRole[],
  skillIndex: Record<string, Skill>,
  limit = 6,
) {
  const roleById = Object.fromEntries(roles.map((r) => [r.id, r]))
  const tally = new Map<string, { affected: number; deficitSum: number }>()
  for (const s of students) {
    const role = roleById[s.careerGoalId] ?? roles[0]
    for (const g of buildGaps(s, role.benchmark, skillIndex)) {
      if (g.deficit <= 0) continue
      const t = tally.get(g.skillId) ?? { affected: 0, deficitSum: 0 }
      t.affected++
      t.deficitSum += g.deficit
      tally.set(g.skillId, t)
    }
  }
  return [...tally.entries()]
    .map(([skillId, t]) => ({
      skillId,
      name: skillIndex[skillId]?.name ?? skillId,
      category: skillIndex[skillId]?.category ?? '',
      affected: t.affected,
      affectedPct: Math.round((t.affected / (students.length || 1)) * 100),
      avgDeficit: Math.round(t.deficitSum / t.affected),
    }))
    .sort((a, b) => b.affected * b.avgDeficit - a.affected * a.avgDeficit)
    .slice(0, limit)
}

export function applicationFunnel(apps: Application[]) {
  const stages: Application['stage'][] = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']
  return stages.map((stage) => ({ stage, count: apps.filter((a) => a.timeline.some((t) => t.stage === stage)).length }))
}
