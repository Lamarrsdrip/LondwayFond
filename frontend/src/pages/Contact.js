import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ArrowRight, Building2, Send, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

const offices = [
  {
    name: "London Office",
    address: "8 Canada Square, London, E14 5HQ, United Kingdom",
    email: "london@londwayfond.com",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM GMT",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80"
  },
  {
    name: "New York Headquarters",
    address: "388 Greenwich Street, New York, NY 10013, United States",
    email: "newyork@londwayfond.com",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM EST",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80"
  }
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="default" />
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[#0C0F1A] hover:text-[#D4A853] transition-colors font-medium" data-testid="nav-login">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A853]/10 text-[#D4A853] text-sm font-semibold rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#0C0F1A] mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
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
                className="card overflow-hidden group"
                data-testid={`office-${index}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={office.image} 
                    alt={office.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F1A] via-[#0C0F1A]/50 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-2 text-[#D4A853] mb-1">
                      <Building2 className="w-5 h-5" />
                      <span className="font-semibold">{office.name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#D4A853]" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Address</p>
                      <p className="text-[#0C0F1A] font-medium">{office.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#D4A853]" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Phone</p>
                      <p className="text-[#D4A853] font-semibold italic">VIP only</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#D4A853]" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Email</p>
                      <a href={`mailto:${office.email}`} className="text-[#0C0F1A] font-medium hover:text-[#D4A853] transition-colors">
                        {office.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#D4A853]" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Hours</p>
                      <p className="text-[#0C0F1A]">{office.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6 bg-[#0C0F1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A853]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4A853]/5 rounded-full blur-[120px]" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Send Us a Message
            </h2>
            <p className="text-neutral-400 text-lg">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <form className="space-y-6" data-testid="contact-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-[#D4A853] focus:bg-white/10 transition-all outline-none"
                  placeholder="John"
                  data-testid="contact-firstname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-[#D4A853] focus:bg-white/10 transition-all outline-none"
                  placeholder="Doe"
                  data-testid="contact-lastname"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-[#D4A853] focus:bg-white/10 transition-all outline-none"
                placeholder="you@example.com"
                data-testid="contact-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Subject</label>
              <select 
                className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-[#D4A853] focus:bg-white/10 transition-all outline-none"
                data-testid="contact-subject"
              >
                <option value="" className="bg-[#0C0F1A]">Select a subject</option>
                <option value="general" className="bg-[#0C0F1A]">General Inquiry</option>
                <option value="account" className="bg-[#0C0F1A]">Account Support</option>
                <option value="technical" className="bg-[#0C0F1A]">Technical Issue</option>
                <option value="business" className="bg-[#0C0F1A]">Business Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-[#D4A853] focus:bg-white/10 transition-all outline-none resize-none"
                placeholder="How can we help you?"
                data-testid="contact-message"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              data-testid="contact-submit"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050709] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-display font-bold text-xl">
              <span className="text-white">Londway</span>
              <span className="text-[#D4A853]">Fond</span>
              <span className="text-neutral-600 text-xs ml-1 font-normal tracking-wider uppercase">Bank</span>
            </div>
            <p className="text-neutral-500 text-sm">
              © 2026 LondwayFond Bank. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-neutral-500 hover:text-[#D4A853] transition-colors text-sm">
                Home
              </Link>
              <Link to="/login" className="text-neutral-500 hover:text-[#D4A853] transition-colors text-sm">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
