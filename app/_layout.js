import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <StatusBar style="light" hidden={false} />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
