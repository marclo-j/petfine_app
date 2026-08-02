import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import type { Message } from '@/types/domain';
import { formatChatTimestamp } from '@/lib/format';

export interface ChatBubbleProps {
  message: Message;
  isMine: boolean;
  /** Radios del grupo: primero/último de una racha de bubbles del mismo autor. */
  isFirst: boolean;
  isLast: boolean;
  showTimestamp?: boolean;
}

/**
 * Burbuja de chat — diseño #1:2185: la mía naranja (#F99139) con la esquina
 * inferior derecha 4px, la ajena #E9E9EB con la esquina inferior izquierda
 * 4px pegada al avatar.
 */
export function ChatBubble({ message, isMine, isFirst, isLast, showTimestamp = false }: ChatBubbleProps) {
  const radius = isMine
    ? [
        'rounded-tl-[18px]',
        'rounded-tr-[18px]',
        isLast ? 'rounded-br-[4px]' : 'rounded-br-[18px]',
        isFirst ? 'rounded-bl-[18px]' : 'rounded-bl-[4px]',
      ]
    : [
        'rounded-tl-[18px]',
        'rounded-tr-[18px]',
        isLast ? 'rounded-bl-[4px]' : 'rounded-bl-[18px]',
        isFirst ? 'rounded-br-[18px]' : 'rounded-br-[4px]',
      ];

  return (
    <View className={cn('max-w-[85%]', isMine ? 'self-end' : 'self-start')}>
      <View className={cn('px-3 py-2', radius.join(' '), isMine ? 'bg-primary' : 'bg-surface-placeholder')}>
        {message.photoUrl ? (
          <Image source={message.photoUrl} contentFit="cover" className="mb-1 h-40 w-52 rounded" />
        ) : null}
        {message.content ? (
          <Text className={cn('font-inter text-sm', isMine ? 'text-surface' : 'text-ink')}>
            {message.content}
          </Text>
        ) : null}
      </View>
      {showTimestamp ? (
        <Text className="mt-1 font-inter text-[10px] text-muted">
          {formatChatTimestamp(message.createdAt)}
        </Text>
      ) : null}
    </View>
  );
}
