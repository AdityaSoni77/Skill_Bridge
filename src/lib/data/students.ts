import type { PortfolioEvidence, Student } from '../types'
import { generatedStudents } from './cohortGen'

const SGSITS = 'SGSITS, Indore'

type Seed = {
  id: string; name: string; branch: string; year: string; cgpa: number
  goal: string; skills: Record<string, number>; verified: string[]
  ev: Partial<PortfolioEvidence>; institution?: string; city?: string
  last?: number; project?: [string, string, string[]]
}

const initials = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('')

function mk(s: Seed): Student {
  const ev: PortfolioEvidence = {
    verifiedProjects: 0, certifications: 0, internships: 0,
    assessmentsCompleted: 0, hackathons: 0, ...s.ev,
  }
  const [pt, pd, ps] = s.project ?? ['Course Project', 'Semester project built as part of coursework.', ['Git']]
  return {
    id: s.id,
    name: s.name,
    email: s.name.toLowerCase().replace(/[^a-z]/g, '.') + '@sgsits.ac.in',
    avatarInitials: initials(s.name),
    institution: s.institution ?? SGSITS,
    branch: s.branch,
    year: s.year,
    cgpa: s.cgpa,
    city: s.city ?? 'Indore',
    careerGoalId: s.goal,
    skills: s.skills,
    verifiedSkillIds: s.verified,
    evidence: ev,
    readinessLastMonth: s.last ?? 0,
    about: `${s.year} year ${s.branch} student at ${s.institution ?? SGSITS} working towards a career in ${s.goal.toUpperCase()}.`,
    education: [{ degree: `B.E. ${s.branch}`, institution: s.institution ?? SGSITS, period: '2022 — 2026', score: `CGPA ${s.cgpa}` }],
    projects: [{ title: pt, description: pd, stack: ps, verified: ev.verifiedProjects > 0 }],
    certifications: [],
    achievements: [],
  }
}

/** The demo student. Every number here is the input to the readiness engine. */
export const adityaSoni: Student = {
  id: 'stu-001',
  name: 'Aditya Soni',
  email: 'student@demo.com',
  avatarInitials: 'AS',
  institution: SGSITS,
  branch: 'Computer Science',
  year: '3rd',
  cgpa: 8.1,
  city: 'Indore',
  careerGoalId: 'fsd',
  skills: {
    js: 72, react: 42, node: 35, sql: 78, git: 80, communication: 68,
    html: 88, css: 82, api: 45, mongo: 40, ts: 30, dsa: 58, python: 55,
    teamwork: 74, problemsolving: 66, ownership: 70, presentation: 60,
    linux: 42, docker: 20, figma: 35, testing: 25, sysdesign: 30, excel: 58,
  },
  verifiedSkillIds: ['js', 'sql', 'git', 'html', 'css'],
  evidence: { verifiedProjects: 3, certifications: 2, internships: 0, assessmentsCompleted: 1, hackathons: 1 },
  readinessLastMonth: 54,
  about:
    'Third-year Computer Science student at SGSITS Indore. Comfortable on the front end and with databases, currently closing the gap on React and Node.js to reach full stack internship readiness.',
  education: [
    { degree: 'B.E. Computer Science', institution: SGSITS, period: '2022 — 2026', score: 'CGPA 8.1 / 10' },
    { degree: 'Class XII (CBSE)', institution: 'Kendriya Vidyalaya No. 1, Indore', period: '2021 — 2022', score: '91.4%' },
  ],
  projects: [
    { title: 'Campus Lost & Found Portal', description: 'Lost-item reporting board used by 400+ students at SGSITS. Handles image uploads, claim verification and admin moderation.', stack: ['HTML', 'CSS', 'JavaScript', 'MySQL'], verified: true, link: 'github.com/adityasoni/campus-lost-found' },
    { title: 'Indore Bus Route Finder', description: 'Shortest-route lookup across 42 AICTSL city bus routes using a graph traversal built from scratch.', stack: ['JavaScript', 'Node.js', 'SQL'], verified: true, link: 'github.com/adityasoni/bus-route-finder' },
    { title: 'Attendance Register for Faculty', description: 'Spreadsheet-free attendance capture with monthly defaulter reports, piloted with two departments.', stack: ['JavaScript', 'SQL'], verified: true },
    { title: 'Personal Portfolio Site', description: 'Static portfolio with a hand-rolled responsive grid. In progress.', stack: ['HTML', 'CSS'], verified: false },
  ],
  certifications: [
    { title: 'Database Design & SQL', issuer: 'Oracle Academy', issued: '2026-02-14', verified: true },
    { title: 'Version Control with Git', issuer: 'GitHub Education', issued: '2025-11-08', verified: true },
    { title: 'JavaScript Essentials', issuer: 'Infosys Springboard', issued: '2026-04-02', verified: false },
  ],
  achievements: [
    { title: 'Runner-up, Cognizance Hackathon', detail: 'Built a crop advisory tool in a 24-hour team event at IIT Roorkee.', year: '2025' },
    { title: 'Department Coding Club — Web Lead', detail: 'Ran eight beginner web development sessions for second-year students.', year: '2025' },
  ],
}

export const cohort: Student[] = [
  adityaSoni,
  mk({ id: 'stu-002', name: 'Rahul Sharma', branch: 'Computer Science', year: '4th', cgpa: 8.7, goal: 'fsd', last: 79,
    skills: { js: 84, react: 80, node: 74, sql: 72, git: 85, communication: 76, html: 90, css: 84, api: 78, dsa: 72, mongo: 68, ts: 62 },
    verified: ['js', 'react', 'node', 'git', 'sql'], ev: { verifiedProjects: 4, certifications: 3, internships: 1, assessmentsCompleted: 2, hackathons: 2 },
    project: ['Hostel Mess Billing System', 'Full stack mess-billing app deployed for a 300-resident hostel.', ['React', 'Node.js', 'MongoDB']] }),
  mk({ id: 'stu-003', name: 'Priya Patel', branch: 'Information Technology', year: '4th', cgpa: 9.1, goal: 'fsd', last: 76,
    skills: { js: 80, react: 78, node: 71, sql: 80, git: 78, communication: 82, html: 88, css: 86, api: 74, dsa: 76, figma: 66 },
    verified: ['js', 'react', 'node', 'sql', 'communication'], ev: { verifiedProjects: 3, certifications: 2, internships: 1, assessmentsCompleted: 2, hackathons: 1 },
    project: ['Krishi Mitra Advisory App', 'Crop advisory PWA in Hindi and Marathi, piloted with 60 farmers near Dewas.', ['React', 'Node.js', 'SQL']] }),
  mk({ id: 'stu-004', name: 'Sneha Verma', branch: 'Computer Science', year: '3rd', cgpa: 8.4, goal: 'data', last: 58,
    skills: { sql: 78, python: 74, stats: 66, powerbi: 68, excel: 76, communication: 78, pandas: 70, dataviz: 66 },
    verified: ['sql', 'python', 'excel'], ev: { verifiedProjects: 3, certifications: 2, internships: 0, assessmentsCompleted: 2, hackathons: 1 },
    project: ['MP Rainfall Trend Analysis', 'Ten-year district rainfall analysis published as an interactive Power BI report.', ['Python', 'Power BI']] }),
  mk({ id: 'stu-005', name: 'Arjun Nair', branch: 'Computer Science', year: '4th', cgpa: 8.9, goal: 'ml', last: 74,
    skills: { python: 86, ml: 78, dl: 72, stats: 78, pandas: 80, communication: 68, sql: 66 },
    verified: ['python', 'ml', 'pandas'], ev: { verifiedProjects: 4, certifications: 3, internships: 1, assessmentsCompleted: 2, hackathons: 3 },
    project: ['Devanagari Handwriting OCR', 'CNN-based recogniser for handwritten Devanagari, 94.2% test accuracy.', ['Python', 'PyTorch']] }),
  mk({ id: 'stu-006', name: 'Kavya Iyer', branch: 'Electronics & Telecom', year: '4th', cgpa: 8.2, goal: 'cloud', last: 71,
    skills: { cloud: 72, docker: 74, linux: 76, k8s: 66, git: 74, ownership: 76, python: 60 },
    verified: ['cloud', 'linux', 'docker'], ev: { verifiedProjects: 3, certifications: 3, internships: 1, assessmentsCompleted: 1, hackathons: 1 },
    project: ['Self-hosted CI Pipeline', 'Containerised build pipeline for the department project server.', ['Docker', 'Linux']] }),
  mk({ id: 'stu-007', name: 'Mohammed Faiz', branch: 'Information Technology', year: '4th', cgpa: 7.9, goal: 'cyber', last: 70,
    skills: { security: 76, networking: 78, linux: 72, python: 64, problemsolving: 74, communication: 66 },
    verified: ['security', 'networking', 'linux'], ev: { verifiedProjects: 3, certifications: 2, internships: 1, assessmentsCompleted: 2, hackathons: 1 },
    project: ['Campus Network Audit', 'Documented and remediated 14 findings across the hostel wireless network.', ['Linux', 'Nmap']] }),
  mk({ id: 'stu-008', name: 'Ananya Deshmukh', branch: 'Computer Science', year: '3rd', cgpa: 8.0, goal: 'fsd', last: 48,
    skills: { js: 66, react: 52, node: 40, sql: 62, git: 70, communication: 74, html: 80, css: 78, api: 44, dsa: 54 },
    verified: ['git', 'html'], ev: { verifiedProjects: 2, certifications: 1, internships: 0, assessmentsCompleted: 1, hackathons: 0 },
    project: ['Blood Donor Directory', 'Searchable donor directory for a city NGO with SMS alerts.', ['JavaScript', 'SQL']] }),
  mk({ id: 'stu-009', name: 'Vikram Chouhan', branch: 'Mechanical Engineering', year: '3rd', cgpa: 7.4, goal: 'data', last: 36,
    skills: { sql: 48, python: 52, stats: 44, powerbi: 30, excel: 64, communication: 60, pandas: 38 },
    verified: ['excel'], ev: { verifiedProjects: 1, certifications: 1, internships: 0, assessmentsCompleted: 1, hackathons: 0 },
    project: ['Workshop Downtime Tracker', 'Excel model tracking machine downtime in the college workshop.', ['Advanced Excel']] }),
  mk({ id: 'stu-010', name: 'Neha Jain', branch: 'Computer Science', year: '2nd', cgpa: 8.6, goal: 'fsd', last: 30,
    skills: { js: 54, react: 28, node: 18, sql: 50, git: 58, communication: 72, html: 74, css: 70, dsa: 46 },
    verified: ['html', 'css'], ev: { verifiedProjects: 1, certifications: 1, internships: 0, assessmentsCompleted: 1, hackathons: 1 },
    project: ['Quiz App', 'Timed quiz app with a local question bank.', ['JavaScript']] }),
  mk({ id: 'stu-011', name: 'Harsh Tiwari', branch: 'Information Technology', year: '3rd', cgpa: 7.2, goal: 'cloud', last: 34,
    skills: { cloud: 42, docker: 34, linux: 52, k8s: 16, git: 60, ownership: 62, python: 48 },
    verified: ['linux'], ev: { verifiedProjects: 1, certifications: 0, internships: 0, assessmentsCompleted: 1, hackathons: 0 },
    project: ['Static Site on S3', 'Deployed a department notice site to object storage with a CDN.', ['AWS']] }),
  mk({ id: 'stu-012', name: 'Ishita Raghuwanshi', branch: 'Computer Science', year: '4th', cgpa: 8.8, goal: 'data', last: 77,
    skills: { sql: 84, python: 78, stats: 76, powerbi: 74, excel: 80, communication: 80, pandas: 76, dataviz: 72 },
    verified: ['sql', 'python', 'powerbi', 'stats'], ev: { verifiedProjects: 4, certifications: 3, internships: 1, assessmentsCompleted: 2, hackathons: 1 },
    project: ['Retail Demand Forecasting', 'Weekly demand forecast for a 12-store retail chain in Indore.', ['Python', 'SQL', 'Power BI']] }),
  mk({ id: 'stu-013', name: 'Rohan Bhatt', branch: 'Computer Science', year: '4th', cgpa: 8.3, goal: 'ml', last: 55,
    skills: { python: 76, ml: 62, dl: 48, stats: 66, pandas: 68, communication: 64, sql: 60 },
    verified: ['python', 'pandas'], ev: { verifiedProjects: 2, certifications: 2, internships: 0, assessmentsCompleted: 1, hackathons: 2 },
    project: ['Traffic Sign Classifier', 'Image classifier trained on a 5,000-image Indian traffic sign set.', ['Python', 'TensorFlow']] }),
  mk({ id: 'stu-014', name: 'Simran Kaur', branch: 'Electronics & Telecom', year: '3rd', cgpa: 7.8, goal: 'cyber', last: 44,
    skills: { security: 54, networking: 66, linux: 58, python: 50, problemsolving: 68, communication: 70 },
    verified: ['networking'], ev: { verifiedProjects: 2, certifications: 1, internships: 0, assessmentsCompleted: 1, hackathons: 0 },
    project: ['Phishing Awareness Drive', 'Ran a simulated phishing exercise across two departments.', ['Linux']] }),
  mk({ id: 'stu-015', name: 'Devansh Agrawal', branch: 'Computer Science', year: '4th', cgpa: 9.0, goal: 'fsd', last: 84,
    institution: 'IIT Indore', city: 'Indore',
    skills: { js: 88, react: 86, node: 82, sql: 78, git: 88, communication: 80, html: 92, css: 88, api: 84, dsa: 84, ts: 74, mongo: 76 },
    verified: ['js', 'react', 'node', 'sql', 'git', 'communication'], ev: { verifiedProjects: 5, certifications: 3, internships: 2, assessmentsCompleted: 3, hackathons: 2 },
    project: ['Open Source Contribution — Design System', 'Merged 11 pull requests into a widely used React component library.', ['React', 'TypeScript']] }),
  mk({ id: 'stu-016', name: 'Pooja Malviya', branch: 'Information Technology', year: '4th', cgpa: 8.5, goal: 'fsd', last: 68,
    institution: 'IET DAVV, Indore', city: 'Indore',
    skills: { js: 78, react: 72, node: 66, sql: 74, git: 80, communication: 78, html: 86, css: 82, api: 70, dsa: 68 },
    verified: ['js', 'sql', 'git'], ev: { verifiedProjects: 3, certifications: 2, internships: 1, assessmentsCompleted: 2, hackathons: 1 },
    project: ['Temple Crowd Advisory', 'Crowd-level advisory board for Khajrana temple visitors during festivals.', ['React', 'Node.js']] }),
]

/**
 * Full platform population: the curated sixteen plus the seeded cohort that
 * makes institution-level percentages meaningful. Aggregate views read from
 * this; the demo narrative still runs on the curated students above.
 */
export const allStudents: Student[] = [...cohort, ...generatedStudents]

export const studentIndex: Record<string, Student> = Object.fromEntries(allStudents.map((s) => [s.id, s]))

/** The institution admin persona only sees their own students. */
export const HOME_INSTITUTION = SGSITS
export const homeCohort = allStudents.filter((s) => s.institution === SGSITS)
