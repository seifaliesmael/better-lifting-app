import { Link, Slot, router, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import DarkModeButton from '@/components/ui/DarkModeButton';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/theme/ThemeContext';
import { Text, View, Pressable } from 'react-native';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: 'home' as const },
  { href: '/workouts', label: 'View Workouts', icon: 'list' as const },
  { href: '/exercises', label: 'View Exercises', icon: 'list' as const },
  { href: '/tracker', label: 'New Workout', icon: 'plus' as const },
];

export default function WebLayout() {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === 'light';
  const pathname = usePathname();

  return (
    <View className="flex-1 min-h-screen p-4 bg-gray-200 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-4xl font-bold text-gray-900 dark:text-white">
            MesoPal
          </Text>
          <Text className="text-lg italic text-gray-700 dark:text-gray-300">
            A better lifting app
          </Text>
        </View>
        <View className="mr-4">
          <DarkModeButton />
        </View>
      </View>

      {/* Nav and Content */}
      <View className="flex-1 flex-row gap-8">
        {/* Sidebar */}
        <View className="w-56 shrink-0 gap-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} asChild>
                <Pressable
                  className={`flex-row items-center gap-2 rounded-lg px-4 py-3 ${
                    active ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700'
                  }`}
                >
                  <FontAwesome
                    name={item.icon}
                    size={18}
                    color={active ? 'white' : isLight ? '#374151' : '#e2e8f0'}
                  />
                  <Text
                    className={
                      active
                        ? 'text-white font-medium'
                        : 'text-gray-800 dark:text-gray-100 font-medium'
                    }
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}

          <Pressable
            onPress={() => router.push('/auth/logout')}
            className="flex-row items-center gap-2 rounded-lg px-4 py-3 bg-gray-300 dark:bg-slate-700"
          >
            <FontAwesome
              name="sign-out"
              size={18}
              color={isLight ? '#374151' : '#e2e8f0'}
            />
            <Text className="text-gray-800 dark:text-gray-100 font-medium">
              Log Out
            </Text>
          </Pressable>
        </View>

        {/* Page content */}
        <View className="flex-1">
          <Slot />
        </View>
      </View>
    </View>
  );
}