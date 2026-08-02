import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { POST_TYPE_LABEL } from '@/features/create-post/formConfig';
import type { PostType } from '@/types/domain';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const ORDER: PostType[] = ['encontrado', 'adopcion', 'perdido'];

/** Selector de tipo — diseño #15:95: "Nueva publicación" + 3 botones naranjas. */
export function PostTypeScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-4 px-4 py-3">
        <Text className="font-inter-extrabold text-xl tracking-[-0.02em] text-primary">
          Nueva publicación
        </Text>
      </View>

      <View className="items-center px-6 pt-10">
        <View className="w-[239px] gap-4">
          {ORDER.map((tipo) => (
            <Pressable
              key={tipo}
              accessibilityRole="button"
              accessibilityLabel={POST_TYPE_LABEL[tipo]}
              onPress={() => navigation.navigate('CreatePostForm', { tipo })}
              className="h-10 items-center justify-center rounded-lg bg-primary px-4"
            >
              <Text className="font-inter-bold text-sm text-surface">{POST_TYPE_LABEL[tipo]}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
