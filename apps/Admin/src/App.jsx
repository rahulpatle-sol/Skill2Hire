import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth & Layouts
import Register from './components/Register';
import Login from './components/Login';
import VerifyOTP from './components/VerifyOTP';
import DashbordLayout from './pages/DashbordLayout';

// Admin Pages
import UserManagement from './pages/Admin/UserManagment';
import ManagerControl from './pages/Admin/ManagerControl';

// Manager Pages
import BridgePanel from './pages/Manager/BridgePanel';
import VerificationHub from './pages/Manager/VerificationHub';

function App() {
  // Helper to check if user is logged in
  const isAuthenticated = () => !!localStorage.getItem("user");
  
  return (
    <BrowserRouter>
      {/* Toast Notifications Setup */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="colored"
        pauseOnHover={false}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Dashboard Shell (Protected) */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <DashbordLayout /> : <Navigate to="/login" />}
        >
           {/* Default Path (Redirect to respective dashboard) */}
           <Route index element={<Navigate to="/admin/users" replace />} />

           {/* Admin Routes */}
           <Route path="admin/users" element={<UserManagement />} />
           <Route path="admin/managers" element={<ManagerControl />} />

           {/* Manager Routes */}
           <Route path="manager/bridge" element={<BridgePanel />} />
           <Route path="manager/verify" element={<VerificationHub />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;