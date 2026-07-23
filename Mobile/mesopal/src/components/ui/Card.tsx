import { Text, TextProps, View, ViewProps } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/theme/ThemeContext';

export const CardTitle = ({ children, className, ...props }: TextProps) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <Text 
      // Combines your default styles, the theme color, and any extra classes passed in
      className={`text-xl font-bold mb-2 ${textColor} ${className || ''}`} 
      {...props}
    >
      {children}
    </Text>
  );
};

export const CardBody = ({ children, className, ...props }: ViewProps) => {
  return (
    <View className={`p-4 ${className || ''}`} {...props}>
      {children}
    </View>
  );
};

export const CardMain = ({ children, className, ...props }: ViewProps) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <View 
      className={`border rounded-xl shadow-sm overflow-hidden mb-4 bg-white dark:bg-[#2b3035] border-gray-200 dark:border-gray-700 ${className || ''}`}
      {...props}
    >
      {children}
    </View>
  );
};

export const Card = Object.assign(CardMain, {
  Body: CardBody,
  Title: CardTitle
});