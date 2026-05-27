import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
};

export function StarRatingInput({
  value,
  onChange,
  disabled,
  className,
}: StarRatingInputProps) {
  return (
    <div
      role="radiogroup"
      className={cn('inline-flex items-center gap-1', className)}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            disabled={disabled}
            onClick={() => onChange(starValue)}
            className={cn(
              'rounded p-0.5 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <Star
              className={cn(
                'h-6 w-6',
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-slate-600',
              )}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
