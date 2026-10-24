import { PipelineStage } from '@/types/sales';
import { cn } from '@/lib/utils';

interface StageBadgeProps {
  stage: PipelineStage;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const styles: Record<PipelineStage, string> = {
    'Discovery': 'bg-blue-100 text-blue-700 border-blue-200',
    'Demo Scheduled': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Proposal Sent': 'bg-amber-100 text-amber-700 border-amber-200',
    'Negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
    'Closed-Won': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Closed-Lost': 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      styles[stage] || 'bg-slate-100 text-slate-700 border-slate-200',
      className
    )}>
      {stage}
    </span>
  );
}
