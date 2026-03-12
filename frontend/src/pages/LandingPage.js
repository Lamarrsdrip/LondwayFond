import { Link } from "react-router-dom";
import { useAuth } from "@/App";
import { 
  Shield, 
  ArrowRight, 
  Send, 
  CreditCard, 
  Globe2, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  Smartphone,
  Lock,
  Zap,
  TrendingUp,
  Users,
  Award,
  CheckCircle
} from "lucide-react";
import { Logo } from "@/components/Logo";

const features = [
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Send money globally in seconds with competitive rates.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "256-bit encryption and multi-factor authentication.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80"
  },
  {
    icon: CreditCard,
    title: "Virtual Cards",
    description: "Create instant virtual cards for online purchases.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
  },
  {
    icon: Globe2,
    title: "Global Access",
    description: "Access your funds from anywhere, 24/7.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80"
  }
];

const stats = [
  { value: "$50B+", label: "Assets Managed", icon: TrendingUp },
  { value: "2M+", label: "Happy Customers", icon: Users },
  { value: "180+", label: "Countries", icon: Globe2 },
  { value: "99.99%", label: "Uptime", icon: Award }
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    text: "LondwayFond transformed how I manage international payments. Fast, secure, and reliable."
  },
  {
    name: "James Chen",
    role: "Investment Analyst",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    text: "The best banking experience I've had. Their virtual cards are a game-changer."
  },
  {
    name: "Emma Thompson",
    role: "Entrepreneur",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    text: "Premium service that actually delivers. My go-to bank for all transactions."
  }
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="default" />
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#0A1628] hover:text-[#C9A227] transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-[#0A1628] hover:text-[#C9A227] transition-colors font-medium">
                About
              </a>
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
      <section className="pt-24 lg:pt-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1628] text-white text-sm rounded-full mb-6">
                <Lock className="w-4 h-4 text-[#C9A227]" />
                Trusted by 2M+ customers worldwide
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A1628] leading-[1.1] mb-6">
                The Future of
                <span className="block text-[#C9A227]">Banking is Here</span>
              </h1>
              
              <p className="text-xl text-[#64748B] leading-relaxed mb-8 max-w-lg">
                Experience seamless global transactions, instant transfers, and premium financial services designed for modern life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/register" 
                  className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
                  data-testid="hero-cta-register"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#features" 
                  className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  Learn More
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <img 
                      key={i}
                      src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=40&h=40&fit=crop&crop=face`}
                      alt="Customer"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=User+${i}&background=C9A227&color=0A1628`;
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#C9A227]">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-[#64748B]">4.9/5 from 10,000+ reviews</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                  alt="Modern Banking"
                  className="rounded-3xl shadow-2xl w-full object-cover"
                />
                
                {/* Floating Card 1 */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Payment Received</p>
                      <p className="font-bold text-[#0A1628]">+$2,500.00</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -right-4 bottom-1/4 bg-[#0A1628] rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#C9A227]/20 rounded-full flex items-center justify-center">
                      <Send className="w-6 h-6 text-[#C9A227]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8]">Instant Transfer</p>
                      <p className="font-bold text-white">Sent in 0.5s</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Decorations */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#C9A227]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#0A1628]/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#C9A227]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#C9A227]/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-[#C9A227]" />
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-[#94A3B8]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#C9A227]/10 text-[#C9A227] text-sm font-semibold rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A1628] mb-4">
              Banking Made Simple
            </h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Everything you need to manage your money, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                data-testid={`feature-card-${index}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <div className="w-12 h-12 bg-[#C9A227] rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-[#0A1628]" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0A1628] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#64748B]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section id="about" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Phone Mockup */}
            <div className="relative order-2 lg:order-1">
              <div className="relative mx-auto w-[300px] md:w-[350px]">
                <img 
                  src="https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=400&q=80"
                  alt="Mobile Banking App"
                  className="rounded-[3rem] shadow-2xl border-8 border-[#0A1628]"
                />
                
                {/* Decorative Elements */}
                <div className="absolute -left-20 top-20 w-40 h-40 bg-[#C9A227]/20 rounded-full blur-3xl" />
                <div className="absolute -right-20 bottom-20 w-40 h-40 bg-[#0A1628]/10 rounded-full blur-3xl" />
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-2 bg-[#0A1628] text-[#C9A227] text-sm font-semibold rounded-full mb-6">
                Mobile Banking
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A1628] mb-6">
                Banking at Your
                <span className="text-[#C9A227]"> Fingertips</span>
              </h2>
              <p className="text-lg text-[#64748B] mb-8">
                Manage your accounts, send money, and track spending from anywhere. Our intuitive app puts the power of premium banking in your pocket.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Instant notifications for all transactions",
                  "Biometric login for maximum security",
                  "Send & receive money in 180+ countries",
                  "Virtual cards for safe online shopping"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A227] flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-[#0A1628]" />
                    </div>
                    <span className="text-[#0A1628]">{item}</span>
                  </div>
                ))}
              </div>

              <Link 
                to="/register" 
                className="btn-primary inline-flex items-center gap-2 text-lg"
              >
                Start Banking Today <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#C9A227]/10 text-[#C9A227] text-sm font-semibold rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              See what our customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#1E3A5F]/50 backdrop-blur rounded-2xl p-8 border border-[#1E3A5F]"
              >
                <div className="flex items-center gap-1 text-[#C9A227] mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-white mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-[#94A3B8]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0A1628]/90" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform<br />
            <span className="text-[#C9A227]">Your Banking?</span>
          </h2>
          <p className="text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto">
            Join over 2 million customers who trust LondwayFond for their financial needs. Open your free account in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="btn-primary text-lg px-10 py-4 inline-flex items-center justify-center gap-2"
              data-testid="cta-register"
            >
              Open Free Account <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/contact" 
              className="bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 text-lg px-10 py-4 rounded inline-flex items-center justify-center gap-2 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020617] py-16 px-6">
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

          <div className="border-t border-[#1E3A5F] pt-8">
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
        </div>
      </footer>
    </div>
  );
}
