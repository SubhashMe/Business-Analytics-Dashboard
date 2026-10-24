import { Lead, Deal, SalesRep, SalesKPIs, PipelineStage } from '@/types/sales';

export const mockSalesReps: SalesRep[] = [
  {
    id: 'rep-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@dealflow.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    territory: 'North America East',
    targetQuota: 1000000,
    achievedRevenue: 850000,
    closedDeals: 15,
    callsLogged: 340,
    demosPresented: 45,
    proposalsSent: 25,
  },
  {
    id: 'rep-2',
    name: 'Michael Chang',
    email: 'michael.c@dealflow.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=michael',
    territory: 'EMEA',
    targetQuota: 1200000,
    achievedRevenue: 1350000,
    closedDeals: 22,
    callsLogged: 410,
    demosPresented: 60,
    proposalsSent: 35,
  },
  {
    id: 'rep-3',
    name: 'Elena Rodriguez',
    email: 'elena.r@dealflow.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    territory: 'LATAM',
    targetQuota: 800000,
    achievedRevenue: 400000,
    closedDeals: 8,
    callsLogged: 290,
    demosPresented: 30,
    proposalsSent: 15,
  },
  {
    id: 'rep-4',
    name: 'David Smith',
    email: 'david.s@dealflow.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    territory: 'APAC',
    targetQuota: 1500000,
    achievedRevenue: 1100000,
    closedDeals: 18,
    callsLogged: 500,
    demosPresented: 55,
    proposalsSent: 28,
  }
];

export const mockLeads: Lead[] = [
  { id: 'lead-1', name: 'Alice Walker', company: 'TechNova', title: 'VP Engineering', email: 'alice@technova.io', score: 'Hot', source: 'Inbound', status: 'Qualified', assignedRepId: 'rep-1', createdAt: '2024-03-01T10:00:00Z' },
  { id: 'lead-2', name: 'Bob Harris', company: 'Globex Corp', title: 'CTO', email: 'bharris@globex.com', score: 'Cold', source: 'Outbound', status: 'Contacted', assignedRepId: 'rep-2', createdAt: '2024-03-05T14:30:00Z' },
  { id: 'lead-3', name: 'Charlie Davis', company: 'Initech', title: 'Director of IT', email: 'cdavis@initech.net', score: 'Warm', source: 'LinkedIn', status: 'New', assignedRepId: 'rep-3', createdAt: '2024-03-10T09:15:00Z' },
  { id: 'lead-4', name: 'Diana Prince', company: 'Themyscira LLC', title: 'CEO', email: 'diana@themyscira.com', score: 'Hot', source: 'Referral', status: 'Qualified', assignedRepId: 'rep-4', createdAt: '2024-03-12T11:45:00Z' },
  { id: 'lead-5', name: 'Evan Wright', company: 'Stark Industries', title: 'Procurement Head', email: 'ewright@stark.com', score: 'Warm', source: 'Inbound', status: 'Contacted', assignedRepId: 'rep-1', createdAt: '2024-03-15T16:20:00Z' },
  { id: 'lead-6', name: 'Fiona Gallagher', company: 'Gallagher Tech', title: 'Founder', email: 'fiona@gallagher.tech', score: 'Cold', source: 'Outbound', status: 'Disqualified', assignedRepId: 'rep-2', createdAt: '2024-03-18T08:00:00Z' },
  { id: 'lead-7', name: 'George Mason', company: 'CTU', title: 'Director', email: 'gmason@ctu.gov', score: 'Hot', source: 'LinkedIn', status: 'New', assignedRepId: 'rep-3', createdAt: '2024-03-20T13:10:00Z' },
  { id: 'lead-8', name: 'Hannah Abbott', company: 'Hogwarts Inc', title: 'Operations Manager', email: 'habbott@hogwarts.com', score: 'Warm', source: 'Referral', status: 'Qualified', assignedRepId: 'rep-4', createdAt: '2024-03-22T10:30:00Z' },
  { id: 'lead-9', name: 'Ian Malcolm', company: 'InGen', title: 'Chief Scientist', email: 'imalcolm@ingen.com', score: 'Cold', source: 'Inbound', status: 'Contacted', assignedRepId: 'rep-1', createdAt: '2024-03-25T15:55:00Z' },
  { id: 'lead-10', name: 'Julia Roberts', company: 'Ocean 11', title: 'Security Consultant', email: 'julia@ocean11.com', score: 'Hot', source: 'Outbound', status: 'Qualified', assignedRepId: 'rep-2', createdAt: '2024-03-28T09:40:00Z' },
  { id: 'lead-11', name: 'Kevin Bacon', company: 'Tremors Co', title: 'Site Manager', email: 'kbacon@tremors.com', score: 'Warm', source: 'LinkedIn', status: 'New', assignedRepId: 'rep-3', createdAt: '2024-03-30T14:20:00Z' },
  { id: 'lead-12', name: 'Laura Dern', company: 'Jurassic Park', title: 'Paleobotanist', email: 'ldern@jurassic.com', score: 'Cold', source: 'Referral', status: 'Disqualified', assignedRepId: 'rep-4', createdAt: '2024-04-01T11:10:00Z' },
  { id: 'lead-13', name: 'Mark Watney', company: 'Ares III', title: 'Botanist', email: 'mwatney@ares.gov', score: 'Hot', source: 'Inbound', status: 'Qualified', assignedRepId: 'rep-1', createdAt: '2024-04-03T16:45:00Z' },
  { id: 'lead-14', name: 'Natasha Romanoff', company: 'Avengers Initiative', title: 'Operative', email: 'natasha@avengers.org', score: 'Warm', source: 'Outbound', status: 'Contacted', assignedRepId: 'rep-2', createdAt: '2024-04-05T08:30:00Z' },
  { id: 'lead-15', name: 'Owen Grady', company: 'Jurassic World', title: 'Animal Behaviorist', email: 'ogrady@jurassicworld.com', score: 'Hot', source: 'LinkedIn', status: 'Qualified', assignedRepId: 'rep-3', createdAt: '2024-04-07T13:00:00Z' },
  { id: 'lead-16', name: 'Peggy Carter', company: 'SSR', title: 'Director', email: 'pcarter@ssr.gov', score: 'Warm', source: 'Referral', status: 'New', assignedRepId: 'rep-4', createdAt: '2024-04-09T10:20:00Z' },
  { id: 'lead-17', name: 'Quentin Lance', company: 'Starling City', title: 'Captain', email: 'qlance@starling.gov', score: 'Cold', source: 'Inbound', status: 'Disqualified', assignedRepId: 'rep-1', createdAt: '2024-04-11T14:50:00Z' },
  { id: 'lead-18', name: 'Ripley', company: 'Weyland-Yutani', title: 'Warrant Officer', email: 'ripley@weyland.com', score: 'Hot', source: 'Outbound', status: 'Qualified', assignedRepId: 'rep-2', createdAt: '2024-04-13T09:10:00Z' }
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'TechNova Enterprise License',
    company: 'TechNova',
    leadId: 'lead-1',
    stage: 'Negotiation',
    probability: 80,
    expectedCloseDate: '2024-05-15',
    assignedRepId: 'rep-1',
    value: 125000,
    commissionSplit: 10,
    lineItems: [
      { id: 'li-1', name: 'Enterprise Platform License', quantity: 1, unitPrice: 100000, discountPercentage: 0 },
      { id: 'li-2', name: 'Premium Support SLA', quantity: 1, unitPrice: 25000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-2',
    title: 'Themyscira Cloud Migration',
    company: 'Themyscira LLC',
    leadId: 'lead-4',
    stage: 'Proposal Sent',
    probability: 50,
    expectedCloseDate: '2024-06-01',
    assignedRepId: 'rep-4',
    value: 85000,
    commissionSplit: 12,
    lineItems: [
      { id: 'li-3', name: 'Cloud Migration Services', quantity: 1, unitPrice: 95000, discountPercentage: 10.5 }
    ]
  },
  {
    id: 'deal-3',
    title: 'Ocean 11 Security Audit',
    company: 'Ocean 11',
    leadId: 'lead-10',
    stage: 'Demo Scheduled',
    probability: 30,
    expectedCloseDate: '2024-07-20',
    assignedRepId: 'rep-2',
    value: 45000,
    commissionSplit: 15,
    lineItems: [
      { id: 'li-4', name: 'Security Audit Package', quantity: 1, unitPrice: 45000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-4',
    title: 'Stark Industries API Integration',
    company: 'Stark Industries',
    leadId: 'lead-5',
    stage: 'Discovery',
    probability: 10,
    expectedCloseDate: '2024-08-10',
    assignedRepId: 'rep-1',
    value: 200000,
    commissionSplit: 8,
    lineItems: [
      { id: 'li-5', name: 'API Gateway Setup', quantity: 1, unitPrice: 200000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-5',
    title: 'Ares III Comm System',
    company: 'Ares III',
    leadId: 'lead-13',
    stage: 'Closed-Won',
    probability: 100,
    expectedCloseDate: '2024-04-10',
    assignedRepId: 'rep-1',
    value: 350000,
    commissionSplit: 10,
    lineItems: [
      { id: 'li-6', name: 'Interplanetary Comm Array', quantity: 1, unitPrice: 350000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-6',
    title: 'Initech Software Update',
    company: 'Initech',
    leadId: 'lead-3',
    stage: 'Negotiation',
    probability: 70,
    expectedCloseDate: '2024-05-25',
    assignedRepId: 'rep-3',
    value: 65000,
    commissionSplit: 12,
    lineItems: [
      { id: 'li-7', name: 'Software Update Package', quantity: 100, unitPrice: 650, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-7',
    title: 'Globex Corp Supply Chain',
    company: 'Globex Corp',
    leadId: 'lead-2',
    stage: 'Proposal Sent',
    probability: 40,
    expectedCloseDate: '2024-06-15',
    assignedRepId: 'rep-2',
    value: 150000,
    commissionSplit: 10,
    lineItems: [
      { id: 'li-8', name: 'Supply Chain Optimization', quantity: 1, unitPrice: 150000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-8',
    title: 'Jurassic World IT Infrastructure',
    company: 'Jurassic World',
    leadId: 'lead-15',
    stage: 'Discovery',
    probability: 20,
    expectedCloseDate: '2024-09-01',
    assignedRepId: 'rep-3',
    value: 500000,
    commissionSplit: 8,
    lineItems: [
      { id: 'li-9', name: 'Server Rack Upgrade', quantity: 10, unitPrice: 50000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-9',
    title: 'Hogwarts Inc Magic ERP',
    company: 'Hogwarts Inc',
    leadId: 'lead-8',
    stage: 'Closed-Lost',
    probability: 0,
    expectedCloseDate: '2024-03-15',
    assignedRepId: 'rep-4',
    value: 120000,
    commissionSplit: 15,
    lineItems: [
      { id: 'li-10', name: 'Magic ERP Software', quantity: 1, unitPrice: 120000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-10',
    title: 'CTU Data Analytics',
    company: 'CTU',
    leadId: 'lead-7',
    stage: 'Demo Scheduled',
    probability: 35,
    expectedCloseDate: '2024-07-05',
    assignedRepId: 'rep-3',
    value: 80000,
    commissionSplit: 12,
    lineItems: [
      { id: 'li-11', name: 'Data Analytics Dashboard', quantity: 1, unitPrice: 80000, discountPercentage: 0 }
    ]
  },
  {
    id: 'deal-11',
    title: 'Weyland Xenomorph Containment',
    company: 'Weyland-Yutani',
    leadId: 'lead-18',
    stage: 'Proposal Sent',
    probability: 60,
    expectedCloseDate: '2024-08-15',
    assignedRepId: 'rep-2',
    value: 420000,
    commissionSplit: 10,
    lineItems: [
      { id: 'li-12', name: 'Advanced Containment Unit', quantity: 2, unitPrice: 210000, discountPercentage: 0 }
    ]
  }
];

export const mockSalesKPIs: SalesKPIs = {
  closedRevenueActual: 3700000,
  closedRevenueTarget: 4500000,
  pipelineValue: 8500000,
  winRate: 42.5,
  winRateTrend: 5.2,
  averageDealSize: 145000,
  dealVelocityDays: 45
};

// Simulate API delay
export async function fetchMockData<T>(data: T, delayMs: number = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}
