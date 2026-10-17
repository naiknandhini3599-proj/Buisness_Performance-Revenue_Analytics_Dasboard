import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Dashboard Application Layout & Pages
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { LeadsPage } from './pages/dashboard/LeadsPage';
import { QuotationsPage } from './pages/dashboard/QuotationsPage';
import { DealsPage } from './pages/dashboard/DealsPage';
import { OrdersPage } from './pages/dashboard/OrdersPage';
import { SalesActivityPage } from './pages/dashboard/SalesActivityPage';
import { OperationsPage } from './pages/dashboard/OperationsPage';
import { RecentActivityPage } from './pages/dashboard/RecentActivityPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<OverviewPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="sales-activity" element={<SalesActivityPage />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="activity" element={<RecentActivityPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
