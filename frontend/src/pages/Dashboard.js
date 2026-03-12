import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  Download, 
  CreditCard, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    fetchData();
    checkPaymentStatus();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/transactions?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (payment === "success" && sessionId) {
      setPaymentStatus({ type: "checking", message: "Verifying payment..." });
      
      // Poll for payment status
      let attempts = 0;
      const maxAttempts = 5;
      
      const pollStatus = async () => {
        try {
          const response = await axios.get(`${API}/deposits/status/${sessionId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.payment_status === "paid") {
            setPaymentStatus({ 
              type: "success", 
              message: `Deposit of $${response.data.amount.toFixed(2)} successful!` 
            });
            await refreshUser();
            fetchData();
            // Clear URL params
            window.history.replaceState({}, '', '/dashboard');
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollStatus, 2000);
          } else {
            setPaymentStatus({ type: "pending", message: "Payment is being processed..." });
          }
        } catch (error) {
          console.error("Error checking payment:", error);
          setPaymentStatus({ type: "error", message: "Error verifying payment" });
        }
      };
      
      pollStatus();
    } else if (payment === "cancelled") {
      setPaymentStatus({ type: "info", message: "Payment was cancelled" });
      window.history.replaceState({}, '', '/dashboard');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'transfer_out':
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-[#64748B]" />;
    }
  };

  const getAmountClass = (type) => {
    return ['deposit', 'transfer_in'].includes(type) ? 'text-green-600' : 'text-red-600';
  };

  const quickActions = [
    { icon: Send, label: "Send Money", path: "/send", color: "bg-blue-500" },
    { icon: Download, label: "Deposit", path: "/receive", color: "bg-green-500" },
    { icon: CreditCard, label: "Cards", path: "/cards", color: "bg-purple-500" },
    { icon: TrendingUp, label: "History", path: "/transactions", color: "bg-orange-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="user-dashboard">
        {/* Payment Status Alert */}
        {paymentStatus && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            paymentStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
            paymentStatus.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
            paymentStatus.type === 'checking' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
            'bg-yellow-50 border border-yellow-200 text-yellow-700'
          }`} data-testid="payment-status">
            {paymentStatus.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {paymentStatus.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {paymentStatus.type === 'checking' && <div className="spinner" />}
            <span>{paymentStatus.message}</span>
          </div>
        )}

        {/* Welcome & Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 balance-gradient rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-[#94A3B8] mb-2">Welcome back,</p>
              <h1 className="font-display text-3xl font-bold mb-6">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-[#94A3B8] text-sm mb-1">Total Balance</p>
              <p className="font-mono text-5xl font-bold text-[#C9A227]" data-testid="balance-display">
                {formatCurrency(user?.balance || 0)}
              </p>
              <p className="text-[#64748B] text-sm mt-2">
                Account: {user?.account_number}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#64748B] text-sm">This Month</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-[#0A1628]">+$2,450.00</p>
              <p className="text-green-500 text-sm">+12.5% from last month</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#64748B] text-sm">Pending</span>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-[#0A1628]">$0.00</p>
              <p className="text-[#64748B] text-sm">0 transactions</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
          <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="quick-action bg-[#F8F9FA] hover:bg-[#F1F5F9]"
                data-testid={`quick-action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[#0A1628] font-medium text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-[#E2E8F0]">
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0A1628]">Recent Transactions</h2>
            <button 
              onClick={() => navigate("/transactions")}
              className="text-[#C9A227] text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="spinner" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-[#64748B]">
              <Clock className="w-12 h-12 mx-auto mb-4 text-[#E2E8F0]" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 transaction-row flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-[#0A1628]">{tx.description}</p>
                      <p className="text-sm text-[#64748B]">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-semibold ${getAmountClass(tx.type)}`}>
                      {['deposit', 'transfer_in'].includes(tx.type) ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
