import * as z from 'zod';

export const lineItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Price cannot be negative'),
  discountPercentage: z.number().min(0).max(100, 'Discount cannot exceed 100%'),
});

export const dealSchema = z.object({
  title: z.string().min(3, 'Deal title must be at least 3 characters'),
  leadId: z.string().min(1, 'Associated Lead is required'),
  stage: z.enum(['Discovery', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Closed-Won', 'Closed-Lost']),
  probability: z.number().min(0).max(100, 'Probability must be between 0 and 100'),
  expectedCloseDate: z.string().min(1, 'Expected close date is required'),
  assignedRepId: z.string().min(1, 'Sales Representative is required'),
  commissionSplit: z.number().min(0).max(100, 'Commission split must be between 0 and 100'),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
});

export type DealFormValues = z.infer<typeof dealSchema>;
