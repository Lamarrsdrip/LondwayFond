import { useEffect, useState, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Dashboard from "@/pages/Dashboard";
import SendMoney from "@/pages/SendMoney";
import ReceiveMoney from "@/pages/ReceiveMoney";
import Transactions from "@/pages/Transactions";
import Cards from "@/pages/Cards";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminTransactions from "@/pages/AdminTransactions";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("lwf_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error("Auth error:", error);
          localStorage.removeItem("lwf_token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { access_token, user: userData } = response.data;
    localStorage.setItem("lwf_token", access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const response = await axios.post(`${API}/auth/register`, data);
    const { access_token, user: userData } = response.data;
    localStorage.setItem("lwf_token", access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("lwf_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const response = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        return response.data;
      } catch (error) {
        console.error("Refresh error:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="animate-pulse text-[#C9A227] text-xl font-display">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="animate-pulse text-[#C9A227] text-xl font-display">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><RegisterPage /></PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/send" element={
            <ProtectedRoute><SendMoney /></ProtectedRoute>
          } />
          <Route path="/receive" element={
            <ProtectedRoute><ReceiveMoney /></ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute><Transactions /></ProtectedRoute>
          } />
          <Route path="/cards" element={
            <ProtectedRoute><Cards /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>
          } />
          <Route path="/admin/transactions" element={
            <ProtectedRoute adminOnly><AdminTransactions /></ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
