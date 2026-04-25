import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { observer } from 'mobx-react-lite';
import { QueryProvider } from './src/providers/QueryProvider';
import { StoreProvider, useSessionStore } from './src/stores/StoreContext';
import { RootStore } from './src/stores/RootStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useRealtimeSync } from './src/hooks/useRealtimeSync';
import { colors } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

const store = new RootStore();

const AppShell: React.FC = observer(() => {
  const session = useSessionStore();
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    session.hydrate();
  }, [session]);

  const ready = fontsLoaded && session.isReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useRealtimeSync();

  if (!ready) return <View style={styles.fill} />;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.screenBg} />
      <AppNavigator />
    </>
  );
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <StoreProvider store={store}>
          <QueryProvider>
            <AppShell />
          </QueryProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
});
