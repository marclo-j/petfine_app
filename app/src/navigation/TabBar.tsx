import { BlurView } from 'expo-blur';
import { Pressable, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';

const tabs = [
  { key: 'Feed', icon: 'home', label: 'Inicio' },
  { key: 'Create', icon: 'create', label: 'Publicar' },
  { key: 'Chat', icon: 'chat', label: 'Mensajes' },
  { key: 'Vets', icon: 'vets', label: 'Veterinarias' },
  { key: 'Profile', icon: null, label: 'Perfil' },
] as const;

export interface TabBarProps {
  activeTab: string;
  avatarUri?: string | null;
  onNavigate: (tab: (typeof tabs)[number]['key']) => void;
}

/**
 * Tab bar inferior — fiel al Figma: fondo blanco blur(10px), sombra superior,
 * 5 slots de 75px: Inicio, Publicar (acción), Avisos, Veterinarias, Perfil (avatar).
 */
export function TabBar({ activeTab, avatarUri, onNavigate }: TabBarProps) {
  return (
    <BlurView intensity={10} tint="light" className="border-t border-black/10 bg-white/90">
      <View className="h-[78px] flex-row items-center justify-between px-0 pb-6">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          const onPress = () => onNavigate(tab.key);

          if (tab.key === 'Profile') {
            return (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
                onPress={onPress}
                className="w-[75px] items-center justify-center"
              >
                <Avatar
                  uri={avatarUri}
                  name="M"
                  size="md"
                  className={cn(active && 'border-2 border-primary')}
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              onPress={onPress}
              className="w-[75px] items-center justify-center py-3"
            >
              <Icon
                name={tab.icon as 'home' | 'create' | 'chat' | 'vets'}
                size={tab.key === 'Vets' ? 40 : 24}
                color={active ? '#F99139' : '#000000'}
              />
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}
