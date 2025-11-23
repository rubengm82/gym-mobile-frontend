import {
  View,
  TextInput,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

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
          className="mb-4 w-full rounded-xl border border-gray-500 p-3 text-white"
        />

        {/* Input Clave */}
        <TextInput
          placeholder="Clave"
          placeholderTextColor="#777777"
          secureTextEntry
          className="mb-4 w-full rounded-xl border border-gray-500 p-3 text-white"
        />

        {/* Botón */}
        <View className="mt-5 w-full">
          <Button title="Entrar" onPress={() => router.replace('/main')} color="#9F6D10" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
