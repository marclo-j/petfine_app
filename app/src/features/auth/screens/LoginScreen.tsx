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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

/** Login: "Iniciar sesión" — email + contraseña, o Google. */
export function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    const session = await getAuthRepository().signInWithEmail(email);
    signIn(session);
  });

  const onGoogle = async () => {
    const session = await getAuthRepository().signInWithGoogle();
    signIn(session);
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Coloca tus datos para iniciar sesión."
      footer={
        <Text className="text-center font-inter text-xs text-muted">
          Al hacer clic en iniciar sesión, aceptas nuestros{' '}
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
        <TextField label="Contraseña" placeholder="•••••••••••" secureTextEntry />
        <Button label="Iniciar sesión" loading={isSubmitting} onPress={onSubmit} />
      </View>

      <Divider label="or" />

      <GoogleButton label="Iniciar con Google" onPress={onGoogle} />

      <Text className="text-center font-inter text-sm text-ink">
        ¿Aún no tienes cuenta?{' '}
        <Text className="font-inter-semibold text-primary" onPress={() => navigation.navigate('SignIn')}>
          Regístrate
        </Text>
      </Text>
    </AuthLayout>
  );
}
