import { cn } from '../../utils/cn';
import type { ExerciseCategory } from '../../../types';

type PlaceholderSize = 'sm' | 'md' | 'lg' | 'xl' | 'banner';

interface ExercisePlaceholderProps {
  category: ExerciseCategory;
  size?: PlaceholderSize;
  name?: string;
  className?: string;
}

const categoryConfig: Record<ExerciseCategory, { emoji: string; gradient: string }> = {
  strength: {
    emoji: '\uD83D\uDCAA',
    gradient: 'from-rose-400 to-orange-400',
  },
  cardio: {
    emoji: '\u2764\uFE0F',
    gradient: 'from-red-400 to-pink-400',
  },
  flexibility: {
    emoji: '\uD83E\uDDD8',
    gradient: 'from-teal-400 to-cyan-400',
  },
  'pelvic-floor': {
    emoji: '\uD83C\uDF38',
    gradient: 'from-pink-400 to-fuchsia-400',
  },
  breathing: {
    emoji: '\uD83C\uDF2C\uFE0F',
    gradient: 'from-sky-400 to-indigo-400',
  },
  balance: {
    emoji: '\u2696\uFE0F',
    gradient: 'from-violet-400 to-purple-400',
  },
};

const sizeClasses: Record<PlaceholderSize, { container: string; emoji: string; label: string }> = {
  sm: {
    container: 'w-10 h-10 rounded-xl',
    emoji: 'text-lg',
    label: 'hidden',
  },
  md: {
    container: 'w-16 h-16 rounded-xl',
    emoji: 'text-2xl',
    label: 'hidden',
  },
  lg: {
    container: 'w-20 h-20 rounded-2xl',
    emoji: 'text-3xl',
    label: 'text-[10px] font-medium mt-0.5',
  },
  xl: {
    container: 'w-28 h-28 rounded-2xl',
    emoji: 'text-4xl',
    label: 'text-xs font-medium mt-1',
  },
  banner: {
    container: 'w-full h-32 rounded-2xl',
    emoji: 'text-5xl',
    label: 'text-sm font-semibold mt-2',
  },
};

function ExercisePlaceholder({ category, size = 'md', name, className }: ExercisePlaceholderProps) {
  const config = categoryConfig[category] ?? categoryConfig.strength;
  const sizeConfig = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center flex-shrink-0 bg-gradient-to-br',
        config.gradient,
        sizeConfig.container,
        className
      )}
    >
      <span className={cn(sizeConfig.emoji, 'leading-none select-none')} role="img">
        {config.emoji}
      </span>
      {name && (
        <span
          className={cn(
            sizeConfig.label,
            'text-white/90 text-center leading-tight px-1 truncate max-w-full'
          )}
        >
          {name}
        </span>
      )}
    </div>
  );
}

export { ExercisePlaceholder };
