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
  X,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const userNavItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/send", icon: Send, label: "Send Money" },
  { path: "/receive", icon: Download, label: "Deposit" },
  { path: "/transactions", icon: History, label: "Transactions" },
  { path: "/cards", icon: CreditCard, label: "Cards" },
  { path: "/profile", icon: User, label: "Profile" },
];

const adminNavItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Overview" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/transactions", icon: FileText, label: "Transactions" },
];

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = user?.is_admin;
  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = isAdminRoute ? adminNavItems : userNavItems;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl">
            <span className="text-[#0C0F1A]">Londway</span>
            <span className="text-[#D4A853]">Fond</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[280px] bg-[#0C0F1A] z-50 transform transition-transform duration-300 ease-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center">
                <span className="font-display font-bold text-[#0C0F1A] text-lg">L</span>
              </div>
              <div className="font-display font-bold text-xl">
                <span className="text-white">Londway</span>
                <span className="text-[#D4A853]">Fond</span>
              </div>
            </Link>
          </div>

          {/* User Card */}
          <div className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#1A2235] to-[#242D42] border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center text-[#0C0F1A] font-bold text-lg">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-neutral-500 text-xs font-mono truncate">{user?.account_number}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10">
              <p className="text-neutral-500 text-xs mb-1">Available Balance</p>
              <p className="text-white font-display font-bold text-xl">{formatCurrency(user?.balance || 0)}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 overflow-y-auto">
            <p className="text-neutral-600 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
              {isAdminRoute ? 'Admin Menu' : 'Main Menu'}
            </p>
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
                {location.pathname === item.path && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            ))}

            {/* Admin/User Switch */}
            {isAdmin && (
              <>
                <div className="my-6 border-t border-white/10" />
                <p className="text-neutral-600 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                  Switch View
                </p>
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
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-[280px] min-h-screen pt-16 lg:pt-0">
        {/* Top Bar - Desktop */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-neutral-200 bg-white/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text"
                placeholder="Search..."
                className="pl-12 pr-4 py-2.5 bg-neutral-100 border-0 rounded-xl w-80 focus:ring-2 focus:ring-[#D4A853] focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 hover:bg-neutral-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-neutral-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 pl-2 hover:bg-neutral-100 rounded-xl p-2 transition-colors cursor-pointer"
                data-testid="profile-menu-toggle"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-800">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-neutral-500">{isAdminRoute ? 'Administrator' : 'Personal Account'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center text-[#0C0F1A] font-bold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50">
                  <Link to="/profile" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors" data-testid="profile-menu-profile">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <div className="border-t border-neutral-100" />
                  <button 
                    onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    data-testid="profile-menu-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav">
        {userNavItems.slice(0, 4).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
              location.pathname === item.path 
                ? 'text-[#D4A853] bg-[#D4A853]/10' 
                : 'text-neutral-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors text-red-400"
          data-testid="mobile-logout-button"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
