import type { CareerRole, LearningResource, Skill, SkillCategory } from '../types'

export const skills: Skill[] = [
  { id: 'js', name: 'JavaScript', category: 'Technical Skills' },
  { id: 'ts', name: 'TypeScript', category: 'Technical Skills' },
  { id: 'react', name: 'React', category: 'Technical Skills' },
  { id: 'node', name: 'Node.js', category: 'Technical Skills' },
  { id: 'html', name: 'HTML', category: 'Technical Skills' },
  { id: 'css', name: 'CSS', category: 'Technical Skills' },
  { id: 'api', name: 'REST APIs', category: 'Technical Skills' },
  { id: 'sql', name: 'SQL', category: 'Technical Skills' },
  { id: 'mongo', name: 'MongoDB', category: 'Technical Skills' },
  { id: 'python', name: 'Python', category: 'Technical Skills' },
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'Technical Skills' },
  { id: 'testing', name: 'Automated Testing', category: 'Technical Skills' },
  { id: 'ml', name: 'Machine Learning', category: 'Domain Skills' },
  { id: 'dl', name: 'Deep Learning', category: 'Domain Skills' },
  { id: 'stats', name: 'Statistics', category: 'Domain Skills' },
  { id: 'dataviz', name: 'Data Visualisation', category: 'Domain Skills' },
  { id: 'cloud', name: 'Cloud Computing', category: 'Domain Skills' },
  { id: 'security', name: 'Cybersecurity', category: 'Domain Skills' },
  { id: 'networking', name: 'Computer Networks', category: 'Domain Skills' },
  { id: 'sysdesign', name: 'System Design', category: 'Domain Skills' },
  { id: 'git', name: 'Git & Version Control', category: 'Tools' },
  { id: 'docker', name: 'Docker', category: 'Tools' },
  { id: 'k8s', name: 'Kubernetes', category: 'Tools' },
  { id: 'aws', name: 'AWS', category: 'Tools' },
  { id: 'linux', name: 'Linux', category: 'Tools' },
  { id: 'pandas', name: 'Pandas & NumPy', category: 'Tools' },
  { id: 'powerbi', name: 'Power BI', category: 'Tools' },
  { id: 'figma', name: 'Figma', category: 'Tools' },
  { id: 'excel', name: 'Advanced Excel', category: 'Tools' },
  { id: 'communication', name: 'Communication', category: 'Soft Skills' },
  { id: 'teamwork', name: 'Teamwork', category: 'Soft Skills' },
  { id: 'problemsolving', name: 'Problem Solving', category: 'Soft Skills' },
  { id: 'ownership', name: 'Ownership', category: 'Soft Skills' },
  { id: 'presentation', name: 'Presentation', category: 'Soft Skills' },
]

export const skillIndex: Record<string, Skill> = Object.fromEntries(skills.map((s) => [s.id, s]))

export const skillCategories: SkillCategory[] = ['Technical Skills', 'Soft Skills', 'Tools', 'Domain Skills']

export const skillName = (id: string) => skillIndex[id]?.name ?? id

/**
 * Industry benchmarks. In production these are recomputed nightly from live
 * postings; for the prototype they are seeded from the 2025-26 hiring data
 * published by our partner companies.
 */
export const careerRoles: CareerRole[] = [
  {
    id: 'fsd',
    title: 'Full Stack Developer',
    family: 'Software Engineering',
    demandTrendPct: 24,
    medianStipend: 25000,
    openings: 1840,
    benchmark: [
      { skillId: 'js', level: 70, weight: 4, critical: true },
      { skillId: 'react', level: 75, weight: 6, critical: true },
      { skillId: 'node', level: 70, weight: 6, critical: true },
      { skillId: 'sql', level: 65, weight: 3 },
      { skillId: 'git', level: 60, weight: 2 },
      { skillId: 'communication', level: 70, weight: 3 },
    ],
  },
  {
    id: 'data',
    title: 'Data Analyst',
    family: 'Data & AI',
    demandTrendPct: 19,
    medianStipend: 22000,
    openings: 1120,
    benchmark: [
      { skillId: 'sql', level: 75, weight: 5, critical: true },
      { skillId: 'python', level: 70, weight: 5, critical: true },
      { skillId: 'stats', level: 70, weight: 4, critical: true },
      { skillId: 'powerbi', level: 65, weight: 3 },
      { skillId: 'excel', level: 70, weight: 2 },
      { skillId: 'communication', level: 75, weight: 3 },
    ],
  },
  {
    id: 'ml',
    title: 'AI / ML Engineer',
    family: 'Data & AI',
    demandTrendPct: 31,
    medianStipend: 35000,
    openings: 960,
    benchmark: [
      { skillId: 'python', level: 80, weight: 5, critical: true },
      { skillId: 'ml', level: 75, weight: 6, critical: true },
      { skillId: 'dl', level: 70, weight: 5, critical: true },
      { skillId: 'stats', level: 75, weight: 4 },
      { skillId: 'pandas', level: 75, weight: 3 },
      { skillId: 'communication', level: 65, weight: 2 },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps Engineer',
    family: 'Infrastructure',
    demandTrendPct: 18,
    medianStipend: 30000,
    openings: 780,
    benchmark: [
      { skillId: 'cloud', level: 75, weight: 6, critical: true },
      { skillId: 'docker', level: 70, weight: 5, critical: true },
      { skillId: 'linux', level: 70, weight: 4, critical: true },
      { skillId: 'k8s', level: 65, weight: 4 },
      { skillId: 'git', level: 70, weight: 2 },
      { skillId: 'ownership', level: 70, weight: 2 },
    ],
  },
  {
    id: 'cyber',
    title: 'Cybersecurity Analyst',
    family: 'Infrastructure',
    demandTrendPct: 27,
    medianStipend: 28000,
    openings: 640,
    benchmark: [
      { skillId: 'security', level: 75, weight: 6, critical: true },
      { skillId: 'networking', level: 75, weight: 5, critical: true },
      { skillId: 'linux', level: 70, weight: 4, critical: true },
      { skillId: 'python', level: 60, weight: 3 },
      { skillId: 'problemsolving', level: 70, weight: 3 },
      { skillId: 'communication', level: 65, weight: 2 },
    ],
  },
]

export const roleIndex: Record<string, CareerRole> = Object.fromEntries(careerRoles.map((r) => [r.id, r]))

/**
 * Learning catalogue. `sequence` encodes prerequisite order within a pathway;
 * `masteryLevel` is the proficiency a learner is expected to hold once the
 * module is genuinely complete, which is how progress is detected.
 */
export const learningResources: LearningResource[] = [
  { id: 'lr-html', sequence: 1, title: 'HTML & Semantic Markup', provider: 'NPTEL', hours: 8, type: 'Course', skillIds: ['html'], levelGain: 60, masteryLevel: 65 },
  { id: 'lr-css', sequence: 2, title: 'CSS & Responsive Layout', provider: 'NPTEL', hours: 12, type: 'Course', skillIds: ['css'], levelGain: 60, masteryLevel: 65 },
  { id: 'lr-js', sequence: 3, title: 'JavaScript Essentials', provider: 'Infosys Springboard', hours: 20, type: 'Course', skillIds: ['js'], levelGain: 65, masteryLevel: 65 },
  { id: 'lr-git', sequence: 4, title: 'Git & Collaborative Workflows', provider: 'GitHub Education', hours: 6, type: 'Course', skillIds: ['git'], levelGain: 60, masteryLevel: 60 },
  { id: 'lr-react-1', sequence: 5, title: 'React Fundamentals', provider: 'Meta via Coursera', hours: 24, type: 'Course', skillIds: ['react'], levelGain: 30, masteryLevel: 60 },
  { id: 'lr-react-2', sequence: 6, title: 'React with API Integration', provider: 'SkillBridge Studio', hours: 18, type: 'Project', skillIds: ['react', 'api'], levelGain: 20, masteryLevel: 75 },
  { id: 'lr-node-1', sequence: 7, title: 'Node.js & Express Fundamentals', provider: 'TCS iON', hours: 22, type: 'Course', skillIds: ['node'], levelGain: 35, masteryLevel: 60 },
  { id: 'lr-sql', sequence: 8, title: 'SQL for Application Developers', provider: 'Oracle Academy', hours: 10, type: 'Course', skillIds: ['sql'], levelGain: 25, masteryLevel: 65 },
  { id: 'lr-fs-project', sequence: 9, title: 'Capstone: Full Stack Project', provider: 'SkillBridge Studio', hours: 40, type: 'Project', skillIds: ['react', 'node', 'api', 'sql'], levelGain: 15, masteryLevel: 75 },
  { id: 'lr-comm', sequence: 10, title: 'Workplace Communication Lab', provider: 'SkillBridge Studio', hours: 8, type: 'Mentorship', skillIds: ['communication', 'presentation'], levelGain: 12, masteryLevel: 70 },
  { id: 'lr-fs-assess', sequence: 11, title: 'Industry Assessment: Full Stack', provider: 'SkillBridge', hours: 3, type: 'Assessment', skillIds: ['react', 'node', 'js', 'sql'], levelGain: 0, masteryLevel: 75 },
  { id: 'lr-py', sequence: 1, title: 'Python for Data Work', provider: 'NPTEL', hours: 18, type: 'Course', skillIds: ['python'], levelGain: 60, masteryLevel: 65 },
  { id: 'lr-stats', sequence: 2, title: 'Applied Statistics', provider: 'IIT Madras Online', hours: 20, type: 'Course', skillIds: ['stats'], levelGain: 55, masteryLevel: 70 },
  { id: 'lr-pandas', sequence: 3, title: 'Data Wrangling with Pandas', provider: 'SkillBridge Studio', hours: 14, type: 'Project', skillIds: ['pandas'], levelGain: 50, masteryLevel: 70 },
  { id: 'lr-sql-a', sequence: 4, title: 'Analytical SQL & Window Functions', provider: 'Oracle Academy', hours: 12, type: 'Course', skillIds: ['sql'], levelGain: 30, masteryLevel: 75 },
  { id: 'lr-bi', sequence: 5, title: 'Dashboards with Power BI', provider: 'Microsoft Learn', hours: 12, type: 'Course', skillIds: ['powerbi', 'dataviz'], levelGain: 45, masteryLevel: 65 },
  { id: 'lr-da-project', sequence: 6, title: 'Capstone: Business Analytics Report', provider: 'SkillBridge Studio', hours: 30, type: 'Project', skillIds: ['sql', 'powerbi', 'stats'], levelGain: 15, masteryLevel: 75 },
  { id: 'lr-ml-1', sequence: 4, title: 'Machine Learning Foundations', provider: 'IIT Bombay via Swayam', hours: 30, type: 'Course', skillIds: ['ml'], levelGain: 50, masteryLevel: 70 },
  { id: 'lr-dl', sequence: 5, title: 'Deep Learning with PyTorch', provider: 'Swayam', hours: 34, type: 'Course', skillIds: ['dl'], levelGain: 45, masteryLevel: 70 },
  { id: 'lr-ml-project', sequence: 6, title: 'Capstone: Deploy an ML Model', provider: 'SkillBridge Studio', hours: 28, type: 'Project', skillIds: ['ml', 'python'], levelGain: 15, masteryLevel: 75 },
  { id: 'lr-linux', sequence: 1, title: 'Linux Administration', provider: 'RedHat Academy', hours: 16, type: 'Course', skillIds: ['linux'], levelGain: 55, masteryLevel: 70 },
  { id: 'lr-cloud', sequence: 2, title: 'Cloud Foundations on AWS', provider: 'AWS Academy', hours: 24, type: 'Course', skillIds: ['cloud', 'aws'], levelGain: 55, masteryLevel: 70 },
  { id: 'lr-docker', sequence: 3, title: 'Containers with Docker', provider: 'SkillBridge Studio', hours: 14, type: 'Course', skillIds: ['docker'], levelGain: 50, masteryLevel: 70 },
  { id: 'lr-k8s', sequence: 4, title: 'Kubernetes in Practice', provider: 'CNCF Community', hours: 20, type: 'Project', skillIds: ['k8s'], levelGain: 45, masteryLevel: 65 },
  { id: 'lr-net', sequence: 1, title: 'Computer Networks Deep Dive', provider: 'NPTEL', hours: 22, type: 'Course', skillIds: ['networking'], levelGain: 55, masteryLevel: 70 },
  { id: 'lr-sec', sequence: 2, title: 'Security Operations Fundamentals', provider: 'CERT-In Partner Program', hours: 26, type: 'Course', skillIds: ['security'], levelGain: 55, masteryLevel: 70 },
  { id: 'lr-sec-project', sequence: 3, title: 'Capstone: Vulnerability Assessment', provider: 'SkillBridge Studio', hours: 24, type: 'Project', skillIds: ['security', 'linux'], levelGain: 15, masteryLevel: 70 },
]

export const resourceIndex: Record<string, LearningResource> = Object.fromEntries(learningResources.map((r) => [r.id, r]))

/** The canonical, prerequisite-ordered learning path for each role. */
export const rolePathways: Record<string, string[]> = {
  fsd: ['lr-html', 'lr-css', 'lr-js', 'lr-git', 'lr-react-1', 'lr-react-2', 'lr-node-1', 'lr-sql', 'lr-fs-project', 'lr-comm', 'lr-fs-assess'],
  data: ['lr-py', 'lr-stats', 'lr-pandas', 'lr-sql-a', 'lr-bi', 'lr-da-project'],
  ml: ['lr-py', 'lr-stats', 'lr-pandas', 'lr-ml-1', 'lr-dl', 'lr-ml-project'],
  cloud: ['lr-linux', 'lr-cloud', 'lr-docker', 'lr-k8s', 'lr-git'],
  cyber: ['lr-net', 'lr-sec', 'lr-linux', 'lr-sec-project'],
}

/** Twelve-month demand index per skill, seeded from partner postings. */
export const demandTrend = [
  { month: 'Sep', React: 62, 'AI/ML': 48, Cloud: 55, Cybersecurity: 41, 'Data Analytics': 52 },
  { month: 'Oct', React: 65, 'AI/ML': 53, Cloud: 57, Cybersecurity: 44, 'Data Analytics': 54 },
  { month: 'Nov', React: 68, 'AI/ML': 58, Cloud: 59, Cybersecurity: 47, 'Data Analytics': 55 },
  { month: 'Dec', React: 66, 'AI/ML': 61, Cloud: 58, Cybersecurity: 49, 'Data Analytics': 57 },
  { month: 'Jan', React: 71, 'AI/ML': 66, Cloud: 62, Cybersecurity: 52, 'Data Analytics': 59 },
  { month: 'Feb', React: 74, 'AI/ML': 70, Cloud: 64, Cybersecurity: 55, 'Data Analytics': 61 },
  { month: 'Mar', React: 76, 'AI/ML': 74, Cloud: 65, Cybersecurity: 58, 'Data Analytics': 62 },
  { month: 'Apr', React: 78, 'AI/ML': 79, Cloud: 67, Cybersecurity: 60, 'Data Analytics': 64 },
  { month: 'May', React: 77, 'AI/ML': 83, Cloud: 66, Cybersecurity: 63, 'Data Analytics': 63 },
]

export const skillDemand = [
  { name: 'React', trend: 24, openings: 1840, category: 'Technical Skills' },
  { name: 'AI/ML', trend: 31, openings: 960, category: 'Domain Skills' },
  { name: 'Cloud Computing', trend: 18, openings: 780, category: 'Domain Skills' },
  { name: 'Cybersecurity', trend: 27, openings: 640, category: 'Domain Skills' },
  { name: 'Data Analytics', trend: 21, openings: 1120, category: 'Domain Skills' },
  { name: 'Node.js', trend: 16, openings: 890, category: 'Technical Skills' },
]
