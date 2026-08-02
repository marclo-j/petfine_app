import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'full';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-surface-press',
  ghost: 'bg-transparent border border-primary',
  dark: 'bg-ink',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-[25px] px-4 rounded-[5px]',
  md: 'h-10 px-4 rounded-lg',
  lg: 'h-12 px-6 rounded-lg',
  full: 'h-12 px-6 rounded-lg w-full',
};

const textStyles: Record<ButtonVariant, string> = {
  primary: 'text-surface font-inter-bold text-sm',
  secondary: 'text-ink font-inter-bold text-sm',
  ghost: 'text-primary font-inter-bold text-sm',
  dark: 'text-surface font-inter-bold text-sm',
};

export interface ButtonProps extends Omit<ComponentProps<typeof Pressable>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  label: string;
}

/** Botón principal de la app (estilos del Figma: #F99139, radius 8/5px). */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  label,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#F99139' : '#FFFFFF'} />
      ) : (
        <Text className={cn(textStyles[variant], size === 'sm' && 'text-[10px]')}>{label}</Text>
      )}
    </Pressable>
  );
}
