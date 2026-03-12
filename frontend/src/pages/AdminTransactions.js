import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

export default function AdminTransactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState("");

  const limit = 20;

  useEffect(() => {
    fetchTransactions();
  }, [page, userId]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString()
      });
      if (userId) params.append("user_id", userId);

      const response = await axios.get(`${API}/admin/transactions?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
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

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in" data-testid="admin-transactions-page">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0C0F1A] mb-2">All Transactions</h1>
          <p className="text-neutral-500">{total} transactions total</p>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setPage(0);
                }}
                placeholder="Filter by User ID..."
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-transparent rounded-xl focus:border-[#D4A853] focus:bg-white transition-all outline-none"
                data-testid="filter-user-id"
              />
            </div>
            {userId && (
              <button
                onClick={() => {
                  setUserId("");
                  setPage(0);
                }}
                className="flex items-center gap-2 px-4 py-3 text-neutral-500 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="spinner" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-neutral-100 flex items-center justify-center">
                <Clock className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-[#0C0F1A] mb-2 text-lg">No Transactions Found</h3>
              <p className="text-neutral-500">
                {userId ? "No transactions for this user" : "No transactions in the system"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Type</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">User ID</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Description</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Status</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {transactions.map((tx) => (
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
                          <p className="font-mono text-xs text-neutral-500 truncate max-w-[120px]" title={tx.user_id}>
                            {tx.user_id.slice(0, 8)}...
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#0C0F1A] font-medium">{tx.description}</p>
                          <div className="text-xs text-neutral-500 font-mono mt-1">
                            {tx.sender_account && tx.sender_account !== 'SYSTEM' && tx.sender_account !== 'STRIPE' && (
                              <span className="mr-3">From: {tx.sender_account}</span>
                            )}
                            {tx.recipient_account && (
                              <span>To: {tx.recipient_account}</span>
                            )}
                          </div>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
                  <p className="text-sm text-neutral-500">
                    Showing {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="p-2 hover:bg-neutral-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-[#0C0F1A] px-3">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="p-2 hover:bg-neutral-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
