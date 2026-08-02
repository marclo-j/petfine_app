import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PostType } from '@/types/domain';
import { useFeed } from '@/api/hooks';
import { SegmentedTabs } from '@/components/SegmentedTabs';
import { Icon } from '@/components/ui/Icon';
import { PostCard } from '@/features/feed/components/PostCard';

const FEED_TABS: { value: PostType; label: string }[] = [
  { value: 'perdido', label: 'Perdidos' },
  { value: 'encontrado', label: 'Encontrados' },
  { value: 'adopcion', label: 'Quiero adoptar' },
];

export interface FeedScreenProps {
  onOpenChat: () => void;
}

/** Feed principal — diseño #1:1608: tabs de texto + lista de posts + acceso a chat. */
export function FeedScreen({ onOpenChat }: FeedScreenProps) {
  const [tipo, setTipo] = useState<PostType>('encontrado');
  const { data, isLoading, isError, refetch } = useFeed(tipo);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="py-2.5">
        <SegmentedTabs tabs={FEED_TABS} value={tipo} onChange={setTipo} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir chat"
        onPress={onOpenChat}
        className="absolute right-[15px] top-11 h-10 w-10 items-center justify-center"
      >
        <Icon name="chat" size={40} />
      </Pressable>

      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#F99139" />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Text className="font-inter text-sm text-muted">No se pudo cargar el feed.</Text>
          <Pressable onPress={() => refetch()}>
            <Text className="font-inter-semibold text-sm text-primary">Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(post) => post.id}
          contentContainerClassName="gap-[19px] px-4 pb-24 pt-3"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PostCard post={item} />}
        />
      )}
    </SafeAreaView>
  );
}
