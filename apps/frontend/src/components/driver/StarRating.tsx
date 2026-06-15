import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type StarRatingProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
};

export function StarRating({
  value,
  max = 5,
  size = 'sm',
  className,
}: StarRatingProps) {
  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`${value} / ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        return (
          <Star
            key={i}
            className={cn(
              iconClass,
              filled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-slate-600',
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
