import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, type ReactNode } from 'react'
import { AppProvider, useApp } from './store'
import { AppShell, ToastStack } from './components/AppShell'
import { Card, EmptyState, LinkButton } from './components/ui/primitives'
import Login from './pages/Login'
const Collaboration = lazy(() => import('./pages/Collaboration'))
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const SkillProfile = lazy(() => import('./pages/student/SkillProfile'))
const SkillGap = lazy(() => import('./pages/student/SkillGap'))
const Roadmap = lazy(() => import('./pages/student/Roadmap'))
const Opportunities = lazy(() => import('./pages/student/Opportunities'))
const OpportunityDetail = lazy(() => import('./pages/student/OpportunityDetail'))
const Applications = lazy(() => import('./pages/student/Applications'))
const Portfolio = lazy(() => import('./pages/student/Portfolio'))
const Assessment = lazy(() => import('./pages/student/Assessment'))
const IndustryDashboard = lazy(() => import('./pages/industry/Dashboard'))
const Postings = lazy(() => import('./pages/industry/Postings'))
const PostingDetail = lazy(() => import('./pages/industry/PostingDetail'))
const PostOpportunity = lazy(() => import('./pages/industry/PostOpportunity'))
const Candidates = lazy(() => import('./pages/industry/Candidates'))
const FacultyDashboard = lazy(() => import('./pages/faculty/Dashboard'))
const Programs = lazy(() => import('./pages/faculty/Programs'))
const Demand = lazy(() => import('./pages/faculty/Demand'))
const InstitutionDashboard = lazy(() => import('./pages/institution/Dashboard'))
const InstitutionStudents = lazy(() => import('./pages/institution/Students'))
const InstitutionGaps = lazy(() => import('./pages/institution/Gaps'))
const Placements = lazy(() => import('./pages/institution/Placements'))

/** Sends anyone without a session back to the demo login. */
function RequireAuth({ children }: { children: ReactNode }) {
  const { account } = useApp()
  const loc = useLocation()
  if (!account) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}

function NotFound() {
  const { account } = useApp()
  return (
    <Card>
      <EmptyState title="Page not found"
        body="That route does not exist in the prototype. Everything in the sidebar is wired up."
        action={<LinkButton to={account?.home ?? '/login'} size="sm">Back to dashboard</LinkButton>} />
    </Card>
  )
}

function Shell() {
  return (
    <RequireAuth>
      <AppShell />
    </RequireAuth>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Shell />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/skills" element={<SkillProfile />} />
            <Route path="/student/gap" element={<SkillGap />} />
            <Route path="/student/roadmap" element={<Roadmap />} />
            <Route path="/student/opportunities" element={<Opportunities />} />
            <Route path="/student/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/student/applications" element={<Applications />} />
            <Route path="/student/portfolio" element={<Portfolio />} />
            <Route path="/student/assessment" element={<Assessment />} />

            <Route path="/industry" element={<IndustryDashboard />} />
            <Route path="/industry/postings" element={<Postings />} />
            <Route path="/industry/postings/:id" element={<PostingDetail />} />
            <Route path="/industry/post" element={<PostOpportunity />} />
            <Route path="/industry/candidates" element={<Candidates />} />

            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/programs" element={<Programs />} />
            <Route path="/faculty/demand" element={<Demand />} />

            <Route path="/institution" element={<InstitutionDashboard />} />
            <Route path="/institution/students" element={<InstitutionStudents />} />
            <Route path="/institution/gaps" element={<InstitutionGaps />} />
            <Route path="/institution/placements" element={<Placements />} />

            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastStack />
      </BrowserRouter>
    </AppProvider>
  )
}
