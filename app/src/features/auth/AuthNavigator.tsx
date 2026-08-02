import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { SignInScreen } from '@/features/auth/screens/SignInScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { PasswordScreen } from '@/features/auth/screens/PasswordScreen';
import { VerifyCodeScreen } from '@/features/auth/screens/VerifyCodeScreen';
import { ProfileDataScreen } from '@/features/auth/screens/ProfileDataScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Stack de autenticación — sin header, el diseño de cada pantalla lo incluye. */
export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Password" component={PasswordScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ProfileData" component={ProfileDataScreen} />
    </Stack.Navigator>
  );
}
