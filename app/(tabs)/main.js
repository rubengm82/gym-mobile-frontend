import { View, Text, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../../api/endpoints';
import api from '../../api/api_service';

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      api.setAuthToken(null);
      router.replace('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      Alert.alert('Error', 'Error al cerrar sesión');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-800">
      <Text className="text-white">Hello Home</Text>
      <Button title="Logout" onPress={handleLogout} color="#9F6D10" />
    </View>
  );
}
