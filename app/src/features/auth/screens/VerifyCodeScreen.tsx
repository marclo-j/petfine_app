import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Text, View } from 'react-native';
import type { AuthStackParamList } from '@/navigation/types';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { verificationCodeSchema } from '@/features/auth/schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyCode'>;

/** Verificación por correo — diseño "Ingresa el código de verificación". */
export function VerifyCodeScreen({ navigation, route }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ code: string }>({
    resolver: zodResolver(z.object({ code: verificationCodeSchema })),
  });

  const onSubmit = handleSubmit(() => {
    navigation.navigate('ProfileData', { email: route.params.email });
  });

  return (
    <AuthLayout title="Ingresa el código de verificación" subtitle="El código fue enviado a su correo. Revise, por favor.">
      <View className="gap-4">
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Código"
              placeholder="Ingresar código aquí"
              keyboardType="number-pad"
              maxLength={6}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.code?.message}
            />
          )}
        />
        <Button label="Verificar" loading={isSubmitting} onPress={onSubmit} />

        <Text className="text-center font-inter text-sm text-ink">
          ¿No te llegó el correo?{' '}
          <Text className="font-inter-semibold text-primary">Reenviar código</Text>
        </Text>
      </View>
    </AuthLayout>
  );
}
