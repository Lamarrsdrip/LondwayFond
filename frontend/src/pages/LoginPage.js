import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      if (user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-[#0C0F1A] text-xl">L</span>
            </div>
            <div className="font-display font-bold text-2xl">
              <span className="text-[#0C0F1A]">Londway</span>
              <span className="text-[#D4A853]">Fond</span>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-[#0C0F1A] mb-3">
              Welcome back
            </h1>
            <p className="text-neutral-500 text-lg">
              Sign in to access your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-slide-down" data-testid="login-error">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-modern"
                placeholder="you@example.com"
                required
                data-testid="login-email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-modern pr-12"
                  placeholder="Enter your password"
                  required
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-submit"
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-neutral-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#D4A853] font-semibold hover:underline" data-testid="register-link">
              Open Account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0C0F1A] items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A853]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4A853]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A853]/10 border border-[#D4A853]/20 text-[#D4A853] text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Premium Banking Experience
          </div>
          <h2 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Banking that works<br />
            <span className="text-[#D4A853]">for you</span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8">
            Experience seamless financial management with instant transfers, virtual cards, and world-class security.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            {['Instant Transfers', 'Virtual Cards', '24/7 Support', 'Bank-Grade Security'].map((feature, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
