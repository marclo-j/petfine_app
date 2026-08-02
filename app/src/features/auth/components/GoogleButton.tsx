import { Pressable, Text } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

export interface GoogleButtonProps {
  label: string;
  onPress: () => void;
  className?: string;
}

/** Botón "Continuar con Google" — diseño: fondo #EEEEEE, logo Google 20px. */
export function GoogleButton({ label, onPress, className }: GoogleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn(
        'h-10 flex-row items-center justify-center gap-2 rounded-lg bg-surface-press',
        className,
      )}
    >
      <Icon name="google" size={20} />
      <Text className="font-inter-medium text-sm text-ink">{label}</Text>
    </Pressable>
  );
}
