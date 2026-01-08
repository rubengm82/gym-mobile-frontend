import { View, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../api/endpoints';
import api from '../../api/api_service';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // CARGA lOS DATOS DEL USUARIO LOGEADO
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

  // HORA
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // SI NO ESTA LOGEADO CON TOKEN VUELVE A LOGIN
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
    <View className="flex-1 bg-gradient-to-b from-gray-900 to-gray-700 px-6">
      <View className="flex-row justify-end pt-12">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#125980] px-4 py-2 rounded-lg shadow-lg flex-row items-center"
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Salir</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 items-center justify-center">
        <Image
          source={require('../../assets/images/logoTransApp.png')}
          style={{ width: 350, height: 91 }}
          className="mb-6"
          resizeMode="contain"
        />
        <Text className="text-white text-2xl font-bold mb-1 text-center">
          ¡Bienvenido!
        </Text>
        <Text className="text-gray-300 text-3xl mb-8 text-center">
          {user ? `${user.nombre} ${user.apellido1}` : 'Usuario'}
        </Text>
      </View>
      <View className="items-center pb-6">
        <Text className="text-gray-400 text-lg mb-2 text-center">
          {currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        <Text className="text-gray-400 text-6xl text-center">
          {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}
