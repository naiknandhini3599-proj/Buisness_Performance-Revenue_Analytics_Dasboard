export type LeadStatus = 'New' | 'Qualified' | 'Converted' | 'Unqualified';
export type LeadSource = 'Google Ads' | 'Website' | 'Other' | 'Just Dial' | 'Referral' | 'Social Media';

export interface Lead {
  id: string; // e.g., 'L-209610'
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  source: LeadSource;
  status: LeadStatus;
  serviceInterest: string;
  assignedSalesId: string;
  assignedSalesName: string;
  createdAt: string; // ISO date
  qualifiedAt?: string;
  convertedAt?: string;
  unqualifiedAt?: string;
  notes?: string;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Pending' | 'Rejected' | 'Expired';

export interface Quotation {
  id: string; // e.g., 'Q-10467'
  leadId: string;
  dealId?: string;
  serviceCategory: string;
  amount: number;
  status: QuotationStatus;
  createdAt: string;
  expiryDate: string;
  taxAmount: number;
  discount: number;
  finalAmount: number;
  assignedSalesId: string;
  assignedSalesName: string;
  notes?: string;
}

export type DealStage = 'New' | 'In Discussion' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
export type DealPriority = 'High' | 'Medium' | 'Low';

export interface Deal {
  id: string; // e.g., 'D-822'
  leadId: string;
  quotationIds: string[];
  title: string;
  serviceCategory: string;
  amount: number; // recognized deal value
  stage: DealStage;
  priority: DealPriority;
  assignedSalesId: string;
  assignedSalesName: string;
  createdAt: string;
  expectedCloseDate: string;
  closedAt?: string;
}

export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export interface Order {
  id: string; // e.g., 'O-2168'
  dealId: string;
  leadId: string;
  serviceCategory: string;
  orderValue: number;
  status: OrderStatus;
  assignedOpsId: string;
  assignedOpsName: string;
  assignedSalesId: string; // Attributed sales rep through deal
  assignedSalesName?: string;
  createdAt: string;
  stagesTotal: number;
  stagesCompleted: number;
  expectedCompletionDate: string;
  completedAt?: string;
  isOverdue?: boolean;
}

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'UPI' | 'Net Banking' | 'Credit Card' | 'NEFT/RTGS' | 'Cheque';

export interface Payment {
  id: string; // e.g., 'P-1081'
  orderId?: string;
  dealId: string;
  invoiceId: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionRef: string;
  paymentDate: string; // ISO date
  assignedSalesId: string; // Attributed rep through deal
  assignedFinanceId?: string; // Attributed finance controller
  assignedFinanceName?: string;
  assignedOpsId?: string;
  notes?: string;
}

export interface Invoice {
  id: string; // e.g., 'INV-3012'
  dealId: string;
  orderId?: string;
  leadId: string;
  customerName: string;
  invoiceAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
  issueDate: string;
  dueDate: string;
  assignedSalesId: string; // Attributed rep through deal
  assignedFinanceId?: string; // Attributed finance controller
  assignedFinanceName?: string;
  assignedOpsId?: string;
}

export interface UserPreferences {
  monthlyTarget: number;
  currency: string;
  dateFormat: string;
  notificationsEnabled: boolean;
  activeUserId: string;
}

export type UserRole = 'Sales' | 'Operations' | 'Finance' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
  department: 'Sales' | 'Operations' | 'Finance';
  designation: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  employeeId: string;
  employeeName: string;
  action: string;
  recordType: 'Lead' | 'Quotation' | 'Deal' | 'Order' | 'Payment' | 'Invoice';
  recordId: string;
  details?: string;
}

export type DateRangePreset = 'today' | 'last7' | 'last30' | 'oct2026' | 'custom';

export interface DateFilterRange {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label: string;
}

export interface FilterState {
  dateRange: DateFilterRange;
  userId: string; // 'all' or user id
  department: string; // 'all' | 'Sales' | 'Operations' | 'Finance'
  searchQuery: string;
}

export interface PeriodKpiData {
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  unqualifiedLeads: number;
  conversionRate: number; // percentage
  quotationsCreated: number;
  dealsCreated: number;
  invoicesGenerated: number;
  totalDealValue: number;
  totalInvoiced: number;
  totalCollected: number;
  outstandingRevenue: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  department: string;
}
