import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

/** Encabezado de pantalla: título + elementos opcionales (volver, acciones). */
export function ScreenHeader({ title, subtitle, left, right, className }: ScreenHeaderProps) {
  return (
    <View className={cn('flex-row items-center gap-4 px-4 py-3', className)}>
      {left}
      <View className="flex-1">
        <Text className="font-inter-extrabold text-xl tracking-[-0.02em] text-primary">
          {title}
        </Text>
        {subtitle ? <Text className="font-inter text-xs text-muted">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}
