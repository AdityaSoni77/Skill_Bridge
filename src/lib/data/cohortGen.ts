/**
 * GENERATED COHORT
 * ================
 * The sixteen hand-written students in `students.ts` carry the demo narrative.
 * Institution and faculty dashboards, though, report *population* statistics —
 * "38% of our students are industry ready" is meaningless computed over sixteen
 * rows, and percentages jump in 6-point steps.
 *
 * This module seeds a realistic population so those aggregates are smooth and
 * defensible. It is fully deterministic: a fixed linear-congruential generator
 * means the dashboards show identical numbers on every run and every machine,
 * which matters when the same figure has to appear twice in a live demo.
 *
 * Generated students are deliberately capped below the curated high performers,
 * so the recruiter leaderboard still surfaces the named students in the script.
 */
import type { PortfolioEvidence, Student } from '../types'
import { careerRoles } from './skills'

/** Deterministic PRNG — same sequence every time, no Math.random anywhere. */
function makeRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const FIRST = [
  'Aarav', 'Aditi', 'Akash', 'Ayush', 'Bhavna', 'Chirag', 'Deepak', 'Divya', 'Gaurav', 'Harshita',
  'Jatin', 'Kartik', 'Khushi', 'Lakshya', 'Mahi', 'Manish', 'Nikhil', 'Nandini', 'Palak', 'Parth',
  'Pranjal', 'Radhika', 'Ritika', 'Sagar', 'Sakshi', 'Sarthak', 'Shreya', 'Shubham', 'Tanvi',
  'Tushar', 'Vaishnavi', 'Varun', 'Yash', 'Kritika', 'Mayank', 'Nisha', 'Pankaj', 'Rachit',
  'Sanya', 'Siddharth', 'Swati', 'Vivek', 'Anjali', 'Imran', 'Farhan', 'Zoya', 'Ojas', 'Meera',
]
const LAST = [
  'Agrawal', 'Bhargava', 'Chouksey', 'Dubey', 'Gupta', 'Joshi', 'Kushwaha', 'Lodhi', 'Malviya',
  'Mandloi', 'Mehta', 'Mishra', 'Nagar', 'Pandey', 'Parmar', 'Patidar', 'Rathore', 'Saxena',
  'Shukla', 'Solanki', 'Thakur', 'Trivedi', 'Yadav', 'Chourasia', 'Sisodiya', 'Khan', 'Nema',
]

/** Branch mix mirrors the department roll in `institution.ts`. */
const BRANCHES: [string, number][] = [
  ['Computer Science', 34], ['Information Technology', 24], ['Electronics & Telecom', 20],
  ['Mechanical Engineering', 14], ['Civil Engineering', 8],
]
const GOALS: [string, number][] = [
  ['fsd', 34], ['data', 24], ['ml', 16], ['cloud', 14], ['cyber', 12],
]
const YEARS: [string, number][] = [['2nd', 26], ['3rd', 38], ['4th', 36]]

/** Most students are at SGSITS; a few peers make the recruiter pool realistic. */
const INSTITUTIONS: [string, number][] = [
  ['SGSITS, Indore', 80], ['IET DAVV, Indore', 9], ['IIT Indore', 5], ['Acropolis Institute, Indore', 6],
]

function weightedPick<T>(rand: () => number, table: [T, number][]): T {
  const total = table.reduce((s, [, w]) => s + w, 0)
  let r = rand() * total
  for (const [value, w] of table) {
    r -= w
    if (r <= 0) return value
  }
  return table[table.length - 1][0]
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

/** Skills every student picks up regardless of specialisation. */
const COMMON_SKILLS = ['git', 'communication', 'teamwork', 'problemsolving', 'ownership', 'presentation']

const PROJECT_BY_GOAL: Record<string, [string, string, string[]]> = {
  fsd: ['Department Notice Board', 'Web app replacing the paper notice board for one department, used across two semesters.', ['JavaScript', 'SQL']],
  data: ['Placement Data Dashboard', 'Cleaned five years of placement records and published a departmental dashboard.', ['Python', 'Power BI']],
  ml: ['Attendance from Class Photos', 'Face-recognition prototype for marking attendance from a single classroom photograph.', ['Python', 'OpenCV']],
  cloud: ['Lab Server Automation', 'Automated provisioning of the programming lab machines before each practical.', ['Linux', 'Docker']],
  cyber: ['Wi-Fi Security Review', 'Documented weak configurations on the department wireless network and proposed fixes.', ['Linux', 'Wireshark']],
}
const CERT_BY_GOAL: Record<string, [string, string]> = {
  fsd: ['Programming in JavaScript', 'Infosys Springboard'],
  data: ['Data Analytics Foundations', 'NPTEL'],
  ml: ['Introduction to Machine Learning', 'Swayam'],
  cloud: ['AWS Cloud Practitioner Essentials', 'AWS Academy'],
  cyber: ['Cybersecurity Essentials', 'CERT-In Partner Program'],
}

/**
 * `ability` drives every number for a student so profiles stay internally
 * coherent: a strong student has high proficiency *and* more proof of work,
 * rather than skills and evidence being rolled independently.
 */
function buildStudent(i: number, rand: () => number, taken: Set<string>): Student {
  let name = ''
  do {
    name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`
  } while (taken.has(name))
  taken.add(name)

  const goalId = weightedPick(rand, GOALS)
  const role = careerRoles.find((r) => r.id === goalId)!
  const branch = weightedPick(rand, BRANCHES)
  const year = weightedPick(rand, YEARS)
  const institution = weightedPick(rand, INSTITUTIONS)

  // Seniors have had more time to build, so ability skews up with year.
  const yearBonus = year === '4th' ? 0.12 : year === '3rd' ? 0.04 : -0.06
  const ability = clamp(0.57 + rand() * 0.60 + yearBonus, 0.42, 1.10)

  const skills: Record<string, number> = {}
  for (const req of role.benchmark) {
    // Wide per-skill spread: real students are uneven, so most fall short of
    // at least one bar rather than clearing a posting wholesale.
    const noise = (rand() - 0.5) * 20
    // Capped below the curated top performers so they keep the leaderboard.
    skills[req.skillId] = clamp(Math.round(req.level * ability + noise), 12, 78)
  }
  for (const sid of COMMON_SKILLS) {
    if (skills[sid] === undefined) {
      skills[sid] = clamp(Math.round(58 * ability + (rand() - 0.4) * 20), 20, 80)
    }
  }

  const evidence: PortfolioEvidence = {
    verifiedProjects: Math.round(ability * 3 + rand()),
    certifications: Math.round(ability * 2 + rand() * 0.8),
    internships: ability > 0.95 ? 1 : 0,
    assessmentsCompleted: 1 + Math.round(rand() * ability),
    hackathons: Math.round(rand() * ability * 2),
  }

  // Verified credentials are the exception, not the rule, at this stage.
  const verifiedSkillIds = role.benchmark
    .filter((r) => skills[r.skillId] >= r.level && rand() > 0.35)
    .map((r) => r.skillId)

  const cgpa = Math.round((4.7 + ability * 4.1 + (rand() - 0.5) * 0.5) * 10) / 10
  const [pTitle, pDesc, pStack] = PROJECT_BY_GOAL[goalId]
  const [cTitle, cIssuer] = CERT_BY_GOAL[goalId]
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '.')

  return {
    id: `stu-g${String(i).padStart(3, '0')}`,
    name,
    email: `${slug}@sgsits.ac.in`,
    avatarInitials: name.split(' ').map((p) => p[0]).join(''),
    institution,
    branch,
    year,
    cgpa: clamp(cgpa, 5.6, 9.4),
    city: 'Indore',
    careerGoalId: goalId,
    skills,
    verifiedSkillIds,
    evidence,
    readinessLastMonth: 0,
    about: `${year} year ${branch} student at ${institution}, working towards a ${role.title} role.`,
    education: [{ degree: `B.E. ${branch}`, institution, period: '2022 — 2026', score: `CGPA ${cgpa}` }],
    projects: [{ title: pTitle, description: pDesc, stack: pStack, verified: evidence.verifiedProjects > 1 }],
    certifications: [{ title: cTitle, issuer: cIssuer, issued: '2026-03-18', verified: evidence.certifications > 1 }],
    achievements: evidence.hackathons > 1
      ? [{ title: 'Finalist, Institute Innovation Challenge', detail: 'Reached the final round of the annual institute hackathon.', year: '2025' }]
      : [],
  }
}

const rand = makeRandom(20260904)
const taken = new Set<string>([
  'Aditya Soni', 'Rahul Sharma', 'Priya Patel', 'Sneha Verma', 'Arjun Nair', 'Kavya Iyer',
  'Mohammed Faiz', 'Ananya Deshmukh', 'Vikram Chouhan', 'Neha Jain', 'Harsh Tiwari',
  'Ishita Raghuwanshi', 'Rohan Bhatt', 'Simran Kaur', 'Devansh Agrawal', 'Pooja Malviya',
])

/** 104 seeded students, generated once at module load. */
export const generatedStudents: Student[] = Array.from({ length: 104 }, (_, i) =>
  buildStudent(i + 1, rand, taken),
)
