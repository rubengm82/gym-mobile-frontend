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
      style={{ flex: 1, backgroundColor: '#1f2937' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled">
        {/* Imagen del logo */}
        <Image
          source={require('../../assets/images/logoTransApp.png')}
          style={{ width: 200, height: 52, marginBottom: 20 }}
          resizeMode="stretch"
        />

        {/* Inputs */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#777777"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#6B7280',
            padding: 10,
            marginBottom: 16,
            color: '#ffffff',
            borderRadius: 10,
          }}
        />
        <TextInput
          placeholder="Clave"
          placeholderTextColor="#777777"
          secureTextEntry
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#6B7280',
            padding: 10,
            marginBottom: 16,
            color: '#ffffff',
            borderRadius: 10,
          }}
        />

        {/* Botón */}
        <View style={{ width: '100%', marginTop: 20 }}>
          <Button title="Entrar" onPress={() => router.replace('/main')} color="#9F6D10" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
