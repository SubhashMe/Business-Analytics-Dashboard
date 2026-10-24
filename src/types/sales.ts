export type PipelineStage = 'Discovery' | 'Demo Scheduled' | 'Proposal Sent' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost';

export type LeadSource = 'Inbound' | 'LinkedIn' | 'Referral' | 'Outbound';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Disqualified';
export type LeadScore = 'Hot' | 'Warm' | 'Cold';

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  territory: string;
  targetQuota: number;
  achievedRevenue: number;
  closedDeals: number;
  callsLogged: number;
  demosPresented: number;
  proposalsSent: number;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  score: LeadScore;
  source: LeadSource;
  status: LeadStatus;
  assignedRepId: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  leadId: string | null;
  stage: PipelineStage;
  probability: number;
  expectedCloseDate: string;
  assignedRepId: string;
  lineItems: LineItem[];
  value: number; // Computed typically, but stored for easy access
  commissionSplit: number;
}

export interface SalesKPIs {
  closedRevenueActual: number;
  closedRevenueTarget: number;
  pipelineValue: number;
  winRate: number;
  winRateTrend: number; // percentage change MoM
  averageDealSize: number;
  dealVelocityDays: number;
}
