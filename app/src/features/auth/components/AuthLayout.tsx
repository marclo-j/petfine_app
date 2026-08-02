import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Layout común de las pantallas de auth — diseño: logo "PetFine",
 * copy (título + subtítulo), contenido y footer.
 */
export function AuthLayout({ title, subtitle, children, footer, className }: AuthLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center px-6">
            <Text className="mt-10 font-inter-semibold text-2xl tracking-[-0.01em] text-primary">
              PetFine
            </Text>

            <View className={cn('mt-9 w-full gap-6', className)}>
              <View className="items-center gap-2">
                <Text className="text-center font-inter-semibold text-base text-ink">{title}</Text>
                {subtitle ? (
                  <Text className="text-center font-inter text-sm text-ink">{subtitle}</Text>
                ) : null}
              </View>
              {children}
            </View>

            {footer ? <View className="mt-8">{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
