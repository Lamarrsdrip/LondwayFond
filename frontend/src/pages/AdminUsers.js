import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { 
  Search, 
  User, 
  Shield, 
  ShieldOff, 
  UserCheck, 
  UserX,
  ChevronLeft,
  ChevronRight,
  Edit,
  X,
  Save,
  AlertCircle
} from "lucide-react";

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString()
      });
      if (search) params.append("search", search);

      const response = await axios.get(`${API}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      is_active: user.is_active,
      is_admin: user.is_admin,
      balance: user.balance
    });
    setError("");
  };

  const handleSaveUser = async () => {
    setSaving(true);
    setError("");

    try {
      await axios.put(`${API}/admin/users/${editingUser.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div data-testid="admin-users-page">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0A1628]">Manage Users</h1>
            <p className="text-[#64748B]">{total} users total</p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or account number..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
              data-testid="search-users"
            />
          </div>
        </form>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="spinner" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-[#E2E8F0]" />
              <h3 className="text-lg font-semibold text-[#0A1628] mb-2">No Users Found</h3>
              <p className="text-[#64748B]">Try adjusting your search</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8F9FA] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Account</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Balance</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Joined</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-[#64748B]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {users.map((user) => (
                      <tr key={user.id} className="transaction-row">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center text-[#C9A227] text-sm font-bold">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-[#0A1628] flex items-center gap-2">
                                {user.first_name} {user.last_name}
                                {user.is_admin && (
                                  <Shield className="w-4 h-4 text-[#C9A227]" title="Admin" />
                                )}
                              </p>
                              <p className="text-sm text-[#64748B]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-sm text-[#0A1628]">{user.account_number}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono font-semibold text-[#0A1628]">
                            {formatCurrency(user.balance)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${
                            user.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {user.is_active ? (
                              <>
                                <UserCheck className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            data-testid={`edit-user-${user.id}`}
                          >
                            <Edit className="w-4 h-4 text-[#64748B]" />
                          </button>
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

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setEditingUser(null)} />
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md" data-testid="edit-user-modal">
              <button
                onClick={() => setEditingUser(null)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0A1628]"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-display font-bold text-[#0A1628] mb-1">Edit User</h2>
              <p className="text-[#64748B] text-sm mb-6">{editingUser.email}</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#0A1628] mb-2">Balance (USD)</label>
                  <input
                    type="number"
                    value={editForm.balance}
                    onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                    step="0.01"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#64748B]" />
                    <span className="text-[#0A1628]">Account Active</span>
                  </div>
                  <button
                    onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      editForm.is_active ? 'bg-green-500' : 'bg-[#E2E8F0]'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      editForm.is_active ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-[#0A1628]">Admin Privileges</span>
                  </div>
                  <button
                    onClick={() => setEditForm({ ...editForm, is_admin: !editForm.is_admin })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      editForm.is_admin ? 'bg-[#C9A227]' : 'bg-[#E2E8F0]'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      editForm.is_admin ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
              >
                {saving ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
