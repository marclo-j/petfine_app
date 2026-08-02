import type { ComponentProps, ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { cn } from '@/lib/cn';

export interface PillProps extends Omit<ComponentProps<typeof Pressable>, 'children'> {
  selected?: boolean;
  label: string;
  /** sm = botones del post (bold 10, radius 5); lg = pills de notificaciones (Medium 14, radius 20). */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** outline = borde y texto naranja (sexo del formulario); solid = gris (notificaciones). */
  variant?: 'solid' | 'outline';
  rightElement?: ReactNode;
}

const sizeStyles = {
  xs: 'h-[17px] px-3 rounded-[5px]',
  sm: 'h-[25px] px-4 rounded-[5px]',
  md: 'h-[31px] px-4 rounded-[5px]',
  lg: 'px-[14px] py-[6px] rounded-full',
} as const;

const textSize = {
  xs: 'text-[7px] font-inter-bold',
  sm: 'text-[10px] font-inter-bold',
  md: 'text-xs font-inter-bold',
  lg: 'text-sm font-inter-medium',
} as const;

const variantStyles = {
  solid: {
    selected: 'bg-primary border border-primary',
    unselected: 'bg-surface border border-lineLight',
  },
  outline: {
    selected: 'bg-primary border border-primary',
    unselected: 'bg-surface border border-primary',
  },
} as const;

const textStyles = {
  solid: {
    selected: 'text-surface',
    unselected: 'text-ink',
  },
  outline: {
    selected: 'text-surface',
    unselected: 'text-primary',
  },
} as const;

/** Pill seleccionable — diseños del Figma: botones de post, sexo y notificaciones. */
export function Pill({
  selected = false,
  label,
  size = 'sm',
  variant = 'solid',
  rightElement,
  className,
  ...rest
}: PillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'flex-row items-center justify-center gap-2',
        variantStyles[variant][selected ? 'selected' : 'unselected'],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      <Text className={cn(textStyles[variant][selected ? 'selected' : 'unselected'], textSize[size])}>
        {label}
      </Text>
      {rightElement}
    </Pressable>
  );
}
