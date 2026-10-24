import { LeadScore } from '@/types/sales';
import { cn } from '@/lib/utils';
import { Flame, Thermometer, Snowflake } from 'lucide-react';

interface LeadScoreIndicatorProps {
  score: LeadScore;
  className?: string;
}

export function LeadScoreIndicator({ score, className }: LeadScoreIndicatorProps) {
  const config = {
    'Hot': { icon: Flame, color: 'text-rose-500', bg: 'bg-rose-100' },
    'Warm': { icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-100' },
    'Cold': { icon: Snowflake, color: 'text-blue-500', bg: 'bg-blue-100' },
  };

  const { icon: Icon, color, bg } = config[score];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("p-1 rounded-full", bg)}>
        <Icon size={14} className={color} />
      </div>
      <span className={cn("text-xs font-medium", color)}>{score}</span>
    </div>
  );
}
