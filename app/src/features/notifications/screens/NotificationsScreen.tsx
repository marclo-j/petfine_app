import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useNotifications } from '@/api/hooks';
import { timeAgo } from '@/lib/format';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';

type Scope = 'general' | 'mine';

const SCOPES: { value: Scope; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'mine', label: 'Mis publicaciones' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

/** Notificaciones — diseño #17:360: header naranja, pills de scope, cells 72px. */
export function NotificationsScreen({ navigation }: Props) {
  const [scope, setScope] = useState<Scope>('general');
  const { data, isLoading, isError, refetch } = useNotifications(scope);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="h-14 flex-row items-center border-b border-lineLight px-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => navigation.goBack()}
          className="mr-2 h-10 w-10 items-center justify-center"
        >
          <Icon name="chevronLeft" size={24} />
        </Pressable>
        <Text className="flex-1 font-inter-semibold text-xl tracking-[-0.02em] text-primary">
          Actividad
        </Text>
      </View>

      <View className="flex-row gap-2 px-4">
        {SCOPES.map((s) => (
          <Pill
            key={s.value}
            label={s.label}
            size="lg"
            selected={s.value === scope}
            onPress={() => setScope(s.value)}
          />
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#F99139" />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Text className="font-inter text-sm text-muted">No se pudieron cargar las notificaciones.</Text>
          <Pressable onPress={() => refetch()}>
            <Text className="font-inter-semibold text-sm text-primary">Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(n) => n.id}
          contentContainerClassName="px-4 pb-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="h-[72px] flex-row items-center gap-4">
              <Avatar uri={item.actorAvatarUrl} name={item.actorName} size="lg" />
              <View className="flex-1 gap-0.5">
                <Text className="font-inter text-sm text-black/50">
                  <Text className="font-inter-medium text-sm text-ink">{item.actorName}</Text>{' '}
                  {item.text} · {timeAgo(item.createdAt)}
                </Text>
              </View>
              {item.kind === 'follow' ? (
                <Pressable className="h-8 w-[90px] items-center justify-center rounded-lg bg-ink">
                  <Text className="font-inter-medium text-sm text-surface">Seguir</Text>
                </Pressable>
              ) : null}
              {!item.read ? <View className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
