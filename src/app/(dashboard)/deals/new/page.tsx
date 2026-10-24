'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Save, Loader2, Calculator } from 'lucide-react';
import { dealSchema, DealFormValues } from '@/lib/validations/deal-schema';
import { fetchMockData, mockLeads, mockSalesReps } from '@/data/mock-sales-data';
import { Lead, SalesRep } from '@/types/sales';
import { formatCurrency, cn } from '@/lib/utils';
import { Suspense } from 'react';

function NewDealForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillLeadId = searchParams.get('leadId');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      leadId: prefillLeadId || '',
      stage: 'Discovery',
      probability: 20,
      expectedCloseDate: '',
      assignedRepId: '',
      commissionSplit: 10,
      lineItems: [
        { name: '', quantity: 1, unitPrice: 0, discountPercentage: 0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems'
  });

  const watchedLineItems = form.watch('lineItems');
  
  // Live totals calculation
  const totals = watchedLineItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const discount = Number(item.discountPercentage) || 0;
    
    const baseTotal = qty * price;
    const discountAmount = baseTotal * (discount / 100);
    const subtotal = baseTotal - discountAmount;
    
    return {
      subtotal: acc.subtotal + subtotal,
      tax: acc.tax + (subtotal * 0.08), // Assuming 8% tax
      total: acc.total + subtotal + (subtotal * 0.08)
    };
  }, { subtotal: 0, tax: 0, total: 0 });

  useEffect(() => {
    // Set default close date to today (client-side only to prevent hydration mismatch)
    form.setValue('expectedCloseDate', new Date().toISOString().split('T')[0]);
    
    async function loadData() {
      const loadedLeads = await fetchMockData(mockLeads);
      const loadedReps = await fetchMockData(mockSalesReps);
      setLeads(loadedLeads);
      setReps(loadedReps);
    }
    loadData();
  }, [form]);

  const onSubmit = async (data: DealFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowToast(true);
    
    setTimeout(() => {
      router.push('/pipeline');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto relative">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold">Deal Created Successfully</h4>
            <p className="text-sm text-slate-300">Redirecting to pipeline...</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Deal</h1>
        <p className="text-slate-500 mt-1">Build a quote and add a new opportunity to the pipeline.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Deal Information Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">1. Deal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Deal Title <span className="text-rose-500">*</span></label>
              <input 
                {...form.register('title')} 
                placeholder="e.g. Acme Corp Enterprise License"
                className={cn(
                  "w-full rounded-lg border py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all",
                  form.formState.errors.title ? "border-rose-300 focus:ring-rose-500" : "border-slate-200"
                )}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-rose-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Associated Lead <span className="text-rose-500">*</span></label>
              <select 
                {...form.register('leadId')}
                className={cn(
                  "w-full rounded-lg border py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-white",
                  form.formState.errors.leadId ? "border-rose-300 focus:ring-rose-500" : "border-slate-200"
                )}
              >
                <option value="">Select a lead...</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name} - {l.company}</option>
                ))}
              </select>
              {form.formState.errors.leadId && (
                <p className="text-xs text-rose-500">{form.formState.errors.leadId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Pipeline Stage</label>
              <select 
                {...form.register('stage')}
                className="w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-white"
              >
                <option value="Discovery">Discovery</option>
                <option value="Demo Scheduled">Demo Scheduled</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed-Won">Closed-Won</option>
                <option value="Closed-Lost">Closed-Lost</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expected Close Date <span className="text-rose-500">*</span></label>
              <input 
                type="date"
                {...form.register('expectedCloseDate')} 
                className={cn(
                  "w-full rounded-lg border py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all",
                  form.formState.errors.expectedCloseDate ? "border-rose-300 focus:ring-rose-500" : "border-slate-200"
                )}
              />
              {form.formState.errors.expectedCloseDate && (
                <p className="text-xs text-rose-500">{form.formState.errors.expectedCloseDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Probability (%)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range"
                  min="0" max="100" step="5"
                  {...form.register('probability', { valueAsNumber: true })} 
                  className="flex-1 accent-blue-600"
                />
                <span className="text-sm font-bold w-12 text-right">{form.watch('probability')}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Line Items & Quote Builder */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator size={20} className="text-blue-500" />
              2. Quote Builder
            </h2>
            <button 
              type="button"
              onClick={() => append({ name: '', quantity: 1, unitPrice: 0, discountPercentage: 0 })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Product / Service Name</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit Price (₹)</div>
              <div className="col-span-2">Discount (%)</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {fields.map((field, index) => {
              const item = watchedLineItems[index];
              const itemTotal = (Number(item?.quantity || 0) * Number(item?.unitPrice || 0)) * (1 - (Number(item?.discountPercentage || 0) / 100));

              return (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg border border-slate-100 md:border-none relative">
                  
                  {/* Name */}
                  <div className="col-span-1 md:col-span-4 space-y-1">
                    <label className="text-xs text-slate-500 md:hidden">Product Name</label>
                    <input 
                      {...form.register(`lineItems.${index}.name`)} 
                      placeholder="e.g. Pro License"
                      className={cn(
                        "w-full rounded-lg border py-2 px-3 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all",
                        form.formState.errors.lineItems?.[index]?.name ? "border-rose-300" : "border-slate-200"
                      )}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs text-slate-500 md:hidden">Quantity</label>
                    <input 
                      type="number"
                      {...form.register(`lineItems.${index}.quantity`, { valueAsNumber: true })} 
                      className={cn(
                        "w-full rounded-lg border py-2 px-3 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all",
                        form.formState.errors.lineItems?.[index]?.quantity ? "border-rose-300" : "border-slate-200"
                      )}
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs text-slate-500 md:hidden">Unit Price (₹)</label>
                    <input 
                      type="number"
                      {...form.register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })} 
                      className={cn(
                        "w-full rounded-lg border py-2 px-3 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all",
                        form.formState.errors.lineItems?.[index]?.unitPrice ? "border-rose-300" : "border-slate-200"
                      )}
                    />
                  </div>

                  {/* Discount */}
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs text-slate-500 md:hidden">Discount (%)</label>
                    <input 
                      type="number"
                      {...form.register(`lineItems.${index}.discountPercentage`, { valueAsNumber: true })} 
                      className={cn(
                        "w-full rounded-lg border py-2 px-3 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all",
                        form.formState.errors.lineItems?.[index]?.discountPercentage ? "border-rose-300" : "border-slate-200"
                      )}
                    />
                  </div>

                  {/* Total */}
                  <div className="col-span-1 md:col-span-1 pt-2 font-semibold text-slate-800 text-sm md:text-base">
                    <span className="md:hidden text-slate-500 font-normal text-xs mr-2">Line Total:</span>
                    {formatCurrency(itemTotal || 0)}
                  </div>

                  {/* Action */}
                  <div className="absolute top-2 right-2 md:static md:col-span-1 flex justify-center pt-1">
                    <button 
                      type="button"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
            
            {form.formState.errors.lineItems?.root && (
               <p className="text-sm text-rose-500">{form.formState.errors.lineItems.root.message}</p>
            )}
          </div>

          {/* Totals Summary */}
          <div className="mt-8 flex justify-end">
            <div className="w-full md:w-64 bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 border-b border-slate-200 pb-3">
                <span>Estimated Tax (8%)</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-slate-900 pt-1">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sales Attribution Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">3. Sales Attribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Assigned Representative <span className="text-rose-500">*</span></label>
              <select 
                {...form.register('assignedRepId')}
                className={cn(
                  "w-full rounded-lg border py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-white",
                  form.formState.errors.assignedRepId ? "border-rose-300 focus:ring-rose-500" : "border-slate-200"
                )}
              >
                <option value="">Select a rep...</option>
                {reps.map(r => (
                  <option key={r.id} value={r.id}>{r.name} - {r.territory}</option>
                ))}
              </select>
              {form.formState.errors.assignedRepId && (
                <p className="text-xs text-rose-500">{form.formState.errors.assignedRepId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Commission Split (%)</label>
              <input 
                type="number"
                {...form.register('commissionSplit', { valueAsNumber: true })} 
                className={cn(
                  "w-full rounded-lg border py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all",
                  form.formState.errors.commissionSplit ? "border-rose-300 focus:ring-rose-500" : "border-slate-200"
                )}
              />
              {form.formState.errors.commissionSplit && (
                <p className="text-xs text-rose-500">{form.formState.errors.commissionSplit.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-slate-50/80 backdrop-blur-md p-4 border-t border-slate-200 rounded-xl -mx-4 md:mx-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)] z-10">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSubmitting ? 'Saving Deal...' : 'Create Deal'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewDealPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading form...</div>}>
      <NewDealForm />
    </Suspense>
  );
}
