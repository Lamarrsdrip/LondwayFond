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
  Activity
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
      color: "bg-blue-500",
      path: "/admin/users"
    },
    {
      label: "Active Users",
      value: stats?.active_users || 0,
      icon: Activity,
      color: "bg-green-500",
      path: "/admin/users"
    },
    {
      label: "Total Transactions",
      value: stats?.total_transactions || 0,
      icon: FileText,
      color: "bg-purple-500",
      path: "/admin/transactions"
    },
    {
      label: "Total Volume",
      value: formatCurrency(stats?.total_volume || 0),
      icon: TrendingUp,
      color: "bg-orange-500",
      path: "/admin/transactions"
    },
    {
      label: "Total Balance (All Accounts)",
      value: formatCurrency(stats?.total_balance || 0),
      icon: DollarSign,
      color: "bg-[#C9A227]",
      path: "/admin/users"
    }
  ];

  return (
    <DashboardLayout>
      <div data-testid="admin-dashboard">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#0A1628]">Admin Dashboard</h1>
          <p className="text-[#64748B]">Overview of system statistics</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  onClick={() => navigate(stat.path)}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:border-[#C9A227] transition-colors cursor-pointer group"
                  data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#64748B] group-hover:text-[#C9A227] transition-colors" />
                  </div>
                  <p className="text-[#64748B] text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#0A1628]">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/admin/users")}
                  className="p-4 bg-[#F8F9FA] rounded-lg text-left hover:bg-[#F1F5F9] transition-colors"
                >
                  <Users className="w-6 h-6 text-[#C9A227] mb-2" />
                  <p className="font-semibold text-[#0A1628]">Manage Users</p>
                  <p className="text-sm text-[#64748B]">View, edit, or deactivate user accounts</p>
                </button>
                <button
                  onClick={() => navigate("/admin/transactions")}
                  className="p-4 bg-[#F8F9FA] rounded-lg text-left hover:bg-[#F1F5F9] transition-colors"
                >
                  <FileText className="w-6 h-6 text-[#C9A227] mb-2" />
                  <p className="font-semibold text-[#0A1628]">View Transactions</p>
                  <p className="text-sm text-[#64748B]">Monitor all system transactions</p>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
