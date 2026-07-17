import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext'; // Assuming you have a hook for your context
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

  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, theme === 'dark' ? styles.textLight : styles.textDark]}>
        {title}
      </Text>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        // FlatList replaces both <List> from react-window and your custom ListRow mapper
        renderItem={({ item }) => (
          <View style={[
            styles.cardWrapper, 
            theme === 'dark' ? styles.cardDark : styles.cardLight
          ]}>
            <Pressable 
              onPress={() => onClick?.(item)}
              disabled={!onClick} // Disable press animations if no onClick is provided
              style={({ pressed }) => [
                styles.cardBody,
                pressed && onClick && styles.cardPressed
              ]}
            >
              {renderData(item)}
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 15,
    borderRadius: 8,
    // iOS Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Shadow (Elevation)
    elevation: 3, 
  },
  cardBody: {
    padding: 15,
    borderRadius: 8,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardLight: {
    backgroundColor: '#ffffff',
  },
  cardDark: {
    backgroundColor: '#2b3035', // Bootstrap bg-body-tertiary dark equivalent
  },
  textLight: {
    color: '#ffffff',
  },
  textDark: {
    color: '#212529',
  }
});