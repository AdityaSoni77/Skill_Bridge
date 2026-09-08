import type { Application, Company, Opportunity } from '../types'

export const companies: Company[] = [
  { id: 'co-001', name: 'ABC Technologies', industry: 'IT Services & Product Engineering', location: 'Indore, MP', size: '1,200 employees', logoInitials: 'AT', verified: true,
    about: 'Product engineering firm building logistics and fintech platforms for Indian enterprises. Runs a six-month structured internship with a conversion track.' },
  { id: 'co-002', name: 'Nexora Systems', industry: 'SaaS Product', location: 'Pune, MH', size: '450 employees', logoInitials: 'NS', verified: true,
    about: 'Builds a workforce management suite used by 300+ mid-market companies across India and South-East Asia.' },
  { id: 'co-003', name: 'Setu Labs', industry: 'Developer Tooling', location: 'Bengaluru, KA', size: '180 employees', logoInitials: 'SL', verified: true,
    about: 'API infrastructure company. Small teams, heavy code review culture, strong mentorship for interns.' },
  { id: 'co-004', name: 'Verdant Analytics', industry: 'Data & Analytics Consulting', location: 'Hyderabad, TS', size: '600 employees', logoInitials: 'VA', verified: true,
    about: 'Analytics consultancy serving agriculture, retail and public sector clients.' },
  { id: 'co-005', name: 'Anvaya Cloud', industry: 'Cloud Infrastructure', location: 'Noida, UP', size: '320 employees', logoInitials: 'AC', verified: true,
    about: 'Managed cloud and DevOps partner for regulated industries, with an in-house certification academy.' },
  { id: 'co-006', name: 'Rakshak Security', industry: 'Cybersecurity', location: 'Gurugram, HR', size: '240 employees', logoInitials: 'RS', verified: true,
    about: 'Security operations provider running a 24x7 SOC for banking and healthcare clients.' },
  { id: 'co-007', name: 'Trigyn Digital', industry: 'Civic Technology', location: 'Bhopal, MP', size: '90 employees', logoInitials: 'TD', verified: false,
    about: 'Works with urban local bodies on citizen service platforms. Publishes live student projects every semester.' },
]

export const companyIndex: Record<string, Company> = Object.fromEntries(companies.map((c) => [c.id, c]))

export const opportunities: Opportunity[] = [
  {
    id: 'opp-001', companyId: 'co-001', title: 'Full Stack Developer Intern', type: 'Internship',
    location: 'Indore, MP', workMode: 'Hybrid', stipend: '₹25,000/month', duration: '6 months',
    postedOn: '2026-08-21', applicants: 126, roleId: 'fsd', offersTraining: true,
    requirements: [
      { skillId: 'js', level: 65, weight: 3, critical: true },
      { skillId: 'react', level: 70, weight: 2.5, critical: true },
      { skillId: 'node', level: 65, weight: 2.5, critical: true },
      { skillId: 'sql', level: 60, weight: 2 },
      { skillId: 'git', level: 55, weight: 1.5 },
    ],
    eligibility: { minCgpa: 7.0, years: ['3rd', '4th'], branches: ['Computer Science', 'Information Technology', 'Electronics & Telecom'] },
    description: 'Join the logistics platform team building shipment tracking dashboards used by 40+ enterprise customers. You will own small features end to end with a senior engineer reviewing your work.',
    perks: ['Pre-placement offer track', 'Assigned engineering mentor', 'Laptop provided', 'Certificate on completion'],
  },
  {
    id: 'opp-002', companyId: 'co-002', title: 'Frontend Engineer Intern', type: 'Internship',
    location: 'Pune, MH', workMode: 'Remote', stipend: '₹20,000/month', duration: '4 months',
    postedOn: '2026-08-27', applicants: 214, roleId: 'fsd', offersTraining: false,
    requirements: [
      { skillId: 'js', level: 60, weight: 3, critical: true },
      { skillId: 'react', level: 65, weight: 3, critical: true },
      { skillId: 'html', level: 60, weight: 1.5 },
      { skillId: 'css', level: 60, weight: 1.5 },
      { skillId: 'git', level: 50, weight: 1 },
    ],
    eligibility: { minCgpa: 6.5, years: ['2nd', '3rd', '4th'], branches: ['Any'] },
    description: 'Work on the customer-facing scheduling interface. Heavy focus on component quality, accessibility and design system consistency.',
    perks: ['Fully remote', 'Design system training', 'Flexible hours'],
  },
  {
    id: 'opp-003', companyId: 'co-003', title: 'Backend Developer Intern', type: 'Internship',
    location: 'Bengaluru, KA', workMode: 'On-site', stipend: '₹30,000/month', duration: '6 months',
    postedOn: '2026-08-14', applicants: 168, roleId: 'fsd', offersTraining: true,
    requirements: [
      { skillId: 'node', level: 70, weight: 3, critical: true },
      { skillId: 'sql', level: 65, weight: 2 },
      { skillId: 'api', level: 65, weight: 2, critical: true },
      { skillId: 'git', level: 55, weight: 1 },
    ],
    eligibility: { minCgpa: 7.0, years: ['3rd', '4th'], branches: ['Computer Science', 'Information Technology'] },
    description: 'Build and document public API endpoints. You will write tests for everything you ship and take part in weekly design reviews.',
    perks: ['Relocation support', 'Mentorship from staff engineers', 'Open source time'],
  },
  {
    id: 'opp-004', companyId: 'co-004', title: 'Data Analyst Intern', type: 'Internship',
    location: 'Hyderabad, TS', workMode: 'Hybrid', stipend: '₹22,000/month', duration: '6 months',
    postedOn: '2026-08-25', applicants: 143, roleId: 'data', offersTraining: true,
    requirements: [
      { skillId: 'sql', level: 70, weight: 3, critical: true },
      { skillId: 'python', level: 65, weight: 2.5, critical: true },
      { skillId: 'stats', level: 65, weight: 2, critical: true },
      { skillId: 'powerbi', level: 60, weight: 2 },
      { skillId: 'communication', level: 70, weight: 1.5 },
    ],
    eligibility: { minCgpa: 7.0, years: ['3rd', '4th'], branches: ['Any'] },
    description: 'Support the agriculture analytics practice: build district-level dashboards and write the weekly insight note for client stakeholders.',
    perks: ['Client exposure', 'Power BI certification voucher', 'Hybrid schedule'],
  },
  {
    id: 'opp-005', companyId: 'co-005', title: 'Cloud Operations Intern', type: 'Internship',
    location: 'Noida, UP', workMode: 'On-site', stipend: '₹28,000/month', duration: '6 months',
    postedOn: '2026-08-19', applicants: 97, roleId: 'cloud', offersTraining: true,
    requirements: [
      { skillId: 'cloud', level: 70, weight: 3, critical: true },
      { skillId: 'linux', level: 65, weight: 2.5, critical: true },
      { skillId: 'docker', level: 60, weight: 2 },
      { skillId: 'git', level: 55, weight: 1 },
    ],
    eligibility: { minCgpa: 6.5, years: ['3rd', '4th'], branches: ['Any'] },
    description: 'Shadow the platform team on incident response and infrastructure automation for regulated workloads.',
    perks: ['AWS certification sponsored', 'On-call shadowing', 'Hostel accommodation'],
  },
  {
    id: 'opp-006', companyId: 'co-006', title: 'SOC Analyst Trainee', type: 'Internship',
    location: 'Gurugram, HR', workMode: 'On-site', stipend: '₹26,000/month', duration: '6 months',
    postedOn: '2026-08-12', applicants: 88, roleId: 'cyber', offersTraining: true,
    requirements: [
      { skillId: 'security', level: 70, weight: 3, critical: true },
      { skillId: 'networking', level: 70, weight: 2.5, critical: true },
      { skillId: 'linux', level: 65, weight: 2 },
      { skillId: 'communication', level: 60, weight: 1 },
    ],
    eligibility: { minCgpa: 6.5, years: ['4th'], branches: ['Computer Science', 'Information Technology', 'Electronics & Telecom'] },
    description: 'Triage alerts on the Tier-1 desk with a senior analyst, and write incident summaries for client reporting.',
    perks: ['Shift allowance', 'CEH training', 'Conversion to full time'],
  },
  {
    id: 'opp-007', companyId: 'co-001', title: 'Full Stack Developer', type: 'Job',
    location: 'Indore, MP', workMode: 'Hybrid', stipend: '₹8.5 LPA', duration: 'Full time',
    postedOn: '2026-08-29', applicants: 312, roleId: 'fsd', offersTraining: false,
    requirements: [
      { skillId: 'js', level: 75, weight: 3, critical: true },
      { skillId: 'react', level: 80, weight: 3, critical: true },
      { skillId: 'node', level: 75, weight: 3, critical: true },
      { skillId: 'sql', level: 70, weight: 2 },
      { skillId: 'sysdesign', level: 60, weight: 2, critical: true },
      { skillId: 'git', level: 70, weight: 1 },
    ],
    eligibility: { minCgpa: 7.0, years: ['4th'], branches: ['Computer Science', 'Information Technology'] },
    description: 'Own a service end to end on the shipment tracking platform. Expect production on-call within three months.',
    perks: ['Health cover for family', 'Annual learning budget', 'Hybrid schedule'],
  },
  {
    id: 'opp-008', companyId: 'co-007', title: 'Live Project: Municipal Grievance Tracker', type: 'Live Project',
    location: 'Bhopal, MP', workMode: 'Remote', stipend: '₹15,000 honorarium', duration: '10 weeks',
    postedOn: '2026-08-08', applicants: 64, roleId: 'fsd', offersTraining: true,
    requirements: [
      { skillId: 'js', level: 55, weight: 3, critical: true },
      { skillId: 'react', level: 50, weight: 2 },
      { skillId: 'sql', level: 55, weight: 2 },
      { skillId: 'git', level: 50, weight: 1 },
      { skillId: 'teamwork', level: 60, weight: 1 },
    ],
    eligibility: { minCgpa: 6.0, years: ['2nd', '3rd', '4th'], branches: ['Any'] },
    description: 'Build a grievance intake and escalation tracker with a municipal corporation team. Real users, real deadlines, code reviewed by the vendor engineering lead.',
    perks: ['Government letter of recommendation', 'Verified project credential', 'Weekly mentor review'],
  },
  {
    id: 'opp-009', companyId: 'co-002', title: 'ML Engineering Intern', type: 'Internship',
    location: 'Pune, MH', workMode: 'Hybrid', stipend: '₹35,000/month', duration: '6 months',
    postedOn: '2026-08-23', applicants: 201, roleId: 'ml', offersTraining: false,
    requirements: [
      { skillId: 'python', level: 75, weight: 3, critical: true },
      { skillId: 'ml', level: 70, weight: 3, critical: true },
      { skillId: 'dl', level: 65, weight: 2.5, critical: true },
      { skillId: 'pandas', level: 70, weight: 2 },
      { skillId: 'sql', level: 60, weight: 1 },
    ],
    eligibility: { minCgpa: 7.5, years: ['3rd', '4th'], branches: ['Computer Science', 'Information Technology'] },
    description: 'Improve the shift-demand forecasting model in production. You will run offline evaluations and ship one model change.',
    perks: ['GPU credits', 'Paper co-authorship possible', 'Conference travel'],
  },
]

export const opportunityIndex: Record<string, Opportunity> = Object.fromEntries(opportunities.map((o) => [o.id, o]))

const tl = (stages: [Application['stage'], string, string?][]) =>
  stages.map(([stage, date, note]) => ({ stage, date, note }))

/** Seeded applications. Aditya deliberately has NOT applied to opp-001 yet — that is the live demo step. */
export const seedApplications: Application[] = [
  { id: 'app-001', studentId: 'stu-001', opportunityId: 'opp-002', appliedOn: '2026-08-18', stage: 'Shortlisted', matchAtApply: 92,
    timeline: tl([['Applied', '2026-08-18'], ['Under Review', '2026-08-20', 'Profile screened by hiring team'], ['Shortlisted', '2026-08-26', 'Shortlisted for the frontend take-home task']]) },
  { id: 'app-002', studentId: 'stu-001', opportunityId: 'opp-008', appliedOn: '2026-08-10', stage: 'Interview', matchAtApply: 89,
    timeline: tl([['Applied', '2026-08-10'], ['Under Review', '2026-08-12'], ['Shortlisted', '2026-08-19', 'Project sample accepted'], ['Interview', '2026-08-31', 'Mentor call scheduled for 6 Sep, 11:00 AM']]) },
  { id: 'app-003', studentId: 'stu-001', opportunityId: 'opp-003', appliedOn: '2026-08-24', stage: 'Under Review', matchAtApply: 82,
    timeline: tl([['Applied', '2026-08-24'], ['Under Review', '2026-08-28', 'Awaiting backend screening']]) },
  { id: 'app-004', studentId: 'stu-001', opportunityId: 'opp-004', appliedOn: '2026-08-29', stage: 'Applied', matchAtApply: 58,
    timeline: tl([['Applied', '2026-08-29', 'Applied to explore an analytics track']]) },
  ...['stu-002', 'stu-003', 'stu-015', 'stu-016', 'stu-008', 'stu-010'].map((sid, i) => ({
    id: `app-1${i}0`, studentId: sid, opportunityId: 'opp-001', appliedOn: '2026-08-2' + (2 + i), stage: (['Shortlisted', 'Shortlisted', 'Interview', 'Under Review', 'Applied', 'Applied'] as Application['stage'][])[i], matchAtApply: 0,
    timeline: tl([['Applied', '2026-08-2' + (2 + i)]]),
  })),
  ...['stu-004', 'stu-012'].map((sid, i) => ({
    id: `app-2${i}0`, studentId: sid, opportunityId: 'opp-004', appliedOn: '2026-08-26', stage: (['Under Review', 'Shortlisted'] as Application['stage'][])[i], matchAtApply: 0,
    timeline: tl([['Applied', '2026-08-26']]),
  })),
]
