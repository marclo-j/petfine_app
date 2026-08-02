import { forwardRef, type ComponentProps } from 'react';
import { Text, TextInput, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface TextFieldProps extends ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
  /** Texto auxiliar tipo "(min. 1 - máx 3)" que acompaña al label. */
  hint?: string;
  placeholderColor?: string;
}

/** Campo de texto con label, hint y error — estilos del Figma (borde #E0E0E0, radius 8px). */
export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, hint, className, placeholderTextColor = '#828282', ...rest }, ref) => (
    <View className="gap-2">
      {label ? (
        <View className="flex-row items-baseline gap-1">
          <Text className="font-inter-medium text-xs text-ink">{label}</Text>
          {hint ? <Text className="font-inter text-[9px] text-muted">{hint}</Text> : null}
        </View>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor}
        className={cn(
          'h-10 rounded-lg border border-line bg-surface px-2.5 py-2 font-inter text-sm text-ink',
          error && 'border-red-400',
          rest.multiline && 'h-[69px] text-left',
          className,
        )}
        {...rest}
      />
      {error ? <Text className="font-inter text-xs text-red-400">{error}</Text> : null}
    </View>
  ),
);

TextField.displayName = 'TextField';
