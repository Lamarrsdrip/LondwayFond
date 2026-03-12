import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { User, Mail, Phone, Save, CheckCircle, AlertCircle, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const { user, token, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.put(`${API}/account/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto" data-testid="profile-page">
        <h1 className="font-display text-3xl font-bold text-[#0A1628] mb-2">Profile</h1>
        <p className="text-[#64748B] mb-8">Manage your account settings</p>

        {/* Account Overview */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#0A1628] flex items-center justify-center text-[#C9A227] text-2xl font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0A1628]">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-[#64748B]">{user?.email}</p>
              {user?.is_admin && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full bg-[#C9A227] text-[#0A1628]">
                  <Shield className="w-3 h-3" />
                  Administrator
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F8F9FA] rounded-lg">
              <p className="text-sm text-[#64748B] mb-1">Account Number</p>
              <p className="font-mono font-semibold text-[#0A1628]">{user?.account_number}</p>
            </div>
            <div className="p-4 bg-[#F8F9FA] rounded-lg">
              <p className="text-sm text-[#64748B] mb-1">Currency</p>
              <p className="font-semibold text-[#0A1628]">{user?.currency}</p>
            </div>
            <div className="p-4 bg-[#F8F9FA] rounded-lg">
              <p className="text-sm text-[#64748B] mb-1">Member Since</p>
              <p className="font-semibold text-[#0A1628] flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {user?.created_at ? formatDate(user.created_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h3 className="text-lg font-semibold text-[#0A1628] mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#C9A227]" />
            Personal Information
          </h3>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700" data-testid="profile-success">
              <CheckCircle className="w-5 h-5" />
              Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700" data-testid="profile-error">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                    data-testid="profile-firstname"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                    data-testid="profile-lastname"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1628] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg bg-[#F8F9FA] text-[#64748B] cursor-not-allowed"
                />
              </div>
              <p className="text-sm text-[#64748B] mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1628] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                  placeholder="+1 234 567 8900"
                  data-testid="profile-phone"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
              data-testid="save-profile-btn"
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
