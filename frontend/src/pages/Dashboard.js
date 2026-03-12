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
  AlertCircle,
  Sparkles,
  ArrowRight,
  Wallet,
  Activity
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
        return <ArrowDownLeft className="w-5 h-5" />;
      case 'transfer_out':
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getTransactionColor = (type) => {
    return ['deposit', 'transfer_in'].includes(type) ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50';
  };

  const quickActions = [
    { icon: Send, label: "Send", desc: "Transfer funds", path: "/send", gradient: "from-blue-500 to-blue-600" },
    { icon: Download, label: "Deposit", desc: "Add money", path: "/receive", gradient: "from-emerald-500 to-emerald-600" },
    { icon: CreditCard, label: "Cards", desc: "Virtual cards", path: "/cards", gradient: "from-purple-500 to-purple-600" },
    { icon: Activity, label: "History", desc: "All transactions", path: "/transactions", gradient: "from-orange-500 to-orange-600" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in" data-testid="user-dashboard">
        {/* Payment Status Alert */}
        {paymentStatus && (
          <div className={`p-4 rounded-2xl flex items-center gap-4 animate-slide-down ${
            paymentStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-100' :
            paymentStatus.type === 'error' ? 'bg-red-50 border border-red-100' :
            paymentStatus.type === 'checking' ? 'bg-blue-50 border border-blue-100' :
            'bg-amber-50 border border-amber-100'
          }`} data-testid="payment-status">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              paymentStatus.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
              paymentStatus.type === 'error' ? 'bg-red-100 text-red-600' :
              paymentStatus.type === 'checking' ? 'bg-blue-100 text-blue-600' :
              'bg-amber-100 text-amber-600'
            }`}>
              {paymentStatus.type === 'success' && <CheckCircle className="w-6 h-6" />}
              {paymentStatus.type === 'error' && <AlertCircle className="w-6 h-6" />}
              {paymentStatus.type === 'checking' && <div className="spinner" />}
              {paymentStatus.type === 'pending' && <Clock className="w-6 h-6" />}
            </div>
            <span className="font-medium text-[#0C0F1A]">{paymentStatus.message}</span>
          </div>
        )}

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#D4A853] mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">Welcome back</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0C0F1A]">
              {user?.first_name} {user?.last_name}
            </h1>
          </div>
          <p className="text-neutral-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Balance & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C0F1A] to-[#1A2235] p-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A853]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#D4A853]/5 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-[#D4A853]" />
                </div>
                <div>
                  <p className="text-neutral-400 text-sm">Total Balance</p>
                  <p className="text-white/60 text-xs font-mono">{user?.account_number}</p>
                </div>
              </div>
              
              <p className="font-display text-5xl md:text-6xl font-bold text-white mb-2" data-testid="balance-display">
                {formatCurrency(user?.balance || 0)}
              </p>
              <p className="text-emerald-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12.5% from last month
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-500 text-sm font-medium">Monthly Income</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0C0F1A]">+$4,250.00</p>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-500 text-sm font-medium">Monthly Spending</span>
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0C0F1A]">-$1,800.00</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-[#0C0F1A] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="card p-5 text-left group hover:scale-[1.02] transition-all duration-300"
                data-testid={`quick-action-${action.label.toLowerCase()}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0C0F1A] mb-1">{action.label}</h3>
                <p className="text-sm text-neutral-500">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0C0F1A]">Recent Transactions</h2>
            <button 
              onClick={() => navigate("/transactions")}
              className="text-[#D4A853] text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="spinner" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-[#0C0F1A] mb-1">No transactions yet</h3>
              <p className="text-neutral-500 text-sm">Your transactions will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 px-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getTransactionColor(tx.type)}`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-[#0C0F1A]">{tx.description}</p>
                      <p className="text-sm text-neutral-500">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-semibold ${
                      ['deposit', 'transfer_in'].includes(tx.type) ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {['deposit', 'transfer_in'].includes(tx.type) ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span className={`badge ${tx.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
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
