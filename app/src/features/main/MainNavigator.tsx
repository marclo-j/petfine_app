import { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@/navigation/types';
import { TabBar } from '@/navigation/TabBar';
import { FeedScreen } from '@/features/feed/screens/FeedScreen';
import { NotificationsScreen } from '@/features/notifications/screens/NotificationsScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { useMe } from '@/api/hooks';

const Tab = createBottomTabNavigator<MainTabParamList>();

export interface MainNavigatorProps {
  onCreatePost: () => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
}

/** Tabs principales — TabBar propio del diseño; Create/Vets se resuelven por callback. */
export function MainNavigator({ onCreatePost, onOpenChat, onOpenSettings }: MainNavigatorProps) {
  const { data: me } = useMe();
  const [activeTab, setActiveTab] = useState<keyof MainTabParamList>('Feed');

  const handleTab = (tab: string) => {
    if (tab === 'Create') return onCreatePost();
    if (tab === 'Vets') return; // placeholder del diseño: sin pantalla en Figma
    setActiveTab(tab as keyof MainTabParamList);
  };

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <TabBar activeTab={activeTab} avatarUri={me?.avatarUrl} onNavigate={handleTab} />
      )}
    >
      <Tab.Screen name="Feed">
        {(props) => <FeedScreen {...props} onOpenChat={onOpenChat} />}
      </Tab.Screen>
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onOpenSettings={onOpenSettings} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
