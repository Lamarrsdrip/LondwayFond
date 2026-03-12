import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { 
  LayoutDashboard, 
  Send, 
  Download, 
  History, 
  CreditCard, 
  User, 
  LogOut, 
  Shield,
  Users,
  FileText,
  Menu,
  X
} from "lucide-react";

import { useState } from "react";

const userNavItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/send", icon: Send, label: "Send Money" },
  { path: "/receive", icon: Download, label: "Receive / Deposit" },
  { path: "/transactions", icon: History, label: "Transactions" },
  { path: "/cards", icon: CreditCard, label: "Cards" },
  { path: "/profile", icon: User, label: "Profile" },
];

const adminNavItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Admin Dashboard" },
  { path: "/admin/users", icon: Users, label: "Manage Users" },
  { path: "/admin/transactions", icon: FileText, label: "All Transactions" },
];

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.is_admin;
  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = isAdminRoute ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E2E8F0] px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl">
            <span className="text-[#0A1628]">Londway</span>
            <span className="text-[#C9A227]">Fond</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-[#F1F5F9] rounded-lg"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-[#0A1628] z-50 transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#1E3A5F]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-display font-bold text-xl">
              <span className="text-white">Londway</span>
              <span className="text-[#C9A227]">Fond</span>
              <span className="text-[#94A3B8] text-xs ml-1 font-normal tracking-wider uppercase">Bank</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-[#0A1628] font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user?.first_name} {user?.last_name}</p>
                <p className="text-[#94A3B8] text-xs">{user?.account_number}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Admin/User Switch */}
            {isAdmin && (
              <>
                <div className="my-4 border-t border-[#1E3A5F]" />
                {isAdminRoute ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="sidebar-link"
                    data-testid="nav-user-dashboard"
                  >
                    <User className="w-5 h-5" />
                    <span>User Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="sidebar-link"
                    data-testid="nav-admin-panel"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-[#1E3A5F]">
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav lg:hidden">
        {userNavItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              location.pathname === item.path 
                ? 'text-[#C9A227]' 
                : 'text-[#64748B]'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
