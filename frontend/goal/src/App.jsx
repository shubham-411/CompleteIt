import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function MainLayout({ children }) {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {user && <Sidebar />}
      <div className={user ? "pl-64" : ""}>
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Employee') return <Navigate to="/employee" replace />;
  if (user.role === 'Manager') return <Navigate to="/manager" replace />;
  if (user.role === 'Admin') return <Navigate to="/admin" replace />;
  return <div className="p-8">Dashboard parsing fallback complete.</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/manager" element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<div className="p-8 text-center text-slate-400">404: Resource parameters outside system configuration scope.</div>} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}