import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#071426] text-white selection:bg-blue-500 selection:text-white antialiased">
      {/* Header */}
      <nav className="border-b border-white/10 bg-[#071426]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE]">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Revenue<span className="text-[#22D3EE]">Analytics</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white">Home</Link>
            <Link to="/features" className="text-sm font-medium text-slate-300 hover:text-white">Features</Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white">About</Link>
            <Link to="/contact" className="text-sm font-medium text-white border-b-2 border-blue-500 pb-0.5">Contact</Link>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Login</Link>
            <Link to="/app/dashboard" className="rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="rounded-full border border-blue-500/30 bg-blue-950/60 px-3 py-1 text-xs font-semibold text-cyan-300">
            GET IN TOUCH
          </span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Contact Our Enterprise Analytics Team
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Have questions regarding deployment, CRM integration, or demo access? Reach out to us.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Info Card */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#0B1730] p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Contact Information</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Connect directly with our solutions architects and consultants.
              </p>

              <div className="mt-8 space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-slate-400">Email Address</span>
                    <div className="font-semibold text-white">support@revenueanalytics.internal</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600/20 text-cyan-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-slate-400">Phone Support</span>
                    <div className="font-semibold text-white">+91 (080) 4123-8900</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-slate-400">Headquarters</span>
                    <div className="font-semibold text-white">Bengaluru Tech Park, Karnataka, India</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-white/5 p-4 border border-white/10 text-xs text-slate-400">
              Demo Environment: All responses are client-side simulated without exposing private email credentials.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0B1730] p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out, {formData.name}. Our enterprise team will respond to {formData.email} shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-rose-500/20 border border-rose-500/30 p-2.5 text-xs text-rose-300">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Analytics deployment or integration inquiry"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your requirements..."
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} RevenueAnalytics Platform. All rights reserved.
      </footer>
    </div>
  );
};
