import React from 'react';
import { useApp } from '../../context/AppContext';
import { KpiCardsRow } from '../../components/KpiCardsRow';
import { LeadAnalyticsSection } from '../../components/LeadAnalyticsSection';
import { QuotationAnalyticsSection } from '../../components/QuotationAnalyticsSection';
import { DealsRevenueSection } from '../../components/DealsRevenueSection';
import { OperationsAndActivitySection } from '../../components/OperationsAndActivitySection';
import { useNavigate } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    comparison,
    currentFiltered,
    monthlyTarget,
    leadSources,
    dailyLeadTrend,
    quotationCategories,
    dealsVsRevenue,
    revenueCategories,
    priorityBreakdown,
    dailyRevenueTrend,
    salesTeamActivity,
    opsTeamActivity,
    orderProgress,
    updateFilter,
    setSelectedLeadId,
    setSelectedQuotationId,
    setSelectedDealId,
    setSelectedOrderId,
    setSelectedPaymentId,
  } = useApp();

  const handleCardClick = (metric: string) => {
    if (metric === 'newLeads' || metric === 'qualifiedLeads' || metric === 'convertedLeads' || metric === 'unqualifiedLeads' || metric === 'conversionRate') {
      navigate('/app/leads');
    } else if (metric === 'quotationsCreated') {
      navigate('/app/quotations');
    } else if (metric === 'dealsCreated') {
      navigate('/app/deals');
    } else if (metric === 'invoicesGenerated') {
      navigate('/app/orders');
    }
  };

  const handleLeadFunnelDrilldown = (type: string, meta?: string) => {
    navigate('/app/leads');
  };

  const handleSelectServiceQuotations = (service: string) => {
    navigate('/app/quotations');
  };

  const handleDealsDrillDown = (type: string, meta?: string) => {
    navigate('/app/deals');
  };

  const handleSelectOrderService = (service: string) => {
    navigate('/app/orders');
  };

  const handleSelectRecord = (type: string, id: string) => {
    const cleanId = id.replace('#', '').trim();
    if (type === 'Lead') setSelectedLeadId(cleanId);
    else if (type === 'Quotation') setSelectedQuotationId(cleanId);
    else if (type === 'Deal') setSelectedDealId(cleanId);
    else if (type === 'Order') setSelectedOrderId(cleanId);
    else if (type === 'Payment') setSelectedPaymentId(cleanId);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          Executive Business Overview
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Monitor company-wide pipeline velocity, quotation volumes, realized revenue, and fulfillment stages in real time.
        </p>
      </div>

      {/* Top 8 KPI Cards */}
      <KpiCardsRow
        comparison={comparison}
        onCardClick={handleCardClick}
      />

      {/* Row 1: Lead Analytics & Targets */}
      <LeadAnalyticsSection
        currentKpi={comparison.current}
        leadSources={leadSources}
        dailyLeadTrend={dailyLeadTrend}
        monthlyTarget={monthlyTarget}
        onDrillDown={handleLeadFunnelDrilldown}
      />

      {/* Row 2: Quotation Analytics */}
      <QuotationAnalyticsSection
        categoryStats={quotationCategories}
        totalQuotations={comparison.current.quotationsCreated}
        totalDeals={comparison.current.dealsCreated}
        onSelectService={handleSelectServiceQuotations}
        onOpenQuotationList={() => navigate('/app/quotations')}
      />

      {/* Row 3: Deals & Revenue */}
      <DealsRevenueSection
        currentKpi={comparison.current}
        dealsVsRevenue={dealsVsRevenue}
        revenueCategories={revenueCategories}
        priorityBreakdown={priorityBreakdown}
        dailyRevenueTrend={dailyRevenueTrend}
        onDrillDown={handleDealsDrillDown}
      />

      {/* Row 4: Operations & Sales Team Activity */}
      <OperationsAndActivitySection
        salesActivity={salesTeamActivity}
        opsActivity={opsTeamActivity}
        orderProgress={orderProgress}
        recentActivities={currentFiltered.filteredActivities}
        onSelectUser={(userId) => updateFilter({ userId })}
        onSelectRecord={handleSelectRecord}
        onSelectOrderService={handleSelectOrderService}
      />
    </div>
  );
};
