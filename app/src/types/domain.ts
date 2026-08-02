/** Tipos de dominio compartidos — reflejan el esquema de stack_tecnologico.md y el diseño. */

export type PostType = 'perdido' | 'encontrado' | 'adopcion';

export type PostStatus = 'activo' | 'pausado' | 'resuelto' | 'oculto';

export type Sex = 'macho' | 'hembra';

export interface User {
  id: string;
  name: string;
  lastName?: string;
  avatarUrl: string | null;
  whatsapp: string | null;
  bio?: string;
}

export interface AuthorStats {
  followersCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
}

export interface PostAuthor extends User {
  isMine?: boolean;
}

export interface Post {
  id: string;
  tipo: PostType;
  status: PostStatus;
  titulo: string;
  descripcion: string;
  fotos: string[];
  distrito: string;
  calle: string;
  /** Sexo, edad, tamaño, raza, color/marcas, temperamento — campos según tipo. */
  detalle?: PostDetail;
  author: PostAuthor;
  likesCount: number;
  likedByMe: boolean;
  sharesCount: number;
  commentsCount: number;
  createdAt: string;
}

/** Campos específicos de cada tipo de post (formulario configurable). */
export interface PostDetail {
  sex?: Sex;
  edad?: string;
  tamano?: string;
  raza?: string;
  color?: string;
  temperamento?: string;
  estadoFisico?: string;
  fechaHora?: string;
  zonaPerdido?: string;
  recompensa?: string;
  requisitos?: string;
  vacunas?: string;
  ubicacionEncontrado?: string;
}

export interface Conversation {
  id: string;
  postId: string;
  postTitulo: string;
  otherUser: User;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export type MessageKind = 'text' | 'photo';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  photoUrl: string | null;
  isAuto: boolean;
  createdAt: string;
}

export type NotificationKind = 'follow' | 'like' | 'comment' | 'share' | 'match' | 'system';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  /** scope del diseño: "General" | "Mis publicaciones" */
  scope: 'general' | 'mine';
  actorName: string;
  actorAvatarUrl: string | null;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
}
