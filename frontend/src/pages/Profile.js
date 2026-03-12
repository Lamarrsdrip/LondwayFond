import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { User, Mail, Phone, Save, CheckCircle, AlertCircle, Shield, Calendar, Edit3, Camera } from "lucide-react";

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
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="profile-page">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0C0F1A] mb-2">Profile</h1>
          <p className="text-neutral-500">Manage your account settings and personal information</p>
        </div>

        {/* Profile Card */}
        <div className="card p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 pb-8 border-b border-neutral-100">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#0C0F1A] to-[#1A2235] flex items-center justify-center text-3xl font-bold text-[#D4A853]">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#D4A853] flex items-center justify-center text-[#0C0F1A] hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-[#0C0F1A]">
                  {user?.first_name} {user?.last_name}
                </h2>
                {user?.is_admin && (
                  <span className="badge badge-warning flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-neutral-500">{user?.email}</p>
            </div>
          </div>

          {/* Account Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-neutral-50 rounded-2xl">
              <p className="text-sm text-neutral-500 mb-1">Account Number</p>
              <p className="font-mono font-bold text-[#0C0F1A]">{user?.account_number}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl">
              <p className="text-sm text-neutral-500 mb-1">Currency</p>
              <p className="font-bold text-[#0C0F1A]">{user?.currency}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl">
              <p className="text-sm text-neutral-500 mb-1">Member Since</p>
              <p className="font-bold text-[#0C0F1A] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4A853]" />
                {user?.created_at ? formatDate(user.created_at) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Edit3 className="w-5 h-5 text-[#D4A853]" />
              <h3 className="text-lg font-bold text-[#0C0F1A]">Edit Information</h3>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 animate-slide-down" data-testid="profile-success">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">Profile updated successfully!</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-slide-down" data-testid="profile-error">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="input-modern pl-12"
                      data-testid="profile-firstname"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="input-modern pl-12"
                      data-testid="profile-lastname"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="input-modern pl-12 bg-neutral-100 cursor-not-allowed text-neutral-500"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Email address cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-modern pl-12"
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
      </div>
    </DashboardLayout>
  );
}
