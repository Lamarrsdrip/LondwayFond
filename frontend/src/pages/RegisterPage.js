import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Eye, EyeOff, ArrowRight, AlertCircle, Check } from "lucide-react";
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

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1753351050724-511764d227e3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxwZXJzb24lMjBwYXlpbmclMjB3aXRoJTIwY3JlZGl0JTIwY2FyZCUyMGNvbnRhY3RsZXNzJTIwY29mZmVlJTIwc2hvcHxlbnwwfHx8fDE3NzMzMTE3Nzd8MA&ixlib=rb-4.1.0&q=85"
          alt="Banking"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0A1628]/60" />
        <div className="absolute top-12 left-12">
          <Link to="/">
            <div className="font-display font-bold text-2xl">
              <span className="text-white">Londway</span>
              <span className="text-[#C9A227]">Fond</span>
              <span className="text-[#94A3B8] text-xs ml-1 font-normal tracking-wider uppercase">Bank</span>
            </div>
          </Link>
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-white text-4xl font-display font-bold mb-4">
            Start Your Premium<br />Banking Journey
          </h2>
          <ul className="space-y-3">
            {["$1,000 Welcome Bonus", "No Monthly Fees", "Instant Virtual Cards", "24/7 Global Access"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-[#C9A227] flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#0A1628]" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 lg:hidden">
            <Logo size="default" />
          </div>

          <h1 className="font-display text-4xl font-bold text-[#0A1628] mb-2">
            Open Your Account
          </h1>
          <p className="text-[#64748B] mb-8">
            Join LONDWAYFOND Bank today
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700" data-testid="register-error">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all"
                  placeholder="John"
                  required
                  data-testid="register-firstname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all"
                  placeholder="Doe"
                  required
                  data-testid="register-lastname"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1628] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all"
                placeholder="you@example.com"
                required
                data-testid="register-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1628] mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all"
                placeholder="+1 234 567 8900"
                data-testid="register-phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1628] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all pr-12"
                  placeholder="Create a password"
                  required
                  data-testid="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0A1628]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1628] mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all"
                placeholder="Confirm your password"
                required
                data-testid="register-confirm-password"
              />
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              {passwordRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-[#E2E8F0]'}`}>
                    {req.met && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={req.met ? 'text-green-600' : 'text-[#64748B]'}>{req.text}</span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
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

          <p className="mt-8 text-center text-[#64748B]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#C9A227] font-semibold hover:underline" data-testid="login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
