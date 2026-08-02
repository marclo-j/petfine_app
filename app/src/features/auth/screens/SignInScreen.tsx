import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/auth';
import { getAuthRepository } from '@/api/repos';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { GoogleButton } from '@/features/auth/components/GoogleButton';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { signInSchema, type SignInValues } from '@/features/auth/schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

/** Registro: "Crear nueva cuenta" — email + Continuar, o Google. */
export function SignInScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(({ email }) => {
    navigation.navigate('Password', { email });
  });

  const onGoogle = async () => {
    const session = await getAuthRepository().signInWithGoogle();
    signIn(session);
  };

  return (
    <AuthLayout
      title="Crear nueva cuenta"
      subtitle="Introduce tu correo electrónico para registrarte"
      footer={
        <Text className="text-center font-inter text-xs text-muted">
          Al hacer clic en continuar, aceptas nuestros{' '}
          <Text className="font-inter-semibold text-ink">Términos de servicio</Text> y nuestra{' '}
          <Text className="font-inter-semibold text-ink">Política de privacidad.</Text>
        </Text>
      }
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Correo electrónico"
              placeholder="correo@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        <Button label="Continuar" loading={isSubmitting} onPress={onSubmit} />
      </View>

      <Divider label="or" />

      <GoogleButton label="Continuar con Google" onPress={onGoogle} />

      <Text className="text-center font-inter text-sm text-ink">
        ¿Ya tienes cuenta?{' '}
        <Text className="font-inter-semibold text-primary" onPress={() => navigation.navigate('Login')}>
          Inicia sesión
        </Text>
      </Text>
    </AuthLayout>
  );
}
