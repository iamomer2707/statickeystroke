import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ui/Toast';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy-loaded protected pages
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const DatasetView = lazy(() => import('./pages/DatasetView'));
const Classification = lazy(() => import('./pages/Classification'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminReports = lazy(() => import('./pages/AdminReports'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Loading = () => (
  <div className="min-h-screen bg-cyber-black flex items-center justify-center">
    <LoadingSpinner text="Loading interface..." />
  </div>
);

export default function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<Login />} />

          {/* User-protected */}
          <Route element={<ProtectedRoute role="user"><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/dataset" element={<DatasetView />} />
            <Route path="/classification" element={<Classification />} />
          </Route>

          {/* Admin-protected */}
          <Route element={<ProtectedRoute role="admin"><Layout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
}
