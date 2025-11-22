import { View, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import {} from '../../api/endpoints';

export default function Login() {
  const router = useRouter();

  return (
    <View
      className="flex-1 justify-center bg-gray-800 p-5"
      style={{ padding: 20 }} // opcional, si quieres padding extra
    >
      <TextInput placeholder="Usuario" className="mb-4 w-full border border-gray-500 p-2" />
      <TextInput
        placeholder="Clave"
        secureTextEntry
        className="mb-4 w-full border border-gray-500 p-2"
      />
      <View className="mt-10 w-full">
        <Button title="Entrar" onPress={() => router.replace('/main')} color="#9F6D10" />
      </View>
    </View>
  );
}
