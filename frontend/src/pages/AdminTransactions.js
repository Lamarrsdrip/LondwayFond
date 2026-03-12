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
  Filter
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

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div data-testid="admin-transactions-page">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0A1628]">All Transactions</h1>
            <p className="text-[#64748B]">{total} transactions total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setPage(0);
                }}
                placeholder="Filter by User ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                data-testid="filter-user-id"
              />
            </div>
            {userId && (
              <button
                onClick={() => {
                  setUserId("");
                  setPage(0);
                }}
                className="px-4 py-2.5 text-[#64748B] hover:text-[#0A1628] border border-[#E2E8F0] rounded-lg"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="spinner" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-[#E2E8F0]" />
              <h3 className="text-lg font-semibold text-[#0A1628] mb-2">No Transactions Found</h3>
              <p className="text-[#64748B]">
                {userId ? "No transactions for this user" : "No transactions in the system"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8F9FA] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Type</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">User ID</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Description</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Status</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-[#64748B]">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="transaction-row">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                              {getTransactionIcon(tx.type)}
                            </div>
                            <span className="capitalize text-[#0A1628] font-medium">
                              {tx.type.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-xs text-[#64748B] truncate max-w-[120px]" title={tx.user_id}>
                            {tx.user_id}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#0A1628]">{tx.description}</p>
                          <div className="text-xs text-[#64748B] font-mono mt-1">
                            {tx.sender_account && tx.sender_account !== 'SYSTEM' && tx.sender_account !== 'STRIPE' && (
                              <span className="mr-2">From: {tx.sender_account}</span>
                            )}
                            {tx.recipient_account && (
                              <span>To: {tx.recipient_account}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#64748B] text-sm">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            tx.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-mono font-semibold ${getAmountClass(tx.type)}`}>
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
                <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">
                    Showing {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="p-2 hover:bg-[#F1F5F9] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-[#0A1628]">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="p-2 hover:bg-[#F1F5F9] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
