import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#222', borderTopWidth: 0 },
        tabBarActiveTintColor: '#69C1FF',
      }}>
      <Tabs.Screen
        name="main"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="clases"
        options={{
          title: 'Clases',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fitness-center" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: 'QR',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="qr-code" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
