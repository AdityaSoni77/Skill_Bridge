import type { CollaborationItem, Faculty, FacultyProgram } from '../types'

export const facultyUser: Faculty = {
  id: 'fac-001',
  name: 'Dr. Meenal Joshi',
  email: 'faculty@demo.com',
  avatarInitials: 'MJ',
  designation: 'Associate Professor',
  department: 'Computer Science & Engineering',
  institution: 'SGSITS, Indore',
  expertise: ['Software Engineering', 'Cloud Computing', 'Database Systems'],
  publications: 23,
  consultancyValue: '₹14.2L',
  programsCompleted: 6,
}

export const facultyPrograms: FacultyProgram[] = [
  { id: 'fp-001', title: 'Summer Faculty Internship — Platform Engineering', company: 'ABC Technologies', type: 'Faculty Internship', mode: 'On-site, Indore', duration: '6 weeks', stipend: '₹75,000 total', deadline: '2026-09-20', seats: 4, skillIds: ['react', 'node', 'cloud'], description: 'Embed with a product team to see how modern web platforms are built and take the practice back into your curriculum.' },
  { id: 'fp-002', title: 'Industrial Training on Kubernetes & Platform Ops', company: 'Anvaya Cloud', type: 'Industrial Training', mode: 'Hybrid', duration: '4 weeks', stipend: 'Sponsored', deadline: '2026-09-14', seats: 12, skillIds: ['k8s', 'docker', 'linux'], description: 'Hands-on training on container orchestration, delivered by the team that runs regulated production workloads.' },
  { id: 'fp-003', title: 'FDP: Teaching Applied Machine Learning', company: 'Verdant Analytics', type: 'FDP', mode: 'Online', duration: '5 days', stipend: 'No fee', deadline: '2026-09-10', seats: 60, skillIds: ['ml', 'python', 'stats'], description: 'AICTE-approved faculty development programme covering project-based ML teaching with datasets from Indian industry.' },
  { id: 'fp-004', title: 'Workshop: Secure Coding for Undergraduates', company: 'Rakshak Security', type: 'Workshop', mode: 'On-site, campus', duration: '2 days', stipend: 'Honorarium ₹20,000', deadline: '2026-09-25', seats: 3, skillIds: ['security', 'networking'], description: 'Co-deliver a secure coding workshop on your campus. Rakshak supplies the lab environment and case studies.' },
  { id: 'fp-005', title: 'Research Collaboration — Demand Forecasting for Civic Services', company: 'Trigyn Digital', type: 'Research Collaboration', mode: 'Remote', duration: '12 months', stipend: '₹6L grant', deadline: '2026-10-05', seats: 2, skillIds: ['ml', 'stats', 'dataviz'], description: 'Joint study with a municipal corporation on forecasting grievance volumes. Includes publication support and anonymised data access.' },
  { id: 'fp-006', title: 'Consultancy — Database Performance Review', company: 'Setu Labs', type: 'Consultancy', mode: 'Remote', duration: '8 weeks', stipend: '₹2.4L', deadline: '2026-09-18', seats: 1, skillIds: ['sql', 'sysdesign'], description: 'Advise on query performance and schema design for a high-throughput API product. Scope agreed through the institute consultancy cell.' },
  { id: 'fp-007', title: 'Guest Lecture Series — Life of a Production Incident', company: 'Nexora Systems', type: 'Guest Lecture', mode: 'Online', duration: '90 minutes', stipend: 'Honorarium ₹8,000', deadline: '2026-09-12', seats: 8, skillIds: ['cloud', 'ownership'], description: 'Invite a Nexora on-call engineer to your class, or deliver the academic counterpart session at their engineering all-hands.' },
  { id: 'fp-008', title: 'Live Project Supervision — Municipal Grievance Tracker', company: 'Trigyn Digital', type: 'Live Project', mode: 'Remote', duration: '10 weeks', stipend: '₹40,000', deadline: '2026-09-08', seats: 2, skillIds: ['react', 'node', 'sql'], description: 'Supervise a student team shipping a real civic product. Trigyn provides the client relationship and code review.' },
]

export const collaborations: CollaborationItem[] = [
  { id: 'cl-001', title: 'One-to-one mentorship: breaking into full stack roles', company: 'ABC Technologies', kind: 'Mentorship', audience: 'Students, 3rd & 4th year', date: '2026-09-12', seatsLeft: 18, status: 'Open', detail: 'Six fortnightly sessions with a senior engineer, focused on code review habits and interview readiness.' },
  { id: 'cl-002', title: 'Guest lecture: what we actually look for in a fresher', company: 'Nexora Systems', kind: 'Guest Lecture', audience: 'All years', date: '2026-09-09', seatsLeft: 120, status: 'Open', detail: 'Hiring managers walk through three anonymised resumes and explain their decisions.' },
  { id: 'cl-003', title: 'Two-day React performance workshop', company: 'Setu Labs', kind: 'Workshop', audience: 'Students with React basics', date: '2026-09-19', seatsLeft: 6, status: 'Filling fast', detail: 'Profiling, rendering behaviour and shipping a measurable improvement to a real codebase.' },
  { id: 'cl-004', title: 'Live project: municipal grievance tracker', company: 'Trigyn Digital', kind: 'Live Project', audience: 'Team of 4 students + 1 faculty', date: '2026-09-15', seatsLeft: 2, status: 'Filling fast', detail: 'Ten-week engagement with a municipal corporation. Verified credential on completion.' },
  { id: 'cl-005', title: 'Innovation challenge: cutting last-mile delivery cost', company: 'ABC Technologies', kind: 'Innovation Challenge', audience: 'Open to all institutions', date: '2026-09-28', seatsLeft: 40, status: 'Open', detail: 'Prize pool of ₹1.5L and a fast-track internship interview for every finalist team.' },
  { id: 'cl-006', title: 'Research collaboration: forecasting civic grievance volumes', company: 'Trigyn Digital', kind: 'Research', audience: 'Faculty & PG students', date: '2026-10-05', seatsLeft: 2, status: 'Open', detail: 'Twelve-month funded study with publication support and anonymised municipal data.' },
  { id: 'cl-007', title: 'Cloud certification bootcamp', company: 'Anvaya Cloud', kind: 'Workshop', audience: 'Students, final year', date: '2026-08-22', seatsLeft: 0, status: 'Closed', detail: 'Completed. 46 students trained, 31 cleared the associate-level certification.' },
]

/** Department-level rollup for the institution dashboard. */
export const departments = [
  { name: 'Computer Science', students: 412, ready: 44, developing: 41, needsTraining: 15, placed: 86, offers: 118 },
  { name: 'Information Technology', students: 286, ready: 39, developing: 45, needsTraining: 16, placed: 81, offers: 74 },
  { name: 'Electronics & Telecom', students: 248, ready: 33, developing: 46, needsTraining: 21, placed: 68, offers: 52 },
  { name: 'Mechanical Engineering', students: 194, ready: 26, developing: 48, needsTraining: 26, placed: 54, offers: 31 },
  { name: 'Civil Engineering', students: 152, ready: 22, developing: 47, needsTraining: 31, placed: 47, offers: 22 },
]

export const placementOutcomes = [
  { year: '2022-23', placed: 61, avgPackage: 4.8, highest: 18 },
  { year: '2023-24', placed: 66, avgPackage: 5.3, highest: 22 },
  { year: '2024-25', placed: 71, avgPackage: 5.9, highest: 28 },
  { year: '2025-26', placed: 78, avgPackage: 6.6, highest: 34 },
]

export const institutionProfile = {
  name: 'SGSITS, Indore',
  adminName: 'Prof. R. K. Malviya',
  adminEmail: 'admin@demo.com',
  designation: 'Dean, Training & Placement',
  totalStudents: 1292,
  activeOnPlatform: 1148,
  partnerCompanies: 74,
  internshipsThisYear: 386,
  facultyEngagements: 29,
}

export const trainingRequests = [
  { id: 'tr-001', skill: 'React', students: 214, department: 'Computer Science, IT', partner: 'ABC Technologies', status: 'Scheduled', date: '2026-09-19' },
  { id: 'tr-002', skill: 'Cloud Computing', students: 268, department: 'All departments', partner: 'Anvaya Cloud', status: 'Proposed', date: '2026-10-02' },
  { id: 'tr-003', skill: 'Communication', students: 341, department: 'All departments', partner: 'SkillBridge Studio', status: 'Running', date: '2026-08-12' },
  { id: 'tr-004', skill: 'Data Analytics', students: 176, department: 'CS, IT, Mechanical', partner: 'Verdant Analytics', status: 'Proposed', date: '2026-10-14' },
]
