import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useConversations, useMessages, useSendMessage } from '@/api/hooks';
import { useAuthStore } from '@/store/auth';
import { Avatar } from '@/components/ui/Avatar';
import { ChatBubble } from '@/components/ChatBubble';
import { Icon } from '@/components/ui/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

/** Pantalla de chat — diseño #1:2165: header, bubbles con rachas y footer input. */
export function ChatScreen({ navigation, route }: Props) {
  const { conversationId } = route.params;
  const user = useAuthStore((s) => s.user);
  const { data: conversations } = useConversations();
  const peer = conversations?.find((c) => c.id === conversationId)?.otherUser;
  const { data, isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (data?.length) listRef.current?.scrollToEnd({ animated: true });
  }, [data]);

  const onSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    sendMessage.mutate(text);
    setDraft('');
  }, [draft, sendMessage]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="h-14 flex-row items-center border-b border-lineLight">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center"
        >
          <Icon name="chevronLeft" size={24} />
        </Pressable>
        <Avatar uri={peer?.avatarUrl} name={peer?.name ?? 'Usuario'} size="md" className="mx-1" />
        <Text className="flex-1 font-inter-semibold text-base text-ink">{peer?.name ?? 'Usuario'}</Text>
        <View className="mr-4">
          <Icon name="phone" size={24} />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#F99139" />
      ) : (
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(m) => m.id}
          contentContainerClassName="gap-0.5 px-4 py-3"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item, index }) => {
            const isMine = item.senderId === user?.id;
            const prev = data?.[index - 1];
            const next = data?.[index + 1];
            const isFirst = !prev || prev.senderId !== item.senderId;
            const isLast = !next || next.senderId !== item.senderId;
            return (
              <View className={isMine ? 'items-end' : 'items-start'}>
                {!isMine && isFirst ? (
                  <Avatar uri={peer?.avatarUrl} name={peer?.name ?? 'Usuario'} size="sm" className="mb-0.5" />
                ) : null}
                <ChatBubble message={item} isMine={isMine} isFirst={isFirst} isLast={isLast} />
              </View>
            );
          }}
        />
      )}

      <View className="border-t border-lineLight px-4 py-2">
        <View className="flex-row items-center gap-4 rounded-lg border border-line px-4 py-2">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#828282"
            multiline
            className="flex-1 font-inter text-sm text-ink"
            onSubmitEditing={onSend}
          />
          <Icon name="image" size={24} />
        </View>
      </View>
    </SafeAreaView>
  );
}
