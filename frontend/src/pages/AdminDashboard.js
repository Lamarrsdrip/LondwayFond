import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  Activity,
  Wallet,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats?.total_users || 0,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      path: "/admin/users"
    },
    {
      label: "Active Users",
      value: stats?.active_users || 0,
      icon: Activity,
      gradient: "from-emerald-500 to-emerald-600",
      path: "/admin/users"
    },
    {
      label: "Total Transactions",
      value: stats?.total_transactions || 0,
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      path: "/admin/transactions"
    },
    {
      label: "Total Volume",
      value: formatCurrency(stats?.total_volume || 0),
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600",
      path: "/admin/transactions"
    },
    {
      label: "Total Balance",
      value: formatCurrency(stats?.total_balance || 0),
      icon: Wallet,
      gradient: "from-[#D4A853] to-[#B8923E]",
      path: "/admin/users"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in" data-testid="admin-dashboard">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0C0F1A] mb-2">Admin Dashboard</h1>
          <p className="text-neutral-500">Overview of system statistics and management</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  onClick={() => navigate(stat.path)}
                  className="card p-6 cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                  data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-neutral-300 group-hover:text-[#D4A853] transition-colors" />
                  </div>
                  <p className="text-neutral-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#0C0F1A]">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-lg font-bold text-[#0C0F1A]">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
                <button
                  onClick={() => navigate("/admin/users")}
                  className="p-6 text-left hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#0C0F1A]">Manage Users</p>
                      <p className="text-sm text-neutral-500">View, edit, or deactivate accounts</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-[#D4A853] group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                <button
                  onClick={() => navigate("/admin/transactions")}
                  className="p-6 text-left hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#0C0F1A]">View Transactions</p>
                      <p className="text-sm text-neutral-500">Monitor all system transactions</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-[#D4A853] group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
