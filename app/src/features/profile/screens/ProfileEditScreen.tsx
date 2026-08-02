import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMe, useUpdateProfile } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { useNavigation } from '@react-navigation/native';

const profileFormSchema = z.object({
  name: z.string().min(1, { message: 'Ingresa tu nombre' }),
  lastName: z.string().min(1, { message: 'Ingresa tu apellido' }),
  phone: z.string().min(9, { message: 'Ingresa tu celular' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

/** Perfil - Configuración — diseño #37:79: form Nombre/Apellido/Celular + Guardar cambios. */
export function ProfileEditScreen() {
  const navigation = useNavigation();
  const { data: me } = useMe();
  const updateProfile = useUpdateProfile();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileFormSchema) });

  useEffect(() => {
    if (me) reset({ name: me.name, lastName: me.lastName ?? '', phone: me.whatsapp ?? '' });
  }, [me, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateProfile.mutateAsync({
      name: values.name,
      lastName: values.lastName,
      whatsapp: values.phone,
    });
    navigation.goBack();
  });

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center px-6 py-2.5">
        <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={() => navigation.goBack()}>
          <Icon name="chevronLeft" size={24} />
        </Pressable>
        <Text className="ml-3 font-inter-semibold text-xl tracking-[-0.02em] text-ink">
          ¡Hola {me?.name ?? ''}! 👋
        </Text>
      </View>

      <View className="gap-5 px-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Nombre"
              placeholder="Nombre"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.name?.message}
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
              placeholder="+51XXXXXXXXX"
              keyboardType="phone-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.phone?.message}
            />
          )}
        />
        <Button label="Guardar cambios" loading={isSubmitting || updateProfile.isPending} onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}
