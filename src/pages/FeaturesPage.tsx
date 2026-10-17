import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  FileText,
  Briefcase,
  Layers,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
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
            <Link to="/features" className="text-sm font-medium text-white border-b-2 border-blue-500 pb-0.5">Features</Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white">About</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white">Contact</Link>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Login</Link>
            <Link to="/signup" className="rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="py-16 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-3 py-1 text-xs font-semibold text-cyan-300">
          ENTERPRISE PLATFORM CAPABILITIES
        </div>
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
          Everything You Need to Run High-Growth Operations
        </h1>
        <p className="mt-4 text-slate-300 text-sm sm:text-base">
          From the first lead touchpoint to multi-stage fulfillment and collected bank receipts.
        </p>
      </header>

      {/* Feature Deep Dive Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 space-y-16">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 rounded-3xl border border-white/10 bg-[#0B1730] p-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-2xl font-bold">1. Lead Analytics & Conversion Funnel</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Understand where customer acquisition happens. Track incoming inquiries across Google Ads, Website, and Referrals. Inspect your qualified-to-unqualified cohort breakdown with dynamic conversion rate metrics.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Source attribution by campaign & channel</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Interactive geometric conversion funnel</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Daily lead creation velocity and historical comparisons</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Live Funnel Data</div>
            <div className="space-y-3">
              <div className="rounded-lg bg-blue-600 p-3 text-white flex justify-between text-xs font-bold">
                <span>New Inbound Leads</span><span>91 (100%)</span>
              </div>
              <div className="rounded-lg bg-emerald-600 p-3 text-white flex justify-between text-xs font-bold ml-6">
                <span>Qualified Leads</span><span>42 (46.2%)</span>
              </div>
              <div className="rounded-lg bg-amber-600 p-3 text-white flex justify-between text-xs font-bold ml-12">
                <span>Converted Won</span><span>16 (25.3%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 rounded-3xl border border-white/10 bg-[#0B1730] p-8">
          <div className="order-2 lg:order-1 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Quotation Intelligence</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-slate-300">Private Limited Company</span>
                <span className="font-bold text-white">56 Quotes (₹6,54,326)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-slate-300">LLP Registration</span>
                <span className="font-bold text-white">16 Quotes (₹1,35,272)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-300">Trademark Registration</span>
                <span className="font-bold text-white">8 Quotes (₹22,496)</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-2xl font-bold">2. Quotation Intelligence & Conversion</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Track proposals generated, base fees, 18% GST tax breakdowns, and quotation validity windows. Calculate genuine Quote-to-Deal Conversion rates with mathematical accuracy.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Service-wise quotation volume & values</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Circular conversion rate progress gauge</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> One-click drill-down to parent leads & won deals</li>
            </ul>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 rounded-3xl border border-white/10 bg-[#0B1730] p-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-2xl font-bold">3. Reconciled Financials & Payments</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Prevent duplicate counting and false positives. Strictly separate Total Deal Value, Invoiced Amounts, Net Collected Revenue, and Outstanding Balances.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Realized payment reconciliation via UPI, Net Banking, NEFT</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Automatic calculation of remaining invoice balances</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> CSV download of reconciled ledgers</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Financial Reconciliation</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-blue-950/60 p-3 border border-blue-500/20">
                <span className="text-slate-400">Total Deal Value</span>
                <div className="text-lg font-bold text-white mt-1">₹1,82,627</div>
              </div>
              <div className="rounded-xl bg-emerald-950/60 p-3 border border-emerald-500/20">
                <span className="text-slate-400">Net Collected</span>
                <div className="text-lg font-bold text-emerald-400 mt-1">₹1,20,698</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} RevenueAnalytics Platform. All rights reserved.
      </footer>
    </div>
  );
};
