import { useState } from 'react';
import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { Post } from '@/types/domain';
import { formatCount, timeAgo } from '@/lib/format';
import { cn } from '@/lib/cn';
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
 * Carrusel de fotos del post — estilo Instagram: swipe horizontal con
 * paginación e indicadores (dots). Con una sola foto renderiza la imagen simple.
 */
function PhotoCarousel({ fotos }: { fotos: string[] }) {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View
      className="mt-3 overflow-hidden rounded"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {fotos.map((foto, index) => (
            <Image
              key={index}
              source={foto}
              contentFit="cover"
              style={{ width, aspectRatio: 1 }}
              accessibilityLabel={`Foto ${index + 1} del post`}
            />
          ))}
        </ScrollView>
      ) : null}

      {fotos.length > 1 ? (
        <View className="absolute bottom-2.5 left-0 right-0 flex-row items-center justify-center gap-1.5">
          {fotos.map((_, index) => (
            <View
              key={index}
              className={cn(
                'h-1.5 rounded-full',
                index === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60',
              )}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Card de post del feed — estructura del Figma (#15:198): avatar + nombre +
 * verbo + tiempo + menú, carrusel de fotos 1:1 (radius 4), descripción,
 * contadores con iconos (patitas/compartidos) y botones por tipo.
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

      <PhotoCarousel fotos={post.fotos} />

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
        </View>

        {postActions[post.tipo].map((label) => (
          <Pill key={label} label={label} size="sm" selected onPress={() => onAction?.(label)} />
        ))}
      </View>
    </View>
  );
}
