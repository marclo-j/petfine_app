import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface SegmentedTab<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedTabsProps<T extends string> {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Tabs de texto del header del feed — diseño #1:1716: gap 12, centrado,
 * activa naranja Semi Bold 600/14, inactiva rgba(0,0,0,0.4).
 */
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <View className={cn('flex-row items-center justify-center gap-3', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.value)}
          >
            <Text
              className={cn(
                'text-center text-sm tracking-[-0.02em]',
                active ? 'font-inter-semibold text-primary' : 'font-inter-medium text-black/40',
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
