import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Menu } from 'lucide-react';

function MainLayout({ children }) {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {user && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}

      <div className="flex flex-col min-w-0">
        {user && (
          <header className="md:hidden flex items-center justify-between bg-slate-955 text-white px-6 py-4 border-b border-slate-900 sticky top-0 z-40 shadow-md">
            <span className="font-heading text-base font-black tracking-tight text-white">CompleteIt</span>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <Menu size={20} />
            </button>
          </header>
        )}

        <main className={`min-h-screen ${user ? "pl-0 md:pl-64" : ""}`}>
          {children}
        </main>
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