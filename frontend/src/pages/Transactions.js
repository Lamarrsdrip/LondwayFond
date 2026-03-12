import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { ArrowUpRight, ArrowDownLeft, Clock, Search, Filter, Download, Calendar } from "lucide-react";

export default function Transactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API}/transactions?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
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
      year: 'numeric',
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

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === "all" || 
      (filter === "incoming" && ['deposit', 'transfer_in'].includes(tx.type)) ||
      (filter === "outgoing" && ['transfer_out', 'withdrawal'].includes(tx.type));
    
    const matchesSearch = !search || 
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.sender_account?.toLowerCase().includes(search.toLowerCase()) ||
      tx.recipient_account?.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Calculate totals
  const totalIncoming = transactions
    .filter(tx => ['deposit', 'transfer_in'].includes(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalOutgoing = transactions
    .filter(tx => ['transfer_out', 'withdrawal'].includes(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in" data-testid="transactions-page">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0C0F1A] mb-2">Transactions</h1>
          <p className="text-neutral-500">View your complete transaction history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-500 text-sm">Total Incoming</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncoming)}</p>
          </div>
          
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-500 text-sm">Total Outgoing</span>
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutgoing)}</p>
          </div>
          
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-500 text-sm">Net Balance</span>
              <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#D4A853]" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${totalIncoming - totalOutgoing >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(totalIncoming - totalOutgoing)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-transparent rounded-xl focus:border-[#D4A853] focus:bg-white transition-all outline-none"
                data-testid="search-transactions"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
              {[
                { value: 'all', label: 'All' },
                { value: 'incoming', label: 'Incoming' },
                { value: 'outgoing', label: 'Outgoing' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === option.value 
                      ? 'bg-white shadow-sm text-[#0C0F1A]' 
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                  data-testid={`filter-${option.value}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="spinner" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-neutral-100 flex items-center justify-center">
                <Clock className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-[#0C0F1A] mb-2 text-lg">No Transactions Found</h3>
              <p className="text-neutral-500">
                {search || filter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Your transactions will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Description</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTransactionColor(tx.type)}`}>
                            {getTransactionIcon(tx.type)}
                          </div>
                          <span className="capitalize font-medium text-[#0C0F1A]">
                            {tx.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#0C0F1A] font-medium">{tx.description}</p>
                        {tx.recipient_account && (
                          <p className="text-xs text-neutral-500 font-mono mt-1">
                            To: {tx.recipient_account}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-neutral-500 text-sm">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${
                          tx.status === 'completed' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-bold ${
                          ['deposit', 'transfer_in'].includes(tx.type) ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {['deposit', 'transfer_in'].includes(tx.type) ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
