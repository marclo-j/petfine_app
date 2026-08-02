import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-[133px] w-[133px]',
};

const fallbackText: Record<AvatarSize, string> = {
  sm: 'text-[8px]',
  md: 'text-xs',
  lg: 'text-base',
  xl: 'text-4xl',
};

export interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

/** Avatar circular con fallback a iniciales si no hay imagen. */
export function Avatar({ uri, name, size = 'md', className }: AvatarProps) {
  const initials = (name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      className={cn(
        'items-center justify-center overflow-hidden rounded-full bg-surface-subtle',
        sizeStyles[size],
        className,
      )}
    >
      {uri ? (
        <Image source={uri} contentFit="cover" className="h-full w-full" accessibilityLabel={name} />
      ) : (
        <Text className={cn('font-inter-bold text-ink', fallbackText[size])}>{initials}</Text>
      )}
    </View>
  );
}
