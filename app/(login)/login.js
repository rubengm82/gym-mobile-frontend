import {
  View,
  TextInput,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { login } from '../../api/endpoints';
import api from '../../api/api_service';

export default function Login() {
  const router = useRouter();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(mail, password);
      api.setAuthToken(response.token);
      router.replace('/main');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      Alert.alert('Error', 'Credenciales incorrectas o error de conexión');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-800"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="flex-grow justify-center items-center p-5">
        {/* Logo */}
        <Image
          source={require('../../assets/images/logoTransApp.png')}
          style={{ width: 250, height: 65 }}
          className="mb-5"
          resizeMode="stretch"
        />

        {/* Input Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#777777"
          keyboardType="email-address"
          autoCapitalize="none"
          value={mail}
          onChangeText={setMail}
          className="mb-4 w-full rounded-xl border border-gray-500 p-3 text-white"
        />

        {/* Input Clave */}
        <TextInput
          placeholder="Clave"
          placeholderTextColor="#777777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="mb-4 w-full rounded-xl border border-gray-500 p-3 text-white"
        />

        {/* Botón */}
        <View className="mt-5 w-full">
          <Button title="Entrar" onPress={handleLogin} color="#9F6D10" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
