import type {
  Conversation,
  Message,
  Post,
  PostType,
} from '@/types/domain';
import {
  delay,
  mockConversations,
  mockCredentials,
  mockFeed,
  mockLogin,
  mockMessages,
  mockNotifications,
  mockPostDetail,
  mockPosts,
  mockUser,
} from '@/mock/data';
import type {
  AuthRepository,
  ChatRepository,
  CreatePostInput,
  FeedRepository,
  NotificationRepository,
  PostRepository,
  UpdateProfileInput,
  UserRepository,
} from '@/api/repositories';

/**
 * Implementación mock de todos los repositorios.
 * Copia los datos para que las mutaciones no contaminen el mock global.
 */

/**
 * Copia profunda de los datos mock. structuredClone falla en web con los
 * ImageSource de require() (tienen métodos), así que se degrada a JSON.
 */
const clone = <T,>(value: T): T => {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value)) as T;
  }
};

export const mockAuthRepository: AuthRepository = {
  async signInWithEmail(email, password) {
    if (email !== mockCredentials.email || password !== mockCredentials.password) {
      throw new Error('Correo o contraseña incorrectos');
    }
    return delay(mockLogin());
  },
  async signInWithGoogle() {
    return delay(mockLogin());
  },
  async verifyCode(email, _code) {
    return delay(mockLogin());
  },
  async register(input) {
    return delay(mockLogin());
  },
};

export const mockFeedRepository: FeedRepository = {
  async getFeed(tipo: PostType) {
    return delay(clone(mockFeed(tipo)));
  },
  async getPost(postId) {
    const post = mockPostDetail(postId);
    if (!post) throw new Error('Post no encontrado');
    return delay(clone(post));
  },
  async getMyPosts() {
    return delay(clone(mockPosts.filter((p) => p.author.id === mockUser.id)));
  },
  async toggleLike(postId) {
    const post = mockPostDetail(postId);
    if (!post) throw new Error('Post no encontrado');
    return delay(clone({ ...post, likedByMe: !post.likedByMe }));
  },
  async share() {
    return delay(undefined);
  },
};

export const mockPostRepository: PostRepository = {
  async createPost(input: CreatePostInput): Promise<Post> {
    const post: Post = {
      id: `p-mock-${Date.now()}`,
      tipo: input.tipo,
      status: 'activo',
      titulo: input.titulo,
      descripcion: input.descripcion,
      fotos: input.fotos,
      distrito: input.distrito,
      calle: input.calle,
      author: clone(mockUser),
      likesCount: 0,
      likedByMe: false,
      sharesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    return delay(post);
  },
};

export const mockUserRepository: UserRepository = {
  async getMe() {
    return delay(clone(mockUser));
  },
  async updateProfile(input: UpdateProfileInput) {
    return delay(clone({ ...mockUser, ...input }));
  },
};

export const mockNotificationRepository: NotificationRepository = {
  async getNotifications(scope) {
    const all = scope ? mockNotifications.filter((n) => n.scope === scope) : mockNotifications;
    return delay(clone(all));
  },
};

export const mockChatRepository: ChatRepository = {
  async getConversations() {
    return delay(clone(mockConversations));
  },
  async getMessages(conversationId) {
    return delay(clone(mockMessages.filter((m) => m.conversationId === conversationId)));
  },
  async sendMessage(conversationId, content) {
    const message: Message = {
      id: `m-mock-${Date.now()}`,
      conversationId,
      senderId: mockUser.id,
      content,
      photoUrl: null,
      isAuto: false,
      createdAt: new Date().toISOString(),
    };
    return delay(message);
  },
  async createConversation(postId) {
    const post = mockPostDetail(postId);
    const conversation: Conversation = {
      id: `c-mock-${Date.now()}`,
      postId,
      postTitulo: post?.titulo ?? 'Publicación',
      otherUser: clone(post?.author ?? mockUser),
      lastMessage: null,
      lastMessageAt: null,
      unreadCount: 0,
    };
    return delay(conversation);
  },
};

export function getAuthRepository(): AuthRepository {
  return mockAuthRepository;
}

export function getFeedRepository(): FeedRepository {
  return mockFeedRepository;
}

export function getPostRepository(): PostRepository {
  return mockPostRepository;
}

export function getUserRepository(): UserRepository {
  return mockUserRepository;
}

export function getNotificationRepository(): NotificationRepository {
  return mockNotificationRepository;
}

export function getChatRepository(): ChatRepository {
  return mockChatRepository;
}
