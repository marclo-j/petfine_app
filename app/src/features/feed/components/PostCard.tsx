import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import type { Post } from '@/types/domain';
import { formatCount, timeAgo } from '@/lib/format';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';

/** Verbos del feed según tipo — textos del Figma (variante "encontró un perro"). */
export const postVerb: Record<Post['tipo'], string> = {
  encontrado: 'encontró un perro',
  perdido: 'perdió a su perro',
  adopcion: 'está en adopción',
};

/**
 * Botones contextuales por tipo. El Figma solo define las acciones del post
 * "encontrado" ("¡Es mi perro!" + "¡Quiero adoptar!"); los demás reutilizan
 * esos textos según semántica: perdido → reclamar, adopción → adoptar.
 */
export const postActions: Record<Post['tipo'], string[]> = {
  perdido: ['¡Es mi perro!'],
  encontrado: ['¡Es mi perro!', '¡Quiero adoptar!'],
  adopcion: ['¡Quiero adoptar!'],
};

export interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onAction?: (label: string) => void;
  onMore?: () => void;
  className?: string;
}

/**
 * Card de post del feed — estructura del Figma (#15:198): avatar + nombre +
 * verbo + tiempo + menú, foto 299×299 (radius 4), descripción, contadores
 * con iconos (patitas/compartidos/comentarios) y botones por tipo.
 */
export function PostCard({ post, onPress, onAction, onMore, className }: PostCardProps) {
  return (
    <View className={className}>
      <View className="flex-row items-center gap-2">
        <Avatar uri={post.author.avatarUrl} name={post.author.name} size="md" />
        <View className="flex-1">
          <View className="flex-row items-baseline gap-1">
            <Text className="font-inter-semibold text-sm text-ink">{post.author.name}</Text>
            <Text className="font-inter text-sm text-ink">{postVerb[post.tipo]}</Text>
          </View>
          <Text className="font-inter text-xs text-muted">{timeAgo(post.createdAt)}</Text>
        </View>
        {onMore ? <Icon name="more" size={24} /> : null}
      </View>

      <Image
        source={post.fotos[0]}
        contentFit="cover"
        className="mt-3 aspect-square w-full rounded"
        accessibilityLabel="Foto del post"
      />

      <View className="gap-2">
        <Text className="font-inter text-xs leading-snug text-ink">{post.descripcion}</Text>

        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Icon name="heart" size={16} />
            <Text className="font-inter-medium text-[10px] text-ink">
              {formatCount(post.likesCount, 'patitas')}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Icon name="repost" size={16} />
            <Text className="font-inter-medium text-[10px] text-ink">
              {formatCount(post.sharesCount, 'compartidos')}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Icon name="comments" size={16} />
            <Text className="font-inter-medium text-[10px] text-ink">
              {formatCount(post.commentsCount, 'comentarios')}
            </Text>
          </View>
        </View>

        {postActions[post.tipo].map((label) => (
          <Pill key={label} label={label} size="sm" selected onPress={() => onAction?.(label)} />
        ))}
      </View>
    </View>
  );
}
