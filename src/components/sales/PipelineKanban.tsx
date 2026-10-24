import { Deal, PipelineStage, SalesRep } from '@/types/sales';
import { formatCurrency, cn } from '@/lib/utils';
import { AlertCircle, Calendar, DollarSign } from 'lucide-react';

interface PipelineKanbanProps {
  deals: Deal[];
  reps: SalesRep[];
  isLoading: boolean;
}

const STAGES: PipelineStage[] = [
  'Discovery',
  'Demo Scheduled',
  'Proposal Sent',
  'Negotiation',
  'Closed-Won'
];

export function PipelineKanban({ deals, reps, isLoading }: PipelineKanbanProps) {
  const getRep = (id: string) => reps.find(r => r.id === id);

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter(deal => deal.stage === stage);
    return acc;
  }, {} as Record<PipelineStage, Deal[]>);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
        {STAGES.map((stage) => (
          <div key={stage} className="min-w-[320px] w-[320px] flex-shrink-0 flex flex-col gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white rounded-lg shadow-sm border border-slate-200 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
      {STAGES.map((stage) => {
        const stageDeals = dealsByStage[stage] || [];
        const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div key={stage} className="min-w-[320px] w-[320px] flex-shrink-0 flex flex-col gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200 h-full max-h-full overflow-y-auto">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-1 sticky top-0 bg-slate-50 pb-2 z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{stage}</h3>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-500 mt-0.5">
                  {formatCurrency(stageValue)}
                </span>
              </div>
            </div>

            {/* Deal Cards */}
            {stageDeals.map(deal => {
              const rep = getRep(deal.assignedRepId);
              const isOverdue = new Date(deal.expectedCloseDate) < new Date() && stage !== 'Closed-Won';

              return (
                <div key={deal.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
                  {/* Left accent border */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    stage === 'Closed-Won' ? 'bg-emerald-500' : 'bg-blue-500'
                  )} />
                  
                  <div className="flex justify-between items-start mb-2 pl-1">
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{deal.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{deal.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-3 text-slate-900 font-bold text-sm pl-1">
                    <span>{formatCurrency(deal.value)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pl-1">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium",
                        isOverdue ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                      )}>
                        {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                        {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    {rep && (
                      <div className="relative group/avatar">
                        <img 
                          src={rep.avatarUrl} 
                          alt={rep.name} 
                          className="w-6 h-6 rounded-full ring-2 ring-white bg-slate-100 object-cover"
                        />
                        <div className="absolute bottom-full right-0 mb-1 hidden group-hover/avatar:block bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                          {rep.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {stageDeals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <span className="text-sm">No deals in this stage</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
