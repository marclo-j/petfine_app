import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/auth';
import { getAuthRepository } from '@/api/repos';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { profileDataSchema, type ProfileDataValues } from '@/features/auth/schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileData'>;

/** Datos del perfil (Sign In - 4): nombre, apellido, celular y ¿tienes mascota? */
export function ProfileDataScreen({ route }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileDataValues>({
    resolver: zodResolver(profileDataSchema),
    defaultValues: { firstName: '', lastName: '', phone: '', hasPet: false },
  });

  const hasPet = watch('hasPet');

  const onSubmit = handleSubmit(async (values) => {
    const session = await getAuthRepository().register({
      ...values,
      email: route.params.email,
    });
    signIn(session);
  });

  return (
    <AuthLayout title="Coloca tus datos" subtitle="Necesitamos tus datos para tu perfil.">
      <View className="gap-4">
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Nombre"
              placeholder="Nombre"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.firstName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Primer apellido"
              placeholder="Primer apellido"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.lastName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Número de celular"
              placeholder="+51 999 999 999"
              keyboardType="phone-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.phone?.message}
            />
          )}
        />

        <View className="gap-2">
          <Text className="font-inter-medium text-sm text-ink">¿Tienes mascota?</Text>
          <View className="flex-row gap-4">
            {(['Sí', 'No'] as const).map((option) => {
              const selected = option === 'Sí' ? hasPet : !hasPet;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setValue('hasPet', option === 'Sí')}
                  className={`h-10 flex-1 items-center justify-center rounded-lg border ${
                    selected ? 'border-primary bg-primary' : 'border-line bg-surface'
                  }`}
                >
                  <Text className={`font-inter-semibold text-sm ${selected ? 'text-surface' : 'text-ink'}`}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button label="Registrar" loading={isSubmitting} onPress={onSubmit} />
      </View>
    </AuthLayout>
  );
}
