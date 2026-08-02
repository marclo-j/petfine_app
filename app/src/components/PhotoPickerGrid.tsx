import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface PhotoPickerGridProps {
  photos: (string | null)[];
  max?: number;
  onChange: (photos: (string | null)[]) => void;
  className?: string;
}

/**
 * Cuadrícula de fotos del formulario — diseño: slots de 84x84 con radius 4px.
 * El slot vacío actúa como botón "agregar foto" (placeholder naranja).
 */
export function PhotoPickerGrid({ photos, max = 3, onChange, className }: PhotoPickerGridProps) {
  const removeAt = (index: number) => {
    const next = [...photos];
    next[index] = null;
    onChange(next);
  };

  return (
    <View className={cn('flex-row flex-wrap gap-2', className)}>
      {Array.from({ length: max }, (_, index) => {
        const photo = photos[index];
        const isEmpty = photo === undefined || photo === null;
        return (
          <View key={index} className="h-[84px] w-[84px]">
            {isEmpty ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Agregar foto ${index + 1}`}
                onPress={() => onChange(photos.map((p, i) => (i === index ? p ?? 'mock://photo' : p)))}
                className="h-full w-full items-center justify-center rounded bg-primary"
              >
                <Text className="font-inter-bold text-xs text-surface">+</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Quitar foto"
                onPress={() => removeAt(index)}
                className="h-full w-full"
              >
                <Image source={photo} contentFit="cover" className="h-full w-full rounded" />
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}
