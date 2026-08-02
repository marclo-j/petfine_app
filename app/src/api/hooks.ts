import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PostType } from '@/types/domain';
import {
  getChatRepository,
  getFeedRepository,
  getNotificationRepository,
  getPostRepository,
  getUserRepository,
} from '@/api/repos';

/** Claves de query centralizadas — única fuente para invalidar/cachear. */
export const queryKeys = {
  feed: (tipo: PostType) => ['feed', tipo] as const,
  post: (id: string) => ['post', id] as const,
  me: ['me'] as const,
  notifications: (scope?: string) => ['notifications', scope ?? 'all'] as const,
  conversations: ['conversations'] as const,
  messages: (id: string) => ['messages', id] as const,
};

export function useFeed(tipo: PostType) {
  return useQuery({
    queryKey: queryKeys.feed(tipo),
    queryFn: () => getFeedRepository().getFeed(tipo),
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: queryKeys.post(postId),
    queryFn: () => getFeedRepository().getPost(postId),
    enabled: Boolean(postId),
  });
}

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getFeedRepository().toggleLike(postId),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.post(postId), updated);
      queryClient.setQueriesData(
        { queryKey: ['feed'] },
        (old: unknown) =>
          Array.isArray(old) ? old.map((p) => (p.id === postId ? updated : p)) : old,
      );
    },
  });
}

export function useShare(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getFeedRepository().share(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<ReturnType<typeof getPostRepository>['createPost']>[0]) =>
      getPostRepository().createPost(input),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.setQueryData(queryKeys.post(post.id), post);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => getUserRepository().getMe(),
  });
}

export function useMyPosts() {
  return useQuery({
    queryKey: ['my-posts'],
    queryFn: () => getFeedRepository().getMyPosts(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name?: string; lastName?: string; bio?: string; whatsapp?: string }) =>
      getUserRepository().updateProfile(input),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.me, user);
    },
  });
}

export function useNotifications(scope?: 'general' | 'mine') {
  return useQuery({
    queryKey: queryKeys.notifications(scope),
    queryFn: () => getNotificationRepository().getNotifications(scope),
  });
}

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => getChatRepository().getConversations(),
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: () => getChatRepository().getMessages(conversationId),
    enabled: Boolean(conversationId),
    refetchInterval: 5000,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => getChatRepository().sendMessage(conversationId, content),
    onSuccess: (message) => {
      queryClient.setQueryData(queryKeys.messages(conversationId), (old: unknown) =>
        Array.isArray(old) ? [...old, message] : [message],
      );
    },
  });
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: (postId: string) => getChatRepository().createConversation(postId),
  });
}
