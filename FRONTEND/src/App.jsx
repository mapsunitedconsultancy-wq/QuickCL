import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login.jsx';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Extract from './pages/Extract';
import Results from './pages/Results';
import History from './pages/History';
import HSLookup from './pages/HSLookup';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import { Loader2 } from 'lucide-react';
import ImageExtract from './pages/ImageExtract';
import ImageResults from './pages/ImageResults';
import ScannedExtract from './pages/ScannedExtract';
import Pricing from './pages/Pricing.jsx';
import Payment from './pages/Payment.jsx';

// Protects routes — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-blue-700" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;

  // Redirect to register if profile registration details are incomplete
  if (!user.firmName || !user.phone) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

// Layout with sidebar for authenticated pages
function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// Helper to wrap a page with protection + layout
function Page({ component: Component }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Component />
      </AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { fontSize: '13px', fontWeight: 600 },
          duration: 2000,
        }} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={<Page component={Dashboard} />} />
          <Route path="/extract" element={<Page component={Extract} />} />
          <Route path="/results/:id" element={<Page component={Results} />} />
          <Route path="/history" element={<Page component={History} />} />
          <Route path="/hs-lookup" element={<Page component={HSLookup} />} />
          <Route path="/clients" element={<Page component={Clients} />} />
          <Route path="/settings" element={<Page component={Settings} />} />
          <Route path="/image-extract" element={<Page component={ImageExtract} />} />
          <Route path="/image-results/:id" element={<Page component={ImageResults} />} />
          <Route path="/scanned-extract" element={<Page component={ScannedExtract} />} />
          <Route path="/scanned-results/:id" element={<Page component={Results} />} />
          <Route path="/pricing" element={<Page component={Pricing} />} />
          <Route path="/payment" element={<Page component={Payment} />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

