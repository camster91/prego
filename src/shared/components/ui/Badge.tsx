import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        danger: 'bg-red-100 text-red-800',
        trimester1: 'bg-emerald-100 text-emerald-800',
        trimester2: 'bg-amber-100 text-amber-800',
        trimester3: 'bg-violet-100 text-violet-800',
        intensity_low: 'bg-green-100 text-green-800',
        intensity_moderate: 'bg-yellow-100 text-yellow-800',
        intensity_high: 'bg-orange-100 text-orange-800'
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-3 py-1',
        lg: 'text-sm px-4 py-1.5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Convenience component for trimester badges
interface TrimesterBadgeProps {
  trimester: 1 | 2 | 3;
  className?: string;
}

function TrimesterBadge({ trimester, className }: TrimesterBadgeProps) {
  const labels = {
    1: '1st Trimester',
    2: '2nd Trimester',
    3: '3rd Trimester'
  };

  const variants = {
    1: 'trimester1',
    2: 'trimester2',
    3: 'trimester3'
  } as const;

  return (
    <Badge variant={variants[trimester]} className={className}>
      {labels[trimester]}
    </Badge>
  );
}

// Convenience component for intensity badges
interface IntensityBadgeProps {
  intensity: 'low' | 'moderate' | 'high';
  className?: string;
}

function IntensityBadge({ intensity, className }: IntensityBadgeProps) {
  const labels = {
    low: 'Low Intensity',
    moderate: 'Moderate',
    high: 'High Intensity'
  };

  const variants = {
    low: 'intensity_low',
    moderate: 'intensity_moderate',
    high: 'intensity_high'
  } as const;

  return (
    <Badge variant={variants[intensity]} className={className}>
      {labels[intensity]}
    </Badge>
  );
}

export { Badge, badgeVariants, TrimesterBadge, IntensityBadge };
