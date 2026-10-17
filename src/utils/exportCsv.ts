import {
  Lead,
  Quotation,
  Deal,
  Order,
  Payment,
  PeriodKpiData,
} from '../types';

function downloadCsv(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportSummaryToCsv(kpis: PeriodKpiData, dateLabel: string) {
  const rows = [
    ['Business Performance & Revenue Analytics - Dashboard Summary'],
    ['Reporting Period', dateLabel],
    ['Generated On', new Date().toISOString()],
    [],
    ['Metric', 'Value'],
    ['New Leads', kpis.newLeads],
    ['Qualified Leads', kpis.qualifiedLeads],
    ['Converted Leads', kpis.convertedLeads],
    ['Unqualified Leads', kpis.unqualifiedLeads],
    ['Conversion Rate (%)', `${kpis.conversionRate}%`],
    ['Quotations Created', kpis.quotationsCreated],
    ['Deals Created', kpis.dealsCreated],
    ['Invoices Generated', kpis.invoicesGenerated],
    ['Total Deal Value (INR)', `INR ${kpis.totalDealValue}`],
    ['Total Invoiced Amount (INR)', `INR ${kpis.totalInvoiced}`],
    ['Net Collected Revenue (INR)', `INR ${kpis.totalCollected}`],
    ['Outstanding Balance (INR)', `INR ${kpis.outstandingRevenue}`],
  ];

  const csv = rows.map((r) => r.map(escapeCsv).join(',')).join('\n');
  downloadCsv(csv, `Dashboard_Summary_${Date.now()}.csv`);
}

export function exportLeadsToCsv(leads: Lead[]) {
  const headers = ['Lead ID', 'Customer Name', 'Company Name', 'Email', 'Phone', 'City', 'Source', 'Status', 'Service Interest', 'Sales Rep', 'Created At'];
  const rows = leads.map((l) => [
    l.id,
    l.name,
    l.companyName,
    l.email,
    l.phone,
    l.city,
    l.source,
    l.status,
    l.serviceInterest,
    l.assignedSalesName,
    l.createdAt,
  ]);

  const csv = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
  downloadCsv(csv, `Leads_Report_${Date.now()}.csv`);
}

export function exportQuotationsToCsv(quotations: Quotation[]) {
  const headers = ['Quotation ID', 'Lead ID', 'Service Category', 'Base Amount (INR)', 'Tax (INR)', 'Final Amount (INR)', 'Status', 'Sales Rep', 'Created Date', 'Expiry Date'];
  const rows = quotations.map((q) => [
    q.id,
    q.leadId,
    q.serviceCategory,
    q.amount,
    q.taxAmount,
    q.finalAmount,
    q.status,
    q.assignedSalesName,
    q.createdAt,
    q.expiryDate,
  ]);

  const csv = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
  downloadCsv(csv, `Quotations_Report_${Date.now()}.csv`);
}

export function exportDealsToCsv(deals: Deal[]) {
  const headers = ['Deal ID', 'Title', 'Lead ID', 'Service Category', 'Deal Value (INR)', 'Stage', 'Priority', 'Sales Rep', 'Created Date', 'Expected Close'];
  const rows = deals.map((d) => [
    d.id,
    d.title,
    d.leadId,
    d.serviceCategory,
    d.amount,
    d.stage,
    d.priority,
    d.assignedSalesName,
    d.createdAt,
    d.expectedCloseDate,
  ]);

  const csv = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
  downloadCsv(csv, `Deals_Report_${Date.now()}.csv`);
}

export function exportOrdersToCsv(orders: Order[]) {
  const headers = ['Order ID', 'Deal ID', 'Lead ID', 'Service Category', 'Order Value (INR)', 'Status', 'Stages Completed', 'Total Stages', 'Ops Rep', 'Created Date'];
  const rows = orders.map((o) => [
    o.id,
    o.dealId,
    o.leadId,
    o.serviceCategory,
    o.orderValue,
    o.status,
    o.stagesCompleted,
    o.stagesTotal,
    o.assignedOpsName,
    o.createdAt,
  ]);

  const csv = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
  downloadCsv(csv, `Orders_Report_${Date.now()}.csv`);
}

export function exportPaymentsToCsv(payments: Payment[]) {
  const headers = ['Payment ID', 'Invoice ID', 'Deal ID', 'Customer Name', 'Amount (INR)', 'Payment Method', 'Status', 'Transaction Reference', 'Payment Date'];
  const rows = payments.map((p) => [
    p.id,
    p.invoiceId,
    p.dealId,
    p.customerName,
    p.amount,
    p.method,
    p.status,
    p.transactionRef,
    p.paymentDate,
  ]);

  const csv = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
  downloadCsv(csv, `Payments_Report_${Date.now()}.csv`);
}
