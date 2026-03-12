import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { 
  Search, 
  User, 
  Shield, 
  UserCheck, 
  UserX,
  ChevronLeft,
  ChevronRight,
  Edit,
  X,
  Save,
  AlertCircle,
  MoreVertical
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
      <div className="space-y-6 animate-fade-in" data-testid="admin-users-page">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0C0F1A] mb-2">Manage Users</h1>
          <p className="text-neutral-500">{total} users total</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="card p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or account number..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-transparent rounded-xl focus:border-[#D4A853] focus:bg-white transition-all outline-none"
              data-testid="search-users"
            />
          </div>
        </form>

        {/* Users Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="spinner" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-neutral-100 flex items-center justify-center">
                <User className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-[#0C0F1A] mb-2 text-lg">No Users Found</h3>
              <p className="text-neutral-500">Try adjusting your search</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Account</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Balance</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500">Joined</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0C0F1A] to-[#1A2235] flex items-center justify-center text-[#D4A853] text-sm font-bold">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-[#0C0F1A] flex items-center gap-2">
                                {user.first_name} {user.last_name}
                                {user.is_admin && (
                                  <Shield className="w-4 h-4 text-[#D4A853]" title="Admin" />
                                )}
                              </p>
                              <p className="text-sm text-neutral-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-sm text-[#0C0F1A]">{user.account_number}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono font-semibold text-[#0C0F1A]">
                            {formatCurrency(user.balance)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${
                            user.is_active ? 'badge-success' : 'badge-error'
                          }`}>
                            {user.is_active ? (
                              <><UserCheck className="w-3 h-3" /> Active</>
                            ) : (
                              <><UserX className="w-3 h-3" /> Inactive</>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors"
                            data-testid={`edit-user-${user.id}`}
                          >
                            <Edit className="w-4 h-4 text-neutral-500" />
                          </button>
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

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md animate-scale-in" data-testid="edit-user-modal">
              <button
                onClick={() => setEditingUser(null)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-[#0C0F1A]">Edit User</h2>
                <p className="text-neutral-500">{editingUser.email}</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">Balance (USD)</label>
                  <input
                    type="number"
                    value={editForm.balance}
                    onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) })}
                    className="input-modern"
                    step="0.01"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-neutral-500" />
                    <span className="font-medium text-[#0C0F1A]">Account Active</span>
                  </div>
                  <button
                    onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      editForm.is_active ? 'bg-emerald-500' : 'bg-neutral-300'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform mx-1 ${
                      editForm.is_active ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#D4A853]" />
                    <span className="font-medium text-[#0C0F1A]">Admin Privileges</span>
                  </div>
                  <button
                    onClick={() => setEditForm({ ...editForm, is_admin: !editForm.is_admin })}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      editForm.is_admin ? 'bg-[#D4A853]' : 'bg-neutral-300'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform mx-1 ${
                      editForm.is_admin ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
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
