export type Role = 'student' | 'industry' | 'faculty' | 'institution'

export type SkillCategory = 'Technical Skills' | 'Soft Skills' | 'Tools' | 'Domain Skills'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
}

/** A single line item in an industry benchmark or an opportunity requirement. */
export interface SkillRequirement {
  skillId: string
  /** Proficiency the industry expects, 0-100. */
  level: number
  /** Relative importance used by the weighted engine. */
  weight: number
  /** Critical skills gate the readiness score — they cannot be compensated for. */
  critical?: boolean
}

export interface CareerRole {
  id: string
  title: string
  family: string
  /** What industry currently expects for this role, aggregated from live postings. */
  benchmark: SkillRequirement[]
  demandTrendPct: number
  medianStipend: number
  openings: number
}

export interface PortfolioEvidence {
  verifiedProjects: number
  certifications: number
  internships: number
  assessmentsCompleted: number
  hackathons: number
}

export interface Student {
  id: string
  name: string
  email: string
  avatarInitials: string
  institution: string
  branch: string
  year: string
  cgpa: number
  city: string
  careerGoalId: string
  /** skillId -> self/assessed proficiency 0-100 */
  skills: Record<string, number>
  verifiedSkillIds: string[]
  evidence: PortfolioEvidence
  readinessLastMonth: number
  about: string
  education: { degree: string; institution: string; period: string; score: string }[]
  projects: { title: string; description: string; stack: string[]; verified: boolean; link?: string }[]
  certifications: { title: string; issuer: string; issued: string; verified: boolean }[]
  achievements: { title: string; detail: string; year: string }[]
}

export interface Company {
  id: string
  name: string
  industry: string
  location: string
  size: string
  about: string
  logoInitials: string
  verified: boolean
}

export type OpportunityType = 'Internship' | 'Job' | 'Live Project'

export interface Opportunity {
  id: string
  companyId: string
  title: string
  type: OpportunityType
  location: string
  workMode: 'On-site' | 'Hybrid' | 'Remote'
  stipend: string
  duration: string
  postedOn: string
  applicants: number
  roleId: string
  requirements: SkillRequirement[]
  eligibility: { minCgpa: number; years: string[]; branches: string[] }
  description: string
  perks: string[]
  offersTraining: boolean
}

export type ApplicationStage = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected'

export interface Application {
  id: string
  studentId: string
  opportunityId: string
  appliedOn: string
  stage: ApplicationStage
  matchAtApply: number
  timeline: { stage: ApplicationStage; date: string; note?: string }[]
}

export interface LearningResource {
  id: string
  /** Prerequisite order inside a pathway. Lower runs first. */
  sequence: number
  /** Proficiency a learner holds once this module is genuinely complete. */
  masteryLevel: number
  title: string
  provider: string
  hours: number
  type: 'Course' | 'Project' | 'Assessment' | 'Mentorship'
  skillIds: string[]
  /** Proficiency this module is expected to add to each target skill. */
  levelGain: number
  url?: string
}

export interface FacultyProgram {
  id: string
  title: string
  company: string
  type: 'Faculty Internship' | 'Industrial Training' | 'FDP' | 'Workshop' | 'Research Collaboration' | 'Consultancy' | 'Guest Lecture' | 'Live Project'
  mode: string
  duration: string
  stipend: string
  deadline: string
  seats: number
  skillIds: string[]
  description: string
}

export interface Faculty {
  id: string
  name: string
  email: string
  avatarInitials: string
  designation: string
  department: string
  institution: string
  expertise: string[]
  publications: number
  consultancyValue: string
  programsCompleted: number
}

export interface CollaborationItem {
  id: string
  title: string
  company: string
  kind: 'Mentorship' | 'Guest Lecture' | 'Workshop' | 'Live Project' | 'Innovation Challenge' | 'Research'
  audience: string
  date: string
  seatsLeft: number
  status: 'Open' | 'Filling fast' | 'Closed'
  detail: string
}
