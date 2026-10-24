import { cn, formatCurrency } from '@/lib/utils';

interface QuotaProgressBarProps {
  achieved: number;
  target: number;
  className?: string;
}

export function QuotaProgressBar({ achieved, target, className }: QuotaProgressBarProps) {
  const percentage = Math.min(Math.round((achieved / target) * 100), 100);
  
  let colorClass = 'bg-blue-500';
  if (percentage >= 100) colorClass = 'bg-emerald-500';
  else if (percentage >= 75) colorClass = 'bg-amber-400';
  else if (percentage < 40) colorClass = 'bg-rose-500';

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between text-sm font-medium text-slate-700">
        <span>{formatCurrency(achieved)}</span>
        <span className="text-slate-400">{formatCurrency(target)}</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out rounded-full", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs font-bold text-slate-500">
        {percentage}% Attained
      </div>
    </div>
  );
}
