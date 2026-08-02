import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Estado vacío de listas (feed, notificaciones, chat). */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <View className={cn('items-center justify-center gap-2 px-8 py-12', className)}>
      {icon}
      <Text className="font-inter-semibold text-center text-sm text-ink">{title}</Text>
      {description ? (
        <Text className="font-inter text-center text-xs text-muted">{description}</Text>
      ) : null}
      {action}
    </View>
  );
}
