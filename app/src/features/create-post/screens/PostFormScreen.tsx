import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useCreatePost } from '@/api/hooks';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { PhotoPickerGrid } from '@/components/PhotoPickerGrid';
import { Pill } from '@/components/ui/Pill';
import {
  defaultPostFormValues,
  POST_TYPE_LABEL,
  postFormConfig,
  postFormSchema,
  type PostFormValues,
} from '@/features/create-post/formConfig';
import type { Sex } from '@/types/domain';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePostForm'>;

/** Campo del formulario — diseño: label Medium 12, input 30px (69px multilinea), radius 8. */
function FormField({
  label,
  placeholder,
  multiline,
  className,
  ...rest
}: {
  label: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  value?: string;
  onChangeText?: (v: string) => void;
}) {
  return (
    <View className={cn('gap-2', className)}>
      {label ? <Text className="font-inter-medium text-xs text-ink">{label}</Text> : null}
      <View className={cn('rounded-lg border border-line bg-surface px-[9px] py-2', multiline && 'h-[69px]')}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#828282"
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          className="flex-1 font-inter text-xs text-ink"
          {...rest}
        />
      </View>
    </View>
  );
}

/** Formulario de publicación — diseño #30:868: config por tipo, secciones dinámicas. */
export function PostFormScreen({ navigation, route }: Props) {
  const { tipo } = route.params;
  const sections = postFormConfig[tipo];
  const createPost = useCreatePost();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    defaultValues: defaultPostFormValues,
    resolver: zodResolver(postFormSchema),
  });

  const fotos = watch('fotos');
  const sexo = watch('sexo');
  const vacunas = watch('vacunas');

  const onSubmit = handleSubmit(async (values) => {
    await createPost.mutateAsync({
      tipo,
      titulo: `${POST_TYPE_LABEL[tipo]} en ${values.ubicacion || values.ubicacionEncontrado || 'tu zona'}`,
      descripcion: values.descripcion,
      fotos: values.fotos.filter((f): f is string => Boolean(f)),
      calle: values.ubicacionEncontrado || values.ubicacion || values.zonaPerdido || '',
      distrito: '',
    });
    navigation.popToTop();
  });

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <View className="flex-row items-center gap-4 px-4 py-3">
        <Text className="font-inter-extrabold text-xl tracking-[-0.02em] text-primary">
          Nueva publicación
        </Text>
      </View>

      <Text className="px-4 font-inter-semibold italic text-[13px] tracking-[-0.02em] text-ink">
        {POST_TYPE_LABEL[tipo]}
      </Text>

      <ScrollView contentContainerClassName="gap-4 px-4 pb-6 pt-4" showsVerticalScrollIndicator={false}>
        {sections.map((section, index) => {
          if (section.kind === 'photos') {
            return (
              <View key={index} className="gap-3">
                <PhotoPickerGrid photos={fotos} onChange={(next) => setValue('fotos', next)} />
                <Text className="text-center font-inter-medium text-xs text-ink">
                  Agrega fotos para la publicación (min. 1 - máx 3)
                </Text>
                {errors.fotos ? (
                  <Text className="text-center font-inter text-xs text-red-500">
                    {errors.fotos.message}
                  </Text>
                ) : null}
              </View>
            );
          }

          if (section.kind === 'sexo') {
            return (
              <View key={index} className="gap-2">
                <Text className="font-inter-medium text-xs text-ink">¿Hembra o macho?</Text>
                <View className="flex-row gap-2">
                  {(['macho', 'hembra'] as const).map((option) => {
                    const label: Record<Sex, string> = { macho: 'Macho', hembra: 'Hembra' };
                    return (
                      <Pill
                        key={option}
                        label={label[option]}
                        size="sm"
                        variant="outline"
                        selected={sexo === option}
                        onPress={() => setValue('sexo', sexo === option ? null : option)}
                        className="flex-1"
                      />
                    );
                  })}
                </View>
              </View>
            );
          }

          if (section.kind === 'vacunas') {
            return (
              <View key={index} className="gap-2">
                <Text className="font-inter-medium text-xs text-ink">
                  Vacunado/desparasitado/esterilizado
                </Text>
                <View className="flex-row items-end gap-2">
                  <Controller
                    control={control}
                    name="vacunas"
                    render={({ field: { onChange, value } }) => (
                      <FormField
                        label=""
                        placeholder="(¿Qué vacuna?)"
                        className="flex-1"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  <Pill
                    label="Agregar vacuna"
                    size="sm"
                    selected
                    onPress={() => setValue('vacunas', `${vacunas} vacunado `)}
                  />
                </View>
              </View>
            );
          }

          return (
            <View key={index} className="gap-2">
              {section.fields.map((field) => (
                <Controller
                  key={field.name}
                  control={control}
                  name={field.name as keyof PostFormValues}
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      label={field.label}
                      placeholder={field.placeholder}
                      multiline={field.multiline}
                      className={field.flex ?? 'flex-1'}
                      value={(value as string) ?? ''}
                      onChangeText={onChange}
                    />
                  )}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

      <View className="flex-row gap-4 border-t border-lineLight px-4 py-3">
        <Button
          label="Cancelar"
          variant="dark"
          className="flex-1"
          onPress={() => navigation.goBack()}
        />
        <Button label="Publicar" className="flex-1" loading={isSubmitting} onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}
