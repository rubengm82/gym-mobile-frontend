import { View, Text, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../api/endpoints';
import api from '../../api/api_service';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      api.setAuthToken(null);
      router.replace('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      Alert.alert('Error', 'Error al cerrar sesión');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-800">
      <Text className="text-white">
        Hola {user ? `${user.nombre} ${user.apellido1}` : 'Usuario'}
      </Text>
      <Button title="Logout" onPress={handleLogout} color="#9F6D10" />
    </View>
  );
}
