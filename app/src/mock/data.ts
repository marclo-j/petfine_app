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
 * Datos mock realistas (español/Perú) — reemplazables por el backend
 * real cambiando USE_MOCK en src/api/client.ts.
 */

const AVATAR_1 = require('@/assets/icons/avatar-1.png');
const AVATAR_2 = require('@/assets/icons/avatar-2.png');
const AVATAR_PROFILE = require('@/assets/icons/avatar-profile.png');

export const mockUser: User = {
  id: 'u-joaquin',
  name: 'Joaquín',
  avatarUrl: AVATAR_PROFILE,
  whatsapp: '+51999000111',
  bio: 'Amo 💗 y rescato a perritos de la calle.',
};

/** Credenciales de acceso manual mientras no exista la base de datos real. */
export const mockCredentials = {
  email: 'joaquin@gmail.com',
  password: '12345',
};

export const mockUsers: User[] = [
  mockUser,
  { id: 'u-juan', name: 'Juan', avatarUrl: AVATAR_1, whatsapp: '+51999000222' },
  { id: 'u-carla', name: 'Carla', avatarUrl: AVATAR_2, whatsapp: '+51999000333' },
  { id: 'u-helena', name: 'Helena Hills', avatarUrl: AVATAR_1, whatsapp: '+51999000444' },
];

const now = Date.now();
const min = 60_000;

export const mockPosts: Post[] = [
  {
    id: 'p-1',
    tipo: 'encontrado',
    status: 'activo',
    titulo: 'Perro encontrado en San Carlos',
    descripcion:
      'Encontré este perro en San Carlos, Comas. No tiene collar.\nSexo: Macho.\nUbicación: San Carlos, Comas.\nColor/marcas: Blanco con manchas marrones. No tiene cola.\nEstado físico: Tiene una herida en la pata.\nTemperamento observado: Está asustado y con hambre.',
    fotos: [AVATAR_1, AVATAR_2],
    distrito: 'Comas',
    calle: 'San Carlos',
    detalle: {
      sex: 'macho',
      color: 'Blanco con manchas marrones',
      estadoFisico: 'Herida en la pata',
      temperamento: 'Asustado y con hambre',
    },
    author: mockUsers[0],
    likesCount: 21,
    likedByMe: false,
    sharesCount: 4,
    commentsCount: 4,
    createdAt: new Date(now - 3 * min).toISOString(),
  },
  {
    id: 'p-2',
    tipo: 'encontrado',
    status: 'activo',
    titulo: 'Perrito en la avenida principal',
    descripcion: 'Encontré este perro en San Carlos, Comas.',
    fotos: [AVATAR_2],
    distrito: 'Comas',
    calle: 'Av. Principal',
    author: mockUsers[1],
    likesCount: 8,
    likedByMe: true,
    sharesCount: 1,
    commentsCount: 2,
    createdAt: new Date(now - 10 * min).toISOString(),
  },
  {
    id: 'p-3',
    tipo: 'adopcion',
    status: 'activo',
    titulo: 'Luna busca hogar',
    descripcion:
      'Luna es una perrita de 2 años, muy tranquila y cariñosa. Está vacunada y esterilizada.',
    fotos: [AVATAR_1],
    distrito: 'Miraflores',
    calle: 'Calle Portales',
    detalle: {
      sex: 'hembra',
      edad: '2 años',
      raza: 'Mestiza',
      temperamento: 'Tranquila y cariñosa',
      vacunas: 'Completo',
    },
    author: mockUsers[2],
    likesCount: 45,
    likedByMe: false,
    sharesCount: 12,
    commentsCount: 9,
    createdAt: new Date(now - 2 * 60 * min).toISOString(),
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c-1',
    postId: 'p-1',
    postTitulo: 'Perro encontrado en San Carlos',
    otherUser: mockUsers[0],
    lastMessage: 'Hola, ¿sigue con usted el perrito?',
    lastMessageAt: new Date(now - 5 * min).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'c-2',
    postId: 'p-3',
    postTitulo: 'Luna busca hogar',
    otherUser: mockUsers[2],
    lastMessage: 'Sí, puede venir a conocerla el sábado.',
    lastMessageAt: new Date(now - 40 * min).toISOString(),
    unreadCount: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm-1',
    conversationId: 'c-1',
    senderId: 'u-joaquin',
    content: 'Hola, ¿sigue con usted el perrito?',
    photoUrl: null,
    isAuto: false,
    createdAt: new Date(now - 30 * min).toISOString(),
  },
  {
    id: 'm-2',
    conversationId: 'c-1',
    senderId: 'u-juan',
    content: 'Sí, lo tengo en casa. Está asustado pero ya comió.',
    photoUrl: null,
    isAuto: false,
    createdAt: new Date(now - 25 * min).toISOString(),
  },
  {
    id: 'm-3',
    conversationId: 'c-1',
    senderId: 'u-joaquin',
    content: 'Perfecto, ¿en qué zona lo encontró?',
    photoUrl: null,
    isAuto: false,
    createdAt: new Date(now - 6 * min).toISOString(),
  },
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'n-1',
    kind: 'like',
    scope: 'general',
    actorName: 'Juan',
    actorAvatarUrl: AVATAR_1,
    text: 'Le gustó tu publicación',
    createdAt: new Date(now - 2 * min).toISOString(),
    read: false,
  },
  {
    id: 'n-2',
    kind: 'match',
    scope: 'mine',
    actorName: 'PetFine',
    actorAvatarUrl: null,
    text: '¡Alguien publicó un perro compatible con tu reporte en Comas!',
    createdAt: new Date(now - 15 * min).toISOString(),
    read: false,
  },
  {
    id: 'n-3',
    kind: 'comment',
    scope: 'mine',
    actorName: 'Carla',
    actorAvatarUrl: AVATAR_2,
    text: 'Comentó en tu publicación',
    createdAt: new Date(now - 3 * 60 * min).toISOString(),
    read: true,
  },
  {
    id: 'n-4',
    kind: 'share',
    scope: 'general',
    actorName: 'Helena',
    actorAvatarUrl: AVATAR_1,
    text: 'Compartió una publicación que te puede interesar',
    createdAt: new Date(now - 5 * 60 * min).toISOString(),
    read: true,
  },
  {
    id: 'n-5',
    kind: 'follow',
    scope: 'general',
    actorName: 'Juan',
    actorAvatarUrl: AVATAR_1,
    text: 'Comenzó a seguirte',
    createdAt: new Date(now - 6 * 60 * min).toISOString(),
    read: false,
  },
];

/** Simula latencia de red para que los mocks se comporten como el backend. */
export function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/** Simula autenticación y devuelve la sesión del usuario mock. */
export function mockLogin(): AuthSession {
  return { user: { ...mockUser }, token: 'mock-token' };
}

/** Filtra posts por tipo, con los posts de seguidos primero (feed ponderado). */
export function mockFeed(tipo: PostType, userId = mockUser.id): Post[] {
  const byType = mockPosts.filter((p) => p.tipo === tipo && p.status === 'activo');
  return [...byType].sort((a, b) => {
    const aFollowed = a.author.id === userId ? 1 : 0;
    const bFollowed = b.author.id === userId ? 1 : 0;
    if (aFollowed !== bFollowed) return bFollowed - aFollowed;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function mockPostDetail(postId: string): Post | undefined {
  return mockPosts.find((p) => p.id === postId);
}
