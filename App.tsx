import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
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
import { FeedScreen } from './src/screens/FeedScreen';
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

  if (!ready) return <View style={styles.fill} />;

  return (
    <SafeAreaView style={styles.fill}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.screenBg} />
      <FeedScreen />
    </SafeAreaView>
  );
});

export default function App() {
  return (
    <StoreProvider store={store}>
      <QueryProvider>
        <AppShell />
      </QueryProvider>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
});
