import { View, Text, FlatList, Pressable } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useContext } from 'react';

interface DisplayObject {
  id: number;
}

interface Props<T extends DisplayObject> {
  data: T[];
  title: string;
  onClick?: (item: T) => void;
  renderData: (item: T) => React.ReactNode;
}

export const ListRender = <T extends DisplayObject>({
  data,
  title,
  renderData,
  onClick,
}: Props<T>) => {
  const { theme } = useContext(ThemeContext);

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#212529]';
  const cardBg = isDark ? 'bg-[#2b3035]' : 'bg-white';

  return (
    <View className="flex-1">
      <Text className={`text-2xl font-bold text-center my-4 ${textColor}`}>
        {title}
      </Text>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="px-5 pb-5" 
        renderItem={({ item }) => (
          <View className={`mb-4 rounded-lg shadow-sm shadow-black/10 elevation-3 ${cardBg}`}>
            <Pressable 
              onPress={() => onClick?.(item)}
              disabled={!onClick}
              className={`p-4 rounded-lg ${onClick ? 'active:opacity-70' : ''}`}
            >
              {renderData(item)}
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};