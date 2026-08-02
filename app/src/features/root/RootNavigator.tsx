import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AuthNavigator } from '@/features/auth/AuthNavigator';
import { MainNavigator } from '@/features/main/MainNavigator';
import { PostTypeScreen } from '@/features/create-post/screens/PostTypeScreen';
import { PostFormScreen } from '@/features/create-post/screens/PostFormScreen';
import { ProfileEditScreen } from '@/features/profile/screens/ProfileEditScreen';
import { ChatScreen } from '@/features/chat/screens/ChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Stack raíz: Auth (sin sesión) o Main (con sesión) + flujos modales. */
export function RootNavigator({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <>
          <Stack.Screen name="Main">
            {(props) => (
              <MainNavigator
                {...props}
                onCreatePost={() => props.navigation.navigate('CreatePost')}
                onOpenChat={() => props.navigation.navigate('Chat', { conversationId: 'c-1' })}
                onOpenSettings={() => props.navigation.navigate('ProfileEdit')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="CreatePost" component={PostTypeScreen} />
          <Stack.Screen name="CreatePostForm" component={PostFormScreen} />
          <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
