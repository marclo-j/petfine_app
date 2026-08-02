import { Text, View } from 'react-native';

/**
 * Separador tipo "or" del diseño: línea a ambos lados del texto.
 * Sin label, renderiza solo la línea.
 */
export function Divider({ label }: { label?: string }) {
  if (!label) {
    return <View className="h-px w-full bg-line-light" />;
  }
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-px flex-1 bg-line-light" />
      <Text className="font-inter text-sm text-muted">{label}</Text>
      <View className="h-px flex-1 bg-line-light" />
    </View>
  );
}
