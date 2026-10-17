import {
  Lead,
  Quotation,
  Deal,
  Order,
  Invoice,
  Payment,
  User,
  ActivityLog,
} from '../types';

export const USERS: User[] = [
  {
    id: 'u-1',
    name: 'Nancy Singh',
    email: 'nancy.singh@company.com',
    role: 'Sales',
    avatarColor: 'bg-indigo-600',
    department: 'Sales',
    designation: 'Senior Sales Lead',
  },
  {
    id: 'u-2',
    name: 'Sneha Choudhary',
    email: 'sneha.c@company.com',
    role: 'Sales',
    avatarColor: 'bg-purple-600',
    department: 'Sales',
    designation: 'Enterprise Account Executive',
  },
  {
    id: 'u-3',
    name: 'Tannu Kumari',
    email: 'tannu.k@company.com',
    role: 'Sales',
    avatarColor: 'bg-pink-600',
    department: 'Sales',
    designation: 'Business Development Specialist',
  },
  {
    id: 'u-6',
    name: 'Aazam Afroz',
    email: 'aazam.afroz@company.com',
    role: 'Sales',
    avatarColor: 'bg-blue-600',
    department: 'Sales',
    designation: 'Senior Business Consultant',
  },
  {
    id: 'u-4',
    name: 'Gaurav Pant',
    email: 'gaurav.p@company.com',
    role: 'Operations',
    avatarColor: 'bg-emerald-600',
    department: 'Operations',
    designation: 'Operations Lead & Compliance Manager',
  },
  {
    id: 'u-5',
    name: 'Srishti Upadhyay',
    email: 'srishti.u@company.com',
    role: 'Operations',
    avatarColor: 'bg-cyan-600',
    department: 'Operations',
    designation: 'Fulfillment Specialist',
  },
  {
    id: 'u-7',
    name: 'Rajesh Verma',
    email: 'rajesh.v@company.com',
    role: 'Finance',
    avatarColor: 'bg-amber-600',
    department: 'Finance',
    designation: 'Finance & Billing Controller',
  },
];

export const DEFAULT_MONTHLY_TARGET = 8500000; // ₹85,00,000
export const MONTHLY_TARGET = DEFAULT_MONTHLY_TARGET;

export const SERVICES = [
  'Private Limited Company',
  'LLP Registration',
  'GST Registration',
  'Trademark',
  'Startup India Registration',
  'ISO Certification',
  'Annual Compliance',
  'General Filing',
  'FSSAI License',
  'Website Development',
  'DSC & DIN Services',
  'Penalty',
  'Home Path',
  'Company Name Change',
  'One Person Company',
  'Other Services',
];

const companyNames = [
  'Acme Technologies Pvt Ltd',
  'Nexus Logistics LLP',
  'Zenith Solar Solutions',
  'Aura Lifestyle Brands',
  'Vortex Cloud Systems',
  'GreenRoots Agro Food',
  'Quantum Robotics India',
  'UrbanCraft Interiors',
  'Starlight Media Works',
  'BlueHorizon Pharma',
  'Skyline FinServ',
  'TerraFirma Builders',
  'Optima Healthcare Lab',
  'CrestView Hospitality',
  'Hyperion Logistics',
  'SilverOak Education',
  'NovaStar Retail',
  'PeakPulse Fitness',
  'Apex Global Ventures',
  'Pinnacle Legal Associates',
  'Matrix Cyber Systems',
  'Kaveri BioSciences',
  'Indus Global Exports',
  'Horizon FinTech Solutions',
  'Equinox Clean Energy',
];

const contactNames = [
  'Aarav Sharma',
  'Ananya Iyer',
  'Rohan Mehta',
  'Ishita Gupta',
  'Vikram Malhotra',
  'Kavita Reddy',
  'Aditya Deshmukh',
  'Pooja Nair',
  'Siddharth Kapoor',
  'Neha Saxena',
  'Manish Agarwal',
  'Bhavna Joshi',
  'Karan Singhania',
  'Divya Pillai',
  'Sameer Rao',
  'Ritu Verma',
  'Amitabh Sengupta',
  'Swati Bhattacharya',
  'Harshvardhan Rathi',
  'Meenakshi Sundaram',
  'Nikhil Joshi',
  'Priyanka Choudhury',
  'Rahul Bajaj',
  'Tanvi Kulkarni',
  'Zaid Mansoori',
];

const cities = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Chandigarh'];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Helper date generators
export const getIsoDate = (year: number, month: number, day: number, hour = 10, minute = 30): string => {
  const m = month.toString().padStart(2, '0');
  const d = Math.max(1, Math.min(31, day)).toString().padStart(2, '0');
  const hh = Math.max(8, Math.min(20, hour)).toString().padStart(2, '0');
  const mm = Math.max(0, Math.min(59, minute)).toString().padStart(2, '0');
  return `${year}-${m}-${d}T${hh}:${mm}:00.000Z`;
};

// Generate realistic data
export const RAW_LEADS: Lead[] = [];
export const RAW_QUOTATIONS: Quotation[] = [];
export const RAW_DEALS: Deal[] = [];
export const RAW_ORDERS: Order[] = [];
export const RAW_INVOICES: Invoice[] = [];
export const RAW_PAYMENTS: Payment[] = [];
export const RAW_ACTIVITIES: ActivityLog[] = [];

// 1. GENERATE LEADS (130+ leads)
// Attributed realistically across employees including Aazam Afroz, Nancy Singh, Sneha, Tannu, Gaurav, Srishti
// Rep assignments:
// Nancy Singh (u-1): 45 leads
// Aazam Afroz (u-6): 32 leads
// Sneha Choudhary (u-2): 25 leads
// Tannu Kumari (u-3): 18 leads
// Gaurav Pant (u-4): 6 leads
// Srishti Upadhyay (u-5): 6 leads

const leadAssignments = [
  { repId: 'u-1', repName: 'Nancy Singh', count: 45 },
  { repId: 'u-6', repName: 'Aazam Afroz', count: 32 },
  { repId: 'u-2', repName: 'Sneha Choudhary', count: 25 },
  { repId: 'u-3', repName: 'Tannu Kumari', count: 18 },
  { repId: 'u-4', repName: 'Gaurav Pant', count: 6 },
  { repId: 'u-5', repName: 'Srishti Upadhyay', count: 6 },
];

let globalLeadId = 209650;
let leadIdx = 0;

leadAssignments.forEach((assign) => {
  for (let k = 0; k < assign.count; k++) {
    const id = `L-${globalLeadId - leadIdx}`;
    const comp = companyNames[leadIdx % companyNames.length] + (leadIdx > 24 ? ` #${Math.floor(leadIdx / 15)}` : '');
    const contact = contactNames[leadIdx % contactNames.length];
    const source: ('Google Ads' | 'Website' | 'Other' | 'Just Dial' | 'Referral' | 'Social Media')[] = [
      'Google Ads', 'Website', 'Google Ads', 'Website', 'Referral', 'Social Media'
    ];
    const chosenSource = source[(leadIdx * 3 + k) % source.length];

    // Status distribution: ~45% Qualified, ~25% Converted, ~30% Unqualified
    let status: 'New' | 'Qualified' | 'Converted' | 'Unqualified' = 'New';
    const rand = pseudoRandom(leadIdx * 19 + 7);
    if (rand < 0.22) {
      status = 'Converted';
    } else if (rand < 0.58) {
      status = 'Qualified';
    } else if (rand < 0.88) {
      status = 'Unqualified';
    } else {
      status = 'New';
    }

    // Spread across Oct 1 - Oct 31, 2026, plus today (Oct 16-17) and some in September
    let day = 1 + ((leadIdx * 4 + k * 3) % 28);
    let month = 10;
    if (leadIdx > 115) {
      month = 9; // prior month
      day = 1 + (k % 28);
    }
    // Boost today/yesterday for demo testing
    if (k === 0 || k === 1) {
      day = 16;
      month = 10;
    }

    const createdAt = getIsoDate(2026, month, day, 9 + (k % 9), (k * 17) % 60);
    const service = SERVICES[(leadIdx * 2 + k) % 10];

    RAW_LEADS.push({
      id,
      name: contact,
      companyName: comp,
      email: `${contact.toLowerCase().replace(/\s+/g, '.')}@${comp.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: `+91 ${9810000000 + (leadIdx * 76543) % 89999999}`,
      city: cities[(leadIdx + k) % cities.length],
      source: chosenSource,
      status,
      serviceInterest: service,
      assignedSalesId: assign.repId,
      assignedSalesName: assign.repName,
      createdAt,
      qualifiedAt: status === 'Qualified' || status === 'Converted' ? getIsoDate(2026, month, Math.min(31, day + 1), 11, 0) : undefined,
      convertedAt: status === 'Converted' ? getIsoDate(2026, month, Math.min(31, day + 2), 15, 30) : undefined,
      unqualifiedAt: status === 'Unqualified' ? getIsoDate(2026, month, Math.min(31, day + 1), 16, 45) : undefined,
      notes: `Inquired regarding ${service}. Contacted by ${assign.repName}.`
    });

    leadIdx++;
  }
});

// 2. GENERATE QUOTATIONS (85+ quotations)
// Distributed across all reps including Aazam Afroz, Nancy Singh, Sneha, Tannu, Gaurav, Srishti
let globalQuoteId = 10490;
let qIdx = 0;

const repQuoteAllocations = [
  { repId: 'u-1', repName: 'Nancy Singh', count: 32 },
  { repId: 'u-6', repName: 'Aazam Afroz', count: 24 },
  { repId: 'u-2', repName: 'Sneha Choudhary', count: 18 },
  { repId: 'u-3', repName: 'Tannu Kumari', count: 12 },
  { repId: 'u-4', repName: 'Gaurav Pant', count: 5 },
  { repId: 'u-5', repName: 'Srishti Upadhyay', count: 4 },
];

repQuoteAllocations.forEach((alloc) => {
  // Find leads belonging to this rep
  const repLeads = RAW_LEADS.filter((l) => l.assignedSalesId === alloc.repId);

  for (let k = 0; k < alloc.count; k++) {
    const quoteId = `Q-${globalQuoteId - qIdx}`;
    const lead = repLeads[k % repLeads.length] || RAW_LEADS[qIdx % RAW_LEADS.length];
    const service = lead.serviceInterest || SERVICES[k % SERVICES.length];

    // Status: Accepted, Pending, Rejected
    const r = pseudoRandom(qIdx * 13 + 5);
    const status: ('Accepted' | 'Pending' | 'Rejected' | 'Viewed' | 'Sent') =
      r < 0.35 ? 'Accepted' : r < 0.75 ? 'Pending' : r < 0.9 ? 'Rejected' : 'Sent';

    const baseAmount = Math.round(4500 + pseudoRandom(qIdx * 31) * 18000);
    const taxAmount = Math.round(baseAmount * 0.18);
    const finalAmount = baseAmount + taxAmount;

    const createdAt = lead.createdAt;
    const expiryDate = getIsoDate(2026, 11, 15, 18, 0);

    RAW_QUOTATIONS.push({
      id: quoteId,
      leadId: lead.id,
      serviceCategory: service,
      amount: baseAmount,
      taxAmount,
      discount: 0,
      finalAmount,
      status,
      createdAt,
      expiryDate,
      assignedSalesId: alloc.repId,
      assignedSalesName: alloc.repName,
      notes: `Proposal for ${service} package including documentation and filing fees.`
    });

    qIdx++;
  }
});

// 3. GENERATE DEALS (45+ deals)
// Attributed to reps with realistic values and statuses
let globalDealId = 850;
let dealIdx = 0;

const repDealAllocations = [
  { repId: 'u-1', repName: 'Nancy Singh', count: 16, targetRevenue: 86200 },
  { repId: 'u-6', repName: 'Aazam Afroz', count: 12, targetRevenue: 58400 },
  { repId: 'u-2', repName: 'Sneha Choudhary', count: 9, targetRevenue: 42000 },
  { repId: 'u-3', repName: 'Tannu Kumari', count: 6, targetRevenue: 22500 },
  { repId: 'u-4', repName: 'Gaurav Pant', count: 3, targetRevenue: 14000 },
  { repId: 'u-5', repName: 'Srishti Upadhyay', count: 2, targetRevenue: 9500 },
];

repDealAllocations.forEach((alloc) => {
  const repQuotes = RAW_QUOTATIONS.filter((q) => q.assignedSalesId === alloc.repId);

  for (let k = 0; k < alloc.count; k++) {
    const dealId = `D-${globalDealId - dealIdx}`;
    const quote = repQuotes[k % repQuotes.length];
    const lead = RAW_LEADS.find((l) => l.id === quote?.leadId) || RAW_LEADS[dealIdx % RAW_LEADS.length];

    if (quote) {
      quote.dealId = dealId;
      quote.status = 'Accepted';
    }

    const r = pseudoRandom(dealIdx * 23 + 11);
    const stage: ('Won' | 'In Discussion' | 'Negotiation' | 'Proposal Sent' | 'Lost') =
      r < 0.65 ? 'Won' : r < 0.85 ? 'In Discussion' : r < 0.95 ? 'Negotiation' : 'Won';

    const priority: ('High' | 'Medium' | 'Low') =
      k % 3 === 0 ? 'High' : k % 3 === 1 ? 'Medium' : 'Low';

    const dealValue = Math.round(5000 + pseudoRandom(dealIdx * 41) * 16000);
    const createdAt = quote ? quote.createdAt : lead.createdAt;

    RAW_DEALS.push({
      id: dealId,
      leadId: lead.id,
      quotationIds: quote ? [quote.id] : [],
      title: `${lead.companyName} - ${quote?.serviceCategory || 'Corporate Services'}`,
      serviceCategory: quote?.serviceCategory || 'Private Limited Company',
      amount: dealValue,
      stage,
      priority,
      assignedSalesId: alloc.repId,
      assignedSalesName: alloc.repName,
      createdAt,
      expectedCloseDate: getIsoDate(2026, 10, 25, 17, 0),
      closedAt: stage === 'Won' ? getIsoDate(2026, 10, 20, 16, 0) : undefined,
    });

    dealIdx++;
  }
});

// 4. GENERATE ORDERS (45+ fulfillment orders)
// Explicitly mapped to deals, sales reps, and operations team members
let globalOrderId = 2190;
let orderIdx = 0;

RAW_DEALS.forEach((deal, idx) => {
  // Generate 1-2 orders per deal if Won or In Discussion
  if (deal.stage === 'Won' || idx % 2 === 0) {
    const orderId = `O-${globalOrderId - orderIdx}`;
    const ops = idx % 2 === 0
      ? { id: 'u-4', name: 'Gaurav Pant' }
      : { id: 'u-5', name: 'Srishti Upadhyay' };

    const status: ('Completed' | 'In Progress' | 'Pending' | 'On Hold') =
      idx % 3 === 0 ? 'Completed' : idx % 3 === 1 ? 'In Progress' : 'Pending';

    const stagesTotal = 4;
    const stagesCompleted = status === 'Completed' ? 4 : status === 'In Progress' ? 2 : 1;

    RAW_ORDERS.push({
      id: orderId,
      dealId: deal.id,
      leadId: deal.leadId,
      serviceCategory: deal.serviceCategory,
      orderValue: deal.amount,
      status,
      assignedOpsId: ops.id,
      assignedOpsName: ops.name,
      assignedSalesId: deal.assignedSalesId,
      assignedSalesName: deal.assignedSalesName,
      createdAt: deal.createdAt,
      stagesTotal,
      stagesCompleted,
      expectedCompletionDate: getIsoDate(2026, 11, 5, 17, 0),
      completedAt: status === 'Completed' ? getIsoDate(2026, 10, 22, 14, 0) : undefined,
      isOverdue: false,
    });

    orderIdx++;
  }
});

// 5. GENERATE INVOICES (150+ tax invoices)
// Distributed across all deals, correctly attributed to the deal's assignedSalesId!
let globalInvId = 3150;
for (let i = 0; i < 150; i++) {
  const invId = `INV-${globalInvId - i}`;
  const deal = RAW_DEALS[i % RAW_DEALS.length];
  const order = RAW_ORDERS.find((o) => o.dealId === deal.id);
  const lead = RAW_LEADS.find((l) => l.id === deal.leadId) || RAW_LEADS[0];

  const invoiceAmount = Math.round(deal.amount * (0.5 + pseudoRandom(i * 19) * 0.5));
  const isPaid = i % 3 !== 0;
  const paidAmount = isPaid ? invoiceAmount : Math.round(invoiceAmount * 0.4);
  const balanceAmount = invoiceAmount - paidAmount;

  RAW_INVOICES.push({
    id: invId,
    dealId: deal.id,
    orderId: order?.id,
    leadId: lead.id,
    customerName: lead.companyName,
    invoiceAmount,
    paidAmount,
    balanceAmount,
    status: isPaid ? 'Paid' : 'Partially Paid',
    issueDate: deal.createdAt,
    dueDate: getIsoDate(2026, 11, 10, 18, 0),
    assignedSalesId: deal.assignedSalesId, // Attributed to sales rep
    assignedFinanceId: 'u-7', // Rajesh Verma (Finance Lead)
    assignedFinanceName: 'Rajesh Verma',
    assignedOpsId: order?.assignedOpsId,
  });
}

// 6. GENERATE PAYMENTS (80+ payment records)
// Distributed across deals & reps, correctly attributed!
let globalPayId = 1120;
let payIdx = 0;

RAW_DEALS.forEach((deal) => {
  const dealInvoices = RAW_INVOICES.filter((inv) => inv.dealId === deal.id);
  const order = RAW_ORDERS.find((o) => o.dealId === deal.id);
  const lead = RAW_LEADS.find((l) => l.id === deal.leadId) || RAW_LEADS[0];

  dealInvoices.forEach((inv) => {
    if (inv.paidAmount > 0) {
      const payId = `P-${globalPayId - payIdx}`;
      const methods: ('UPI' | 'Net Banking' | 'Credit Card' | 'NEFT/RTGS')[] = [
        'UPI', 'Net Banking', 'Credit Card', 'NEFT/RTGS'
      ];
      const method = methods[payIdx % methods.length];

      RAW_PAYMENTS.push({
        id: payId,
        orderId: order?.id,
        dealId: deal.id,
        invoiceId: inv.id,
        customerName: lead.companyName,
        amount: inv.paidAmount,
        status: 'Paid',
        method,
        transactionRef: `TXN-IND-${20261000 + payIdx}-${payId}`,
        paymentDate: inv.issueDate,
        assignedSalesId: deal.assignedSalesId, // Attributed to rep
        assignedFinanceId: 'u-7', // Rajesh Verma (Finance Lead)
        assignedFinanceName: 'Rajesh Verma',
        assignedOpsId: order?.assignedOpsId,
        notes: `Payment received for ${deal.title} via ${method}`
      });

      payIdx++;
    }
  });
});

// 7. RECENT CRM ACTIVITIES (40+ activities)
// Including events from Aazam Afroz, Nancy Singh, Sneha, Tannu, Gaurav, Srishti, Rajesh
export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '2026-10-16T12:14:10.847Z',
    employeeId: 'u-6',
    employeeName: 'Aazam Afroz',
    action: 'Lead updated',
    recordType: 'Lead',
    recordId: 'L-209645',
    details: 'Discovery call completed. Enterprise proposal requested for Private Limited Company.'
  },
  {
    id: 'act-2',
    timestamp: '2026-10-16T12:10:05.120Z',
    employeeId: 'u-6',
    employeeName: 'Aazam Afroz',
    action: 'Quotation created',
    recordType: 'Quotation',
    recordId: 'Q-10488',
    details: 'Issued quotation of ₹18,500 for Trademark and ISO certification.'
  },
  {
    id: 'act-3',
    timestamp: '2026-10-16T11:53:02.446Z',
    employeeId: 'u-2',
    employeeName: 'Sneha Choudhary',
    action: 'Payment recorded',
    recordType: 'Payment',
    recordId: 'P-1081',
    details: 'Advance payment of ₹15,000 received via UPI.'
  },
  {
    id: 'act-4',
    timestamp: '2026-10-16T11:45:26.072Z',
    employeeId: 'u-6',
    employeeName: 'Aazam Afroz',
    action: 'Deal created',
    recordType: 'Deal',
    recordId: 'D-848',
    details: 'Deal registered: Aura Media Incorporation (₹14,500).'
  },
  {
    id: 'act-5',
    timestamp: '2026-10-16T11:30:19.330Z',
    employeeId: 'u-1',
    employeeName: 'Nancy Singh',
    action: 'Lead updated',
    recordType: 'Lead',
    recordId: 'L-209610',
    details: 'Updated status to Qualified after onboarding review.'
  },
  {
    id: 'act-6',
    timestamp: '2026-10-16T10:44:50.539Z',
    employeeId: 'u-3',
    employeeName: 'Tannu Kumari',
    action: 'Quotation created',
    recordType: 'Quotation',
    recordId: 'Q-10466',
    details: 'Quotation generated for LLP Registration package.'
  },
  {
    id: 'act-7',
    timestamp: '2026-10-16T10:15:12.890Z',
    employeeId: 'u-4',
    employeeName: 'Gaurav Pant',
    action: 'Order completed',
    recordType: 'Order',
    recordId: 'O-2182',
    details: 'MCA incorporation certificate filed and approved.'
  },
  {
    id: 'act-8',
    timestamp: '2026-10-15T16:22:04.110Z',
    employeeId: 'u-6',
    employeeName: 'Aazam Afroz',
    action: 'Deal updated',
    recordType: 'Deal',
    recordId: 'D-845',
    details: 'Stage updated to Won following client contract execution.'
  },
  {
    id: 'act-9',
    timestamp: '2026-10-15T14:40:19.450Z',
    employeeId: 'u-5',
    employeeName: 'Srishti Upadhyay',
    action: 'Order stage updated',
    recordType: 'Order',
    recordId: 'O-2178',
    details: 'Digital Signature Certificate verified.'
  },
  {
    id: 'act-10',
    timestamp: '2026-10-15T11:18:22.000Z',
    employeeId: 'u-7',
    employeeName: 'Rajesh Verma',
    action: 'Invoice generated',
    recordType: 'Invoice',
    recordId: 'INV-3142',
    details: 'Invoice generated with 18% GST for audit review.'
  }
];

RAW_ACTIVITIES.push(...INITIAL_ACTIVITIES);
