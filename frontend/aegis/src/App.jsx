
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import AuthorityDashboard from './pages/authority/Dashboard';
import StudentProblems from './pages/student/Problems';
import AuthorityProblems from './pages/authority/Problems';
import AdminProblems from './pages/admin/Problems';
import StudentEvents from './pages/student/Events';
import FacultyEvents from './pages/faculty/Events';
import AdminEvents from './pages/admin/Events';
import StudentProfile from './pages/student/StudentProfile';
import LostFound from './components/student/LostFound';
import Marketplace from './components/student/Marketplace';
import Forum from './components/forum/Forum';
import CampusMap from './components/campus/CampusMap';
import EmergencySOS from './components/campus/EmergencySOS';
import Clubs from './components/clubs/Clubs';
import Announcements from './components/campus/Announcements';

import './styles/App.css';


function App() {
  const getDashboardByRole = (role) => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'student': return '/student/dashboard';
      case 'faculty': return '/faculty/dashboard';
      case 'authority': return '/authority/dashboard';
      default: return '/login';
    }
  };

  const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (token && role) {
      return <Navigate to={getDashboardByRole(role)} replace />;
    }
    return children;
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('role');

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to={getDashboardByRole(userRole)} replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Protected Routes with Role Checks */}
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminRoutes /></ProtectedRoute>} />
        <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentRoutes /></ProtectedRoute>} />
        <Route path="/campus/*" element={<ProtectedRoute allowedRoles={['student']}><CampusRoutes /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute allowedRoles={['student']}><Forum /></ProtectedRoute>} />
        <Route path="/clubs" element={<ProtectedRoute allowedRoles={['student']}><Clubs /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/faculty/*" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyRoutes /></ProtectedRoute>} />
        <Route path="/authority/*" element={<ProtectedRoute allowedRoles={['authority']}><AuthorityRoutes /></ProtectedRoute>} />

        {/* Individual Protected Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/problems" element={<ProtectedRoute allowedRoles={['admin']}><AdminProblems /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><AdminEvents /></ProtectedRoute>} />

        <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/events" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyEvents /></ProtectedRoute>} />

        <Route path="/authority/dashboard" element={<ProtectedRoute allowedRoles={['authority']}><AuthorityDashboard /></ProtectedRoute>} />
        <Route path="/authority/problems" element={<ProtectedRoute allowedRoles={['authority']}><AuthorityProblems /></ProtectedRoute>} />

        <Route path="/" element={
          <PublicRoute>
            <Navigate to="/login" replace />
          </PublicRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// Helper components... (rest same)

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="problems" element={<AdminProblems />} />
      <Route path="events" element={<AdminEvents />} />
    </Routes>
  );
}
function StudentRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="problems" element={<StudentProblems />} />
      <Route path="events" element={<StudentEvents />} />
      <Route path="lost-found" element={<LostFound />} />
      <Route path="marketplace" element={<Marketplace />} />
    </Routes>
  );
}
function CampusRoutes() {
  return (
    <Routes>
      <Route path="map" element={<CampusMap />} />
      <Route path="emergency" element={<EmergencySOS />} />
      <Route path="announcements" element={<Announcements />} />
    </Routes>
  );
}
function FacultyRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<FacultyDashboard />} />
      <Route path="events" element={<FacultyEvents />} />
    </Routes>
  );
}
function AuthorityRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<AuthorityDashboard />} />
      <Route path="problems" element={<AuthorityProblems />} />
    </Routes>
  );
}


export default App;
