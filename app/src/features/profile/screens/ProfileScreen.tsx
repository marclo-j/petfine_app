import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMe, useMyPosts } from '@/api/hooks';
import { useAuthStore } from '@/store/auth';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { PostCard } from '@/features/feed/components/PostCard';

export interface ProfileScreenProps {
  onOpenSettings: () => void;
}

/** Perfil personal — diseño #37:228: saludo, avatar 133 con "Editar foto" y mis posts. */
export function ProfileScreen({ onOpenSettings }: ProfileScreenProps) {
  const user = useAuthStore((s) => s.user);
  const { data: me } = useMe();
  const { data: myPosts, isLoading } = useMyPosts();
  const profile = me ?? user;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center px-6 py-2.5">
        <Text className="flex-1 font-inter-semibold text-2xl tracking-[-0.02em] text-ink">
          ¡Hola {profile?.name ?? ''}! 👋
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir configuración"
          onPress={onOpenSettings}
        >
          <Icon name="more" size={24} />
        </Pressable>
      </View>

      <View className="items-center py-4">
        <Avatar uri={profile?.avatarUrl} name={profile?.name} size="xl" />
        <Text className="mt-2 font-inter-semibold text-xs tracking-[-0.02em] text-primary">
          Editar foto
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#F99139" />
      ) : (
        <FlatList
          data={myPosts}
          keyExtractor={(p) => p.id}
          contentContainerClassName="gap-[19px] px-4 pb-24"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PostCard post={item} />}
        />
      )}
    </SafeAreaView>
  );
}
