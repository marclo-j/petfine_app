import type { PostType } from '@/types/domain';

/** Tipos de navegación de la app — una sola fuente para rutas tipadas. */

export type AuthStackParamList = {
  SignIn: undefined;
  Login: undefined;
  Password: { email: string };
  VerifyCode: { email: string };
  ProfileData: { email: string };
};

export type MainTabParamList = {
  Feed: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CreatePost: undefined;
  CreatePostForm: { tipo: PostType };
  ProfileEdit: undefined;
  Chat: { conversationId: string };
  Notifications: undefined;
};
