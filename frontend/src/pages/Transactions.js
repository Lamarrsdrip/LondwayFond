import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { ArrowUpRight, ArrowDownLeft, Clock, Search, Filter, Download } from "lucide-react";

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

  return (
    <DashboardLayout>
      <div data-testid="transactions-page">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0A1628]">Transactions</h1>
            <p className="text-[#64748B]">View your complete transaction history</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                data-testid="search-transactions"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#64748B]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                data-testid="filter-type"
              >
                <option value="all">All Transactions</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="spinner" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-[#E2E8F0]" />
              <h3 className="text-lg font-semibold text-[#0A1628] mb-2">No Transactions Found</h3>
              <p className="text-[#64748B]">
                {search || filter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Your transactions will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Description</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-[#64748B]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredTransactions.map((tx) => (
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
                        <p className="text-[#0A1628]">{tx.description}</p>
                        {tx.sender_account && tx.sender_account !== 'SYSTEM' && tx.sender_account !== 'STRIPE' && (
                          <p className="text-sm text-[#64748B] font-mono">
                            From: {tx.sender_account}
                          </p>
                        )}
                        {tx.recipient_account && (
                          <p className="text-sm text-[#64748B] font-mono">
                            To: {tx.recipient_account}
                          </p>
                        )}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
