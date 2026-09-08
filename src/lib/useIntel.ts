import { useMemo } from 'react'
import { useApp } from '@/store'
import { careerRoles, roleIndex, rolePathways, resourceIndex, skillIndex } from '@/lib/data/skills'
import { buildRoadmap, computeMatch, computeReadiness, matchAdvice, projectReadiness, prioritiseGaps } from '@/lib/engine'

/**
 * Single source of truth for everything the student-side screens display, so
 * the dashboard, gap analysis and opportunity cards can never disagree.
 */
export function useIntel() {
  const { student, opportunities, applications } = useApp()

  return useMemo(() => {
    const role = roleIndex[student.careerGoalId] ?? careerRoles[0]
    const readiness = computeReadiness(student, role, skillIndex)
    const projection = projectReadiness(student, role)
    const roadmap = buildRoadmap(student, rolePathways[role.id] ?? [], resourceIndex, readiness.gaps, skillIndex)

    const matches = opportunities
      .map((opp) => {
        const match = computeMatch(student, opp, careerRoles, skillIndex)
        return { opp, match, advice: matchAdvice(match) }
      })
      .sort((a, b) => b.match.score - a.match.score)

    const myApplications = applications
      .filter((a) => a.studentId === student.id)
      .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))

    const completed = roadmap.filter((s) => s.status === 'completed').length

    return {
      role, readiness, projection, roadmap, matches, myApplications,
      priorityGaps: prioritiseGaps(readiness.gaps),
      delta: readiness.score - student.readinessLastMonth,
      roadmapProgress: roadmap.length ? Math.round((completed / roadmap.length) * 100) : 0,
      currentStep: roadmap.find((s) => s.status === 'current'),
    }
  }, [student, opportunities, applications])
}
