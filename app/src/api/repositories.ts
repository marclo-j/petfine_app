import type {
  AppNotification,
  AuthSession,
  Conversation,
  Message,
  Post,
  PostType,
  User,
} from '@/types/domain';

/**
 * Contratos de datos por feature. Las pantallas dependen de estas
 * interfaces, no de la implementación: cuando exista el backend,
 * se agrega un repositorio real y se cambia en api/index.ts.
 */

export interface RegisterInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  hasPet: boolean;
}

export interface AuthRepository {
  signInWithEmail(email: string): Promise<AuthSession>;
  signInWithGoogle(): Promise<AuthSession>;
  verifyCode(email: string, code: string): Promise<AuthSession>;
  register(input: RegisterInput): Promise<AuthSession>;
}

export interface FeedRepository {
  getFeed(tipo: PostType): Promise<Post[]>;
  getPost(postId: string): Promise<Post>;
  getMyPosts(): Promise<Post[]>;
  toggleLike(postId: string): Promise<Post>;
  share(postId: string): Promise<void>;
}

export interface PostRepository {
  createPost(input: CreatePostInput): Promise<Post>;
}

export interface UserRepository {
  getMe(): Promise<User>;
  updateProfile(input: UpdateProfileInput): Promise<User>;
}

export interface NotificationRepository {
  getNotifications(scope?: 'general' | 'mine'): Promise<AppNotification[]>;
}

export interface ChatRepository {
  getConversations(): Promise<Conversation[]>;
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, content: string): Promise<Message>;
  createConversation(postId: string): Promise<Conversation>;
}

export interface CreatePostInput {
  tipo: PostType;
  titulo: string;
  descripcion: string;
  fotos: string[];
  calle: string;
  distrito: string;
  whatsapp?: string;
}

export interface UpdateProfileInput {
  name?: string;
  lastName?: string;
  bio?: string;
  whatsapp?: string;
  avatarUrl?: string;
}
