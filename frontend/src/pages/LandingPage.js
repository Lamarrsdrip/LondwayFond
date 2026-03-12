import { Link } from "react-router-dom";
import { useAuth } from "@/App";
import { Shield, ArrowRight, Send, CreditCard, Building2, Globe2, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";

const features = [
  {
    icon: Send,
    title: "Instant Transfers",
    description: "Send money globally in seconds with competitive exchange rates and minimal fees."
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your assets are protected with military-grade encryption and multi-factor authentication."
  },
  {
    icon: CreditCard,
    title: "Virtual Cards",
    description: "Create instant virtual cards for online purchases with spending controls."
  },
  {
    icon: Globe2,
    title: "Global Access",
    description: "Access your funds from anywhere in the world, 24/7 with no restrictions."
  }
];

const stats = [
  { value: "$50B+", label: "Assets Under Management" },
  { value: "2M+", label: "Active Customers" },
  { value: "180+", label: "Countries Served" },
  { value: "99.99%", label: "Uptime Guarantee" }
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="default" />
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/contact" className="text-[#0A1628] hover:text-[#C9A227] transition-colors font-medium" data-testid="nav-contact">
                Contact
              </Link>
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="btn-primary flex items-center gap-2"
                  data-testid="nav-dashboard"
                >
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-[#0A1628] hover:text-[#C9A227] transition-colors font-medium" data-testid="nav-login">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary flex items-center gap-2" data-testid="nav-register">
                    Open Account <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-3">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-sm px-4 py-2" data-testid="mobile-dashboard">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-primary text-sm px-4 py-2" data-testid="mobile-login">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 hero-pattern relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 bg-[#C9A227]/10 text-[#C9A227] text-sm font-medium rounded-full mb-6">
                Premium Banking Experience
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-[#0A1628] leading-tight mb-6">
                Banking <br />
                <span className="text-gold-gradient">Reimagined</span>
              </h1>
              <p className="text-lg md:text-xl text-[#64748B] leading-relaxed mb-8 max-w-xl">
                Experience the future of banking with LONDWAYFOND. Seamless transactions, 
                unmatched security, and premium service tailored to your success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="btn-primary flex items-center justify-center gap-2 text-lg"
                  data-testid="hero-cta-register"
                >
                  Open Your Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/contact" 
                  className="btn-secondary flex items-center justify-center gap-2 text-lg"
                  data-testid="hero-cta-contact"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in-up stagger-2 hidden lg:block">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1771747131849-41056d3d9be3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxnb2xkJTIwYWJzdHJhY3QlMjAzZCUyMHRleHR1cmUlMjBnZW9tZXRyaWMlMjBzaGFwZXxlbnwwfHx8fDE3NzMzMTE3NzZ8MA&ixlib=rb-4.1.0&q=85"
                  alt="Abstract Gold Design"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-[#C9A227]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#0A1628]/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-display font-bold text-[#C9A227] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#94A3B8] text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-[#0A1628] mb-4">
              Why Choose LONDWAYFOND
            </h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              We combine traditional banking excellence with modern technology to deliver 
              an unparalleled financial experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card animate-fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`feature-card-${index}`}
              >
                <div className="w-14 h-14 bg-[#C9A227]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#C9A227] transition-colors">
                  <feature.icon className="w-7 h-7 text-[#C9A227] group-hover:text-[#0A1628] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-[#0A1628] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-24 px-6 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
              Global Presence
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              With offices in key financial centers, we're always close to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* London Office */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1765375411306-9b19cb5797a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBjYW5hcnklMjB3aGFyZiUyMHNreWxpbmUlMjBsdXh1cnklMjBza3lzY3JhcGVyfGVufDB8fHx8MTc3MzMxMTc3NHww&ixlib=rb-4.1.0&q=85"
                alt="London Office"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 text-[#C9A227] mb-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold">London Office</span>
                </div>
                <p className="text-white text-lg">
                  8 Canada Square, London, E14 5HQ<br />
                  United Kingdom
                </p>
              </div>
            </div>

            {/* New York Office */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1711069260590-9f3dec0b9f23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmUlMjBzdW5zZXR8ZW58MHx8fHwxNzczMzExNzg3fDA&ixlib=rb-4.1.0&q=85"
                alt="New York Office"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 text-[#C9A227] mb-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold">New York HQ</span>
                </div>
                <p className="text-white text-lg">
                  388 Greenwich Street, New York, NY 10013<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-[#0A1628] mb-6">
            Ready to Experience<br />
            <span className="text-gold-gradient">Premium Banking?</span>
          </h2>
          <p className="text-[#64748B] text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have elevated their financial journey with LONDWAYFOND Bank.
          </p>
          <Link 
            to="/register" 
            className="btn-primary inline-flex items-center gap-2 text-lg"
            data-testid="cta-register"
          >
            Open Your Account Today <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1628] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-display font-bold text-2xl mb-6">
                <span className="text-white">Londway</span>
                <span className="text-[#C9A227]">Fond</span>
                <span className="text-[#94A3B8] text-xs ml-1 font-normal tracking-wider uppercase">Bank</span>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Premium banking solutions for individuals and businesses worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-[#94A3B8] hover:text-[#C9A227] transition-colors text-sm">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-[#94A3B8] hover:text-[#C9A227] transition-colors text-sm">
                    Open Account
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-[#94A3B8] hover:text-[#C9A227] transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">London Office</h4>
              <div className="space-y-2 text-[#94A3B8] text-sm">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#C9A227]" />
                  8 Canada Square, London, E14 5HQ, UK
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-[#C9A227] italic">VIP only</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">New York HQ</h4>
              <div className="space-y-2 text-[#94A3B8] text-sm">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#C9A227]" />
                  388 Greenwich Street, New York, NY 10013, USA
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-[#C9A227] italic">VIP only</span>
                </p>
              </div>
            </div>
          </div>

          <div className="gold-line mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#64748B] text-sm">
              © 2026 LondwayFond Bank. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#64748B] hover:text-[#C9A227] transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-[#64748B] hover:text-[#C9A227] transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
