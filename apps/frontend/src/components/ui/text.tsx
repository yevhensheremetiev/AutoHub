import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      h1: 'text-4xl font-semibold tracking-tight sm:text-5xl',
      h2: 'text-3xl font-semibold tracking-tight sm:text-4xl',
      h3: 'text-2xl font-semibold tracking-tight',
      h4: 'text-xl font-semibold tracking-tight',
      p: 'text-base',
      lead: 'text-lg text-muted-foreground',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      mono: 'font-mono text-sm',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    clamp: {
      none: '',
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
    },
  },
  defaultVariants: {
    variant: 'p',
    align: 'left',
    clamp: 'none',
  },
});

export type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean;
    as?: React.ElementType;
  };

export function Text({
  className,
  variant,
  align,
  clamp,
  asChild,
  as,
  ...props
}: TextProps) {
  const Comp: React.ElementType = asChild ? Slot : (as ?? 'p');
  return (
    <Comp
      className={cn(textVariants({ variant, align, clamp }), className)}
      {...props}
    />
  );
}
