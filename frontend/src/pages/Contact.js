import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ArrowRight, Building2 } from "lucide-react";
import { Logo } from "@/components/Logo";

const offices = [
  {
    name: "London Office",
    address: "8 Canada Square, London, E14 5HQ, United Kingdom",
    phone: "+44 20 7000 0000",
    email: "london@londwayfond.com",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM GMT",
    image: "https://images.unsplash.com/photo-1765375411306-9b19cb5797a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBjYW5hcnklMjB3aGFyZiUyMHNreWxpbmUlMjBsdXh1cnklMjBza3lzY3JhcGVyfGVufDB8fHx8MTc3MzMxMTc3NHww&ixlib=rb-4.1.0&q=85"
  },
  {
    name: "New York Headquarters",
    address: "388 Greenwich Street, New York, NY 10013, United States",
    phone: "+1 212 000 0000",
    email: "newyork@londwayfond.com",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM EST",
    image: "https://images.unsplash.com/photo-1711069260590-9f3dec0b9f23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmUlMjBzdW5zZXR8ZW58MHx8fHwxNzczMzExNzg3fDA&ixlib=rb-4.1.0&q=85"
  }
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="default" />
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[#0A1628] hover:text-[#C9A227] transition-colors font-medium" data-testid="nav-login">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary flex items-center gap-2" data-testid="nav-register">
                Open Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#0A1628] mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
            Our team is here to help. Reach out to us at any of our global offices.
          </p>
        </div>
      </section>

      {/* Offices */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#C9A227] transition-colors group"
                data-testid={`office-${index}`}
              >
                <div className="relative h-64">
                  <img 
                    src={office.image} 
                    alt={office.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-2 text-[#C9A227] mb-2">
                      <Building2 className="w-5 h-5" />
                      <span className="font-semibold">{office.name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A227] mt-0.5 flex-shrink-0" />
                    <p className="text-[#0A1628]">{office.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <a href={`tel:${office.phone}`} className="text-[#0A1628] hover:text-[#C9A227] transition-colors">
                      {office.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <a href={`mailto:${office.email}`} className="text-[#0A1628] hover:text-[#C9A227] transition-colors">
                      {office.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <p className="text-[#64748B]">{office.hours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 bg-[#0A1628]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Send Us a Message
            </h2>
            <p className="text-[#94A3B8]">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <form className="space-y-6" data-testid="contact-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                  placeholder="John"
                  data-testid="contact-firstname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                  placeholder="Doe"
                  data-testid="contact-lastname"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                placeholder="you@example.com"
                data-testid="contact-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Subject</label>
              <select 
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                data-testid="contact-subject"
              >
                <option value="" className="text-[#0A1628]">Select a subject</option>
                <option value="general" className="text-[#0A1628]">General Inquiry</option>
                <option value="account" className="text-[#0A1628]">Account Support</option>
                <option value="technical" className="text-[#0A1628]">Technical Issue</option>
                <option value="business" className="text-[#0A1628]">Business Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] resize-none"
                placeholder="How can we help you?"
                data-testid="contact-message"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 text-lg"
              data-testid="contact-submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020617] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-display font-bold text-xl">
              <span className="text-white">Londway</span>
              <span className="text-[#C9A227]">Fond</span>
              <span className="text-[#94A3B8] text-xs ml-1 font-normal tracking-wider uppercase">Bank</span>
            </div>
            <p className="text-[#64748B] text-sm">
              © 2026 LondwayFond Bank. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-[#64748B] hover:text-[#C9A227] transition-colors text-sm">
                Home
              </Link>
              <Link to="/login" className="text-[#64748B] hover:text-[#C9A227] transition-colors text-sm">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
