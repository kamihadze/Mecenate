import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackHeaderLeftProps,
} from '@react-navigation/native-stack';
import { BackIcon } from '../components/icons/BackIcon';
import { FeedScreen } from '../screens/FeedScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { colors } from '../theme/tokens';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HeaderBack: React.FC<NativeStackHeaderLeftProps> = ({ canGoBack }) => {
  const navigation = useNavigation();
  if (!canGoBack) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Назад"
      hitSlop={12}
      style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
      onPress={() => navigation.goBack()}
    >
      <BackIcon color={colors.textPrimary} />
    </Pressable>
  );
};

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.screenBg },
      }}
    >
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackVisible: false,
          headerShadowVisible: false,
          headerLeft: (props) => <HeaderBack {...props} />,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPressed: {
    opacity: 0.5,
  },
});
