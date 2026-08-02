import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import type { AuthStackParamList } from '@/navigation/types';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { createPasswordSchema, type CreatePasswordValues } from '@/features/auth/schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'Password'>;

/** Creación de contraseña con checklist de requisitos — diseño Sign In - 3. */
export function PasswordScreen({ navigation, route }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePasswordValues>({ resolver: zodResolver(createPasswordSchema) });

  const onSubmit = handleSubmit(() => {
    navigation.navigate('VerifyCode', { email: route.params.email });
  });

  return (
    <AuthLayout title="Ingresa una contraseña">
      <View className="gap-4">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Contraseña"
              placeholder="Contraseña"
              secureTextEntry
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Repetir contraseña"
              placeholder="Repetir contraseña"
              secureTextEntry
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
            />
          )}
        />
        <View className="gap-1">
          <Text className="font-inter-bold text-[10px] text-ink">Requisitos:</Text>
          <Text className="font-inter text-[10px] leading-snug text-ink">
            - Debe tener <Text className="font-inter-bold">mínimo 8 caracteres de largo.</Text>
            {'\n'}- Debe tener como mínimo <Text className="font-inter-bold">una mayúscula.</Text>
            {'\n'}- Usar como mínimo un <Text className="font-inter-bold">carácter especial.</Text>
            {'\n'}- <Text className="font-inter-bold">No debe contener datos personales</Text> que lo
            puedan identificar.
            {'\n'}- Evita secuencias obvias como{' '}
            <Text className="font-inter-bold">{'\u201C'}12345{'\u201D'} o {'\u201C'}qwerty{'\u201D'}.</Text>
          </Text>
        </View>
        <Button label="Continuar" loading={isSubmitting} onPress={onSubmit} />
      </View>
    </AuthLayout>
  );
}
