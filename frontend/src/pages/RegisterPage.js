import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Eye, EyeOff, ArrowRight, AlertCircle, Check, Gift, Shield, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains a number", met: /\d/.test(formData.password) },
    { text: "Passwords match", met: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || null
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Gift, title: "$1,000 Welcome Bonus", desc: "Start with funds to explore" },
    { icon: Zap, title: "Instant Transfers", desc: "Send money in seconds" },
    { icon: Shield, title: "Bank-Grade Security", desc: "Your data is protected" }
  ];

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-[#0C0F1A] flex-col p-12">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4A853]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4A853]/10 rounded-full blur-[120px]" />
        
        <Link to="/" className="relative z-10 flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center">
            <span className="font-display font-bold text-[#0C0F1A] text-lg">L</span>
          </div>
          <div className="font-display font-bold text-xl">
            <span className="text-white">Londway</span>
            <span className="text-[#D4A853]">Fond</span>
          </div>
        </Link>

        <div className="relative z-10 my-auto">
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-8">
            Start your<br />
            <span className="text-[#D4A853]">financial journey</span>
          </h2>
          
          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-[#D4A853]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-neutral-400 text-sm">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-neutral-500 text-sm mt-auto">
          © 2026 LondwayFond Bank. All rights reserved.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center">
              <span className="font-display font-bold text-[#0C0F1A] text-lg">L</span>
            </div>
            <div className="font-display font-bold text-xl">
              <span className="text-[#0C0F1A]">Londway</span>
              <span className="text-[#D4A853]">Fond</span>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-[#0C0F1A] mb-3">
              Create Account
            </h1>
            <p className="text-neutral-500 text-lg">
              Open your free account in minutes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-slide-down" data-testid="register-error">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="input-modern"
                  placeholder="John"
                  required
                  data-testid="register-firstname"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="input-modern"
                  placeholder="Doe"
                  required
                  data-testid="register-lastname"
                />
              </div>
            </div>

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
                data-testid="register-email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                Phone <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-modern"
                placeholder="+1 234 567 8900"
                data-testid="register-phone"
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
                  placeholder="Create a password"
                  required
                  data-testid="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0C0F1A] mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-modern"
                placeholder="Confirm your password"
                required
                data-testid="register-confirm-password"
              />
            </div>

            {/* Password Requirements */}
            <div className="flex flex-wrap gap-3">
              {passwordRequirements.map((req, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                    req.met 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    req.met ? 'bg-emerald-500' : 'bg-neutral-300'
                  }`}>
                    {req.met && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{req.text}</span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="register-submit"
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D4A853] font-semibold hover:underline" data-testid="login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
