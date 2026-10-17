import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  BarChart3,
  Users,
  FileText,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  PieChart,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Menu,
  X,
  Target,
} from 'lucide-react';
import { ThreeDAnalyticsScene } from '../components/landing/ThreeDAnalyticsScene';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#071426] text-white selection:bg-blue-500 selection:text-white antialiased overflow-x-hidden">
      {/* 1. Header Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#071426]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] shadow-lg shadow-blue-500/25">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Revenue<span className="text-[#22D3EE]">Analytics</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-medium text-white hover:text-[#22D3EE] transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-[#1D4ED8] transition-all"
            >
              Sign Up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-[#0B1730] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-white py-1"
              >
                Home
              </Link>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 py-1"
              >
                Features
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 py-1"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 py-1"
              >
                Contact
              </Link>
              <div className="my-2 border-t border-white/10" />
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 py-1"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Ambient Radial Lights */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-10 top-1/3 h-[400px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-6 z-10 text-center lg:text-left">
              {/* Trust Label */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 shadow-inner">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                BUSINESS INTELLIGENCE, REIMAGINED
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Turn Business Data Into{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  Smarter Decisions.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="mt-6 text-base text-slate-300 sm:text-lg lg:text-lg leading-relaxed">
                An intelligent business analytics platform to track leads, analyze quotations, monitor deals, and understand revenue performance from one unified workspace.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  to="/signup"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-600 hover:to-blue-700 transition-all sm:w-auto"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/features"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all sm:w-auto"
                >
                  <span>Explore Features</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>No backend setup required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Interactive 3D analytics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Indian Rupee (INR) formatting</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Animated Analytics Scene */}
            <div className="lg:col-span-6 z-10">
              <div className="relative mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-2 shadow-2xl backdrop-blur-xl">
                <ThreeDAnalyticsScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section A: Product Value Overview */}
      <section className="relative border-t border-white/10 bg-[#0B1730] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
              Unified Visibility
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Everything Your Organization Needs to Drive Revenue Growth
            </p>
            <p className="mt-4 text-sm text-slate-300">
              Break down operational silos and reconcile your entire customer journey from initial lead capture to recognized cash collections.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xs">
              <div className="text-3xl font-black text-white">100%</div>
              <div className="mt-1 text-xs font-medium text-slate-400">Attributable Pipeline</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xs">
              <div className="text-3xl font-black text-[#22D3EE]">25.3%</div>
              <div className="mt-1 text-xs font-medium text-slate-400">Average Win Rate</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xs">
              <div className="text-3xl font-black text-emerald-400">0%</div>
              <div className="mt-1 text-xs font-medium text-slate-400">Double Counting</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xs">
              <div className="text-3xl font-black text-amber-400">INR ₹</div>
              <div className="mt-1 text-xs font-medium text-slate-400">Built-in Financials</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section B: 6 Feature Cards */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Engineered for Executives, Sales, and Operations
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/50 hover:bg-white/[0.08] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">1. Lead Analytics</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Monitor inbound lead sources (Google Ads, Website, Referrals), track qualified ratios, and isolate unqualified drop-offs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-cyan-500/50 hover:bg-white/[0.08] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">2. Quotation Intelligence</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Categorize quotes by service lines (Private Limited, LLP, Trademarks), observe quote value distribution, and measure quote-to-deal win rates.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-indigo-500/50 hover:bg-white/[0.08] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">3. Deal & Revenue Tracking</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Track recognized deal value, analyze deals by priority (High, Medium, Low), and distinguish total pipeline from collected funds.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-amber-500/50 hover:bg-white/[0.08] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">4. Order Fulfillment</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Visualize multi-stage order progress (Pending, In Progress, Completed, On Hold) and track operational deadlines without bottlenecks.
              </p>
            </div>

            {/* Card 5 */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-emerald-500/50 hover:bg-white/[0.08] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">5. Payment Monitoring</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Reconcile payment transactions with invoices, observe daily collections, and calculate outstanding balances automatically.
              </p>
            </div>

            {/* Card 6 */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">6. Team Performance</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Attribute leads, quotations, and revenue to individual team members including Aazam Afroz, Nancy Singh, and Sneha Choudhary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section C: Product Preview Section (Dashboard Mockup) */}
      <section className="border-t border-white/10 bg-[#0B1730] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
              Product Experience
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white">
              Designed for Clarity and Rapid Action
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="mt-12 rounded-3xl border border-white/15 bg-white/5 p-3 shadow-2xl backdrop-blur-md">
            <div className="rounded-2xl bg-[#F4F7FB] p-6 text-[#0F172A] shadow-inner">
              {/* Header inside mockup */}
              <div className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="text-lg font-bold text-[#0F172A]">Business Performance & Revenue Analytics</div>
                  <div className="text-xs text-[#64748B]">Real-time operational intelligence dashboard</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1 text-xs font-semibold text-[#0F172A]">
                    Oct 1 - Oct 31, 2026
                  </span>
                  <Link
                    to="/app/dashboard"
                    className="rounded-md bg-[#2563EB] px-3 py-1 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Open Live App →
                  </Link>
                </div>
              </div>

              {/* Sample Mini KPIs in Mockup */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-xs">
                  <div className="text-[10px] font-semibold text-[#64748B]">New Leads</div>
                  <div className="text-xl font-bold text-[#0F172A]">91</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+57.2% vs previous</div>
                </div>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-xs">
                  <div className="text-[10px] font-semibold text-[#64748B]">Quotations</div>
                  <div className="text-xl font-bold text-[#0F172A]">107</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+127.7% vs previous</div>
                </div>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-xs">
                  <div className="text-[10px] font-semibold text-[#64748B]">Recognized Value</div>
                  <div className="text-xl font-bold text-[#1E3A8A]">₹1,82,627</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+61.7% vs previous</div>
                </div>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-xs">
                  <div className="text-[10px] font-semibold text-[#64748B]">Net Collected</div>
                  <div className="text-xl font-bold text-[#065F46]">₹1,20,698</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Reconciled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section D: How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Workflow
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white">
              Three Simple Steps to Complete Visibility
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white">
                1
              </span>
              <h3 className="mt-4 text-base font-bold text-white">Review Business Data</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Explore connected leads, quotations, deals, and fulfillment stages filtered by period, user, and department.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-base font-bold text-white">
                2
              </span>
              <h3 className="mt-4 text-base font-bold text-white">Analyze Performance</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Drill down into lead conversion funnels, employee attribution benchmarks, and quote-to-deal conversion rates.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-base font-bold text-white">
                3
              </span>
              <h3 className="mt-4 text-base font-bold text-white">Make Informed Decisions</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Identify delayed fulfillment orders, uncollected balances, and top-performing sales reps with verifiable data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section F: Final Call to Action */}
      <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0B1730] to-[#071426] py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your Business Performance,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Clearly Explained.
            </span>
          </h2>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            Start tracking leads, quotations, deals, orders, and revenue with enterprise-grade consistency today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-xl bg-[#2563EB] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-[#1D4ED8] transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/app/dashboard"
              className="rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
            >
              Launch Live App
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Section G: Footer */}
      <footer className="border-t border-white/10 bg-[#071426] py-12 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white">
                <BarChart3 className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-white">RevenueAnalytics</span>
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-slate-300">
              <Link to="/features" className="hover:text-white transition-colors">Features</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/app/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500">Privacy Policy</span>
              <span className="text-slate-500">Terms of Use</span>
            </div>
          </div>
          <div className="mt-8 text-center sm:text-left text-slate-500 text-[11px]">
            © {new Date().getFullYear()} RevenueAnalytics Platform. Enterprise Business Intelligence & CRM Analytics.
          </div>
        </div>
      </footer>
    </div>
  );
};
