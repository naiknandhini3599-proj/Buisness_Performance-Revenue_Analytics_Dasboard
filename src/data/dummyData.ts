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
    id: 'u-6',
    name: 'Aazam Afroz',
    email: 'aazam.afroz@company.com',
    role: 'Sales',
    avatarColor: 'bg-blue-600',
    department: 'Sales',
    designation: 'Senior Business Consultant',
  },
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
    id: 'u-8',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@company.com',
    role: 'Sales',
    avatarColor: 'bg-teal-600',
    department: 'Sales',
    designation: 'Strategic Accounts Director',
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
  'Company Name Change',
  'One Person Company',
  'Corporate Tax Audit',
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
  'Radiant Mobility Systems',
  'OmniCore Infotech',
  'Aetherial Design Labs',
  'Vanguard Biotech India',
  'Trident Engineering Works',
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
  'Shalini Tiwari',
  'Deepak Chawla',
  'Tarun Khandelwal',
  'Sunita Narang',
  'Varun Goel',
];

const cities = [
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Ahmedabad',
  'Kolkata',
  'Jaipur',
  'Chandigarh',
];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const getIsoDate = (
  year: number,
  month: number,
  day: number,
  hour = 10,
  minute = 30
): string => {
  const m = month.toString().padStart(2, '0');
  const d = Math.max(1, Math.min(31, day)).toString().padStart(2, '0');
  const hh = Math.max(8, Math.min(20, hour)).toString().padStart(2, '0');
  const mm = Math.max(0, Math.min(59, minute)).toString().padStart(2, '0');
  return `${year}-${m}-${d}T${hh}:${mm}:00.000Z`;
};

// Global Centralized Data Stores
export const RAW_LEADS: Lead[] = [];
export const RAW_QUOTATIONS: Quotation[] = [];
export const RAW_DEALS: Deal[] = [];
export const RAW_ORDERS: Order[] = [];
export const RAW_INVOICES: Invoice[] = [];
export const RAW_PAYMENTS: Payment[] = [];
export const RAW_ACTIVITIES: ActivityLog[] = [];

// Distribution across sales reps:
// 1. Aazam Afroz (u-6): 36 leads
// 2. Nancy Singh (u-1): 38 leads
// 3. Sneha Choudhary (u-2): 28 leads
// 4. Tannu Kumari (u-3): 22 leads
// 5. Vikramaditya Rao (u-8): 20 leads
// 6. Gaurav Pant (u-4): 6 direct enterprise leads
// 7. Srishti Upadhyay (u-5): 4 direct enterprise leads
const salesRepAllocation = [
  { repId: 'u-6', repName: 'Aazam Afroz', leadCount: 36, quoteTarget: 22, dealTarget: 14 },
  { repId: 'u-1', repName: 'Nancy Singh', leadCount: 38, quoteTarget: 24, dealTarget: 15 },
  { repId: 'u-2', repName: 'Sneha Choudhary', leadCount: 28, quoteTarget: 18, dealTarget: 11 },
  { repId: 'u-3', repName: 'Tannu Kumari', leadCount: 22, quoteTarget: 14, dealTarget: 9 },
  { repId: 'u-8', repName: 'Vikramaditya Rao', leadCount: 20, quoteTarget: 12, dealTarget: 8 },
  { repId: 'u-4', repName: 'Gaurav Pant', leadCount: 6, quoteTarget: 4, dealTarget: 3 },
  { repId: 'u-5', repName: 'Srishti Upadhyay', leadCount: 4, quoteTarget: 3, dealTarget: 2 },
];

let leadIdCounter = 209700;
let leadGlobalIndex = 0;

salesRepAllocation.forEach((alloc) => {
  for (let k = 0; k < alloc.leadCount; k++) {
    const id = `L-${leadIdCounter - leadGlobalIndex}`;
    const compName =
      companyNames[leadGlobalIndex % companyNames.length] +
      (leadGlobalIndex >= companyNames.length ? ` #${Math.floor(leadGlobalIndex / companyNames.length) + 1}` : '');
    const contactName = contactNames[(leadGlobalIndex * 3 + k) % contactNames.length];
    const sourceOptions: Lead['source'][] = [
      'Google Ads',
      'Website',
      'Referral',
      'Google Ads',
      'Social Media',
      'Just Dial',
      'Other',
    ];
    const source = sourceOptions[(leadGlobalIndex + k * 2) % sourceOptions.length];

    // Status: ensure realistic funnel distribution
    // k === 0, 1, 2 on reps are Won/Converted for rich conversions
    let status: Lead['status'] = 'New';
    const rand = pseudoRandom(leadGlobalIndex * 17 + 13);
    if (k < Math.floor(alloc.dealTarget * 0.9)) {
      status = 'Converted';
    } else if (rand < 0.55) {
      status = 'Qualified';
    } else if (rand < 0.85) {
      status = 'Unqualified';
    } else {
      status = 'New';
    }

    // Date generation spanning September & October 2026:
    // Ensure every rep has leads on:
    // - Today (Oct 16 & 17) -> k === 0 and 1
    // - Last 7 Days (Oct 11 - 17) -> k from 0 to 5
    // - Rest of Oct (Oct 1 - 10)
    // - Previous Month (Sept 15 - 30) for prior-period comparisons
    let month = 10;
    let day = 1;
    if (k === 0) {
      day = 17; // Today
      month = 10;
    } else if (k === 1) {
      day = 16; // Yesterday
      month = 10;
    } else if (k === 2) {
      day = 14;
      month = 10;
    } else if (k === 3) {
      day = 12;
      month = 10;
    } else if (k === 4) {
      day = 11;
      month = 10;
    } else if (k % 5 === 0) {
      month = 9; // Prior month in September
      day = 15 + (k % 14);
    } else {
      month = 10;
      day = 1 + ((k * 4 + leadGlobalIndex) % 15);
    }

    const createdAt = getIsoDate(2026, month, day, 9 + (k % 9), (k * 13) % 60);
    const service = SERVICES[(leadGlobalIndex + k) % SERVICES.length];

    RAW_LEADS.push({
      id,
      name: contactName,
      companyName: compName,
      email: `${contactName.toLowerCase().replace(/\s+/g, '.')}@${compName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')}.com`,
      phone: `+91 ${9810000000 + ((leadGlobalIndex * 98765) % 89999999)}`,
      city: cities[(leadGlobalIndex + k) % cities.length],
      source,
      status,
      serviceInterest: service,
      assignedSalesId: alloc.repId,
      assignedSalesName: alloc.repName,
      createdAt,
      qualifiedAt:
        status === 'Qualified' || status === 'Converted'
          ? getIsoDate(2026, month, Math.min(31, day + 1), 11, 15)
          : undefined,
      convertedAt:
        status === 'Converted'
          ? getIsoDate(2026, month, Math.min(31, day + 2), 15, 45)
          : undefined,
      unqualifiedAt:
        status === 'Unqualified'
          ? getIsoDate(2026, month, Math.min(31, day + 1), 16, 20)
          : undefined,
      notes: `Consultation regarding ${service}. Initial discovery performed by ${alloc.repName}.`,
    });

    leadGlobalIndex++;
  }
});

// 2. GENERATE REALISTIC QUOTATIONS (85+ quotations)
let quoteIdCounter = 10550;
let quoteGlobalIndex = 0;

salesRepAllocation.forEach((alloc) => {
  const repLeads = RAW_LEADS.filter((l) => l.assignedSalesId === alloc.repId);

  for (let k = 0; k < alloc.quoteTarget; k++) {
    const id = `Q-${quoteIdCounter - quoteGlobalIndex}`;
    const lead = repLeads[k % repLeads.length] || RAW_LEADS[quoteGlobalIndex % RAW_LEADS.length];
    const service = lead.serviceInterest || SERVICES[k % SERVICES.length];

    // Quotation created after or on lead creation date
    const leadDate = new Date(lead.createdAt);
    const quoteDate = new Date(leadDate);
    quoteDate.setHours(quoteDate.getHours() + 4);

    const baseAmount = Math.round(5000 + pseudoRandom(quoteGlobalIndex * 29 + 7) * 22000);
    const taxAmount = Math.round(baseAmount * 0.18);
    const finalAmount = baseAmount + taxAmount;

    // Status: Accepted if deal target, else Pending or Sent
    const status: Quotation['status'] =
      k < alloc.dealTarget
        ? 'Accepted'
        : k % 4 === 0
        ? 'Rejected'
        : k % 3 === 0
        ? 'Pending'
        : 'Sent';

    RAW_QUOTATIONS.push({
      id,
      leadId: lead.id,
      serviceCategory: service,
      amount: baseAmount,
      taxAmount,
      discount: 0,
      finalAmount,
      status,
      createdAt: quoteDate.toISOString(),
      expiryDate: getIsoDate(2026, 11, 20, 18, 0),
      assignedSalesId: alloc.repId,
      assignedSalesName: alloc.repName,
      notes: `Commercial proposal for ${service} including registration fees and legal documentation.`,
    });

    quoteGlobalIndex++;
  }
});

// 3. GENERATE DEALS (55+ commercial deals)
let dealIdCounter = 890;
let dealGlobalIndex = 0;

salesRepAllocation.forEach((alloc) => {
  const repQuotes = RAW_QUOTATIONS.filter(
    (q) => q.assignedSalesId === alloc.repId && q.status === 'Accepted'
  );

  for (let k = 0; k < alloc.dealTarget; k++) {
    const id = `D-${dealIdCounter - dealGlobalIndex}`;
    const quote = repQuotes[k % repQuotes.length] || RAW_QUOTATIONS[dealGlobalIndex % RAW_QUOTATIONS.length];
    const lead = RAW_LEADS.find((l) => l.id === quote.leadId) || RAW_LEADS[dealGlobalIndex % RAW_LEADS.length];

    // Link quote to deal
    quote.dealId = id;
    quote.status = 'Accepted';

    const quoteDate = new Date(quote.createdAt);
    const dealDate = new Date(quoteDate);
    dealDate.setHours(dealDate.getHours() + 6);

    const stages: Deal['stage'][] = ['Won', 'Won', 'Won', 'Negotiation', 'In Discussion'];
    const stage = stages[k % stages.length];
    const priorities: Deal['priority'][] = ['High', 'Medium', 'Medium', 'Low'];
    const priority = priorities[k % priorities.length];

    const dealValue = quote.amount;

    RAW_DEALS.push({
      id,
      leadId: lead.id,
      quotationIds: [quote.id],
      title: `${lead.companyName} - ${quote.serviceCategory}`,
      serviceCategory: quote.serviceCategory,
      amount: dealValue,
      stage,
      priority,
      assignedSalesId: alloc.repId,
      assignedSalesName: alloc.repName,
      createdAt: dealDate.toISOString(),
      expectedCloseDate: getIsoDate(2026, 10, 28, 17, 30),
      closedAt: stage === 'Won' ? dealDate.toISOString() : undefined,
    });

    dealGlobalIndex++;
  }
});

// 4. GENERATE FULFILLMENT ORDERS (48+ orders)
let orderIdCounter = 2240;
let orderGlobalIndex = 0;

RAW_DEALS.forEach((deal, idx) => {
  // Deals won or in progress trigger fulfillment orders
  if (deal.stage === 'Won' || idx % 2 === 0) {
    const id = `O-${orderIdCounter - orderGlobalIndex}`;
    const ops =
      idx % 2 === 0
        ? { id: 'u-4', name: 'Gaurav Pant' }
        : { id: 'u-5', name: 'Srishti Upadhyay' };

    const status: Order['status'] =
      idx % 4 === 0 ? 'Completed' : idx % 4 === 1 ? 'In Progress' : 'Pending';

    const stagesTotal = 4;
    const stagesCompleted = status === 'Completed' ? 4 : status === 'In Progress' ? 2 : 1;

    const dealDate = new Date(deal.createdAt);
    const orderDate = new Date(dealDate);
    orderDate.setHours(orderDate.getHours() + 3);

    RAW_ORDERS.push({
      id,
      dealId: deal.id,
      leadId: deal.leadId,
      serviceCategory: deal.serviceCategory,
      orderValue: deal.amount,
      status,
      assignedOpsId: ops.id,
      assignedOpsName: ops.name,
      assignedSalesId: deal.assignedSalesId,
      assignedSalesName: deal.assignedSalesName,
      createdAt: orderDate.toISOString(),
      stagesTotal,
      stagesCompleted,
      expectedCompletionDate: getIsoDate(2026, 11, 10, 18, 0),
      completedAt: status === 'Completed' ? getIsoDate(2026, 10, 22, 16, 0) : undefined,
      isOverdue: false,
    });

    orderGlobalIndex++;
  }
});

// 5. GENERATE TAX INVOICES (100+ invoices)
let invoiceIdCounter = 3250;
let invoiceGlobalIndex = 0;

RAW_DEALS.forEach((deal, idx) => {
  // Generate 1-2 invoices per deal
  const order = RAW_ORDERS.find((o) => o.dealId === deal.id);
  const lead = RAW_LEADS.find((l) => l.id === deal.leadId) || RAW_LEADS[0];

  const invCount = deal.stage === 'Won' ? 2 : 1;
  for (let m = 0; m < invCount; m++) {
    const id = `INV-${invoiceIdCounter - invoiceGlobalIndex}`;
    const dealDate = new Date(deal.createdAt);
    dealDate.setHours(dealDate.getHours() + 4 + m * 24);

    const invoiceAmount = Math.round((deal.amount / invCount) * 1.18);
    const isPaid = deal.stage === 'Won' && (m === 0 || idx % 3 !== 0);
    const paidAmount = isPaid ? invoiceAmount : m === 0 ? Math.round(invoiceAmount * 0.5) : 0;
    const balanceAmount = invoiceAmount - paidAmount;

    RAW_INVOICES.push({
      id,
      dealId: deal.id,
      orderId: order?.id,
      leadId: lead.id,
      customerName: lead.companyName,
      invoiceAmount,
      paidAmount,
      balanceAmount,
      status: balanceAmount === 0 ? 'Paid' : paidAmount > 0 ? 'Partially Paid' : 'Unpaid',
      issueDate: dealDate.toISOString(),
      dueDate: getIsoDate(2026, 11, 15, 18, 0),
      assignedSalesId: deal.assignedSalesId,
      assignedFinanceId: 'u-7',
      assignedFinanceName: 'Rajesh Verma',
      assignedOpsId: order?.assignedOpsId,
    });

    invoiceGlobalIndex++;
  }
});

// 6. GENERATE PAYMENTS (75+ payment receipts)
let paymentIdCounter = 1180;
let paymentGlobalIndex = 0;

RAW_INVOICES.forEach((inv) => {
  if (inv.paidAmount > 0) {
    const id = `P-${paymentIdCounter - paymentGlobalIndex}`;
    const paymentMethods: Payment['method'][] = [
      'UPI',
      'Net Banking',
      'NEFT/RTGS',
      'Credit Card',
      'UPI',
    ];
    const method = paymentMethods[paymentGlobalIndex % paymentMethods.length];
    const invDate = new Date(inv.issueDate);
    const payDate = new Date(invDate);
    payDate.setHours(payDate.getHours() + 2);

    RAW_PAYMENTS.push({
      id,
      orderId: inv.orderId,
      dealId: inv.dealId,
      invoiceId: inv.id,
      customerName: inv.customerName,
      amount: inv.paidAmount,
      status: 'Paid',
      method,
      transactionRef: `TXN-IND-${20261000 + paymentGlobalIndex}-${id}`,
      paymentDate: payDate.toISOString(),
      assignedSalesId: inv.assignedSalesId,
      assignedFinanceId: 'u-7',
      assignedFinanceName: 'Rajesh Verma',
      assignedOpsId: inv.assignedOpsId,
      notes: `Bank reconciliation: received ${inv.paidAmount} INR via ${method}.`,
    });

    paymentGlobalIndex++;
  }
});

// 7. INITIAL RECENT CRM ACTIVITIES (40+ activities)
export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '2026-10-17T11:45:10.000Z',
    employeeId: 'u-6',
    employeeName: 'Aazam Afroz',
    action: 'Lead converted',
    recordType: 'Lead',
    recordId: 'L-209700',
    details: 'Customer finalized incorporation package. Commercial proposal accepted.',
  },
  {
    id: 'act-2',
    timestamp: '2026-10-17T10:30:15.000Z',
    employeeId: 'u-7',
    employeeName: 'Rajesh Verma',
    action: 'Payment recorded',
    recordType: 'Payment',
    recordId: 'P-1180',
    details: 'Reconciled incoming UPI bank transfer of ₹24,500 from Acme Technologies Pvt Ltd.',
  },
  {
    id: 'act-3',
    timestamp: '2026-10-17T09:15:20.000Z',
    employeeId: 'u-1',
    employeeName: 'Nancy Singh',
    action: 'Quotation created',
    recordType: 'Quotation',
    recordId: 'Q-10549',
    details: 'Dispatched GST Registration and Trademark filing proposal.',
  },
  {
    id: 'act-4',
    timestamp: '2026-10-16T16:20:45.000Z',
    employeeId: 'u-4',
    employeeName: 'Gaurav Pant',
    action: 'Order completed',
    recordType: 'Order',
    recordId: 'O-2238',
    details: 'MCA incorporation certificate approved and delivered to client.',
  },
  {
    id: 'act-5',
    timestamp: '2026-10-16T15:10:00.000Z',
    employeeId: 'u-2',
    employeeName: 'Sneha Choudhary',
    action: 'Deal created',
    recordType: 'Deal',
    recordId: 'D-888',
    details: 'Registered high-priority contract for Nexus Logistics LLP (₹18,500).',
  },
  {
    id: 'act-6',
    timestamp: '2026-10-16T14:05:30.000Z',
    employeeId: 'u-5',
    employeeName: 'Srishti Upadhyay',
    action: 'Order stage updated',
    recordType: 'Order',
    recordId: 'O-2235',
    details: 'Stage 3 of 4: Digital Signature & Board Resolution verified.',
  },
  {
    id: 'act-7',
    timestamp: '2026-10-16T11:55:00.000Z',
    employeeId: 'u-3',
    employeeName: 'Tannu Kumari',
    action: 'Lead status changed',
    recordType: 'Lead',
    recordId: 'L-209680',
    details: 'Upgraded lead status to Qualified following compliance discovery.',
  },
  {
    id: 'act-8',
    timestamp: '2026-10-15T16:40:00.000Z',
    employeeId: 'u-8',
    employeeName: 'Vikramaditya Rao',
    action: 'Quotation accepted',
    recordType: 'Quotation',
    recordId: 'Q-10530',
    details: 'Client executed agreement for Corporate Tax Audit and Annual Compliance.',
  },
  {
    id: 'act-9',
    timestamp: '2026-10-15T14:15:00.000Z',
    employeeId: 'u-6',
    employeeName: 'Aazam Afroz',
    action: 'Deal updated',
    recordType: 'Deal',
    recordId: 'D-885',
    details: 'Deal stage advanced to Won following contract sign-off.',
  },
  {
    id: 'act-10',
    timestamp: '2026-10-15T11:00:00.000Z',
    employeeId: 'u-7',
    employeeName: 'Rajesh Verma',
    action: 'Invoice generated',
    recordType: 'Invoice',
    recordId: 'INV-3240',
    details: 'Generated tax invoice with 18% GST for Zenith Solar Solutions.',
  },
];

RAW_ACTIVITIES.push(...INITIAL_ACTIVITIES);
