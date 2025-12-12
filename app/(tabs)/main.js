import { View, Text } from 'react-native';
import {} from '../../api/endpoints';

export default function Home() {
  return (

    <View className="flex-1 items-center p-6 bg-gradient-to-b from-blue-500 to-blue-800">
      <View className=" mt-3">
        <Text className="text-2xl font-bold text-slate-100"> Bienvenido Nicolas</Text>
      </View>
      {/* Falta hacer componente y ajustar tailwind */}
      {/* View de las ultimas reservas */}

      <View className=" bg-red-200 w-full h-full px-4 mt-9 ">
      {/* principal */}
      <Text className=" mt-8 font-semibold text-lg text-slate-100">
        Tus Reservas
      </Text>
      <View className="bg-green-300 p-2 mt-14">
        {/* Map de las reservas */}




        <View className="h-14 bg-slate-100 rounded-md px-2 flex-row">
          {/* Informacion del map */}
          <View className="bg-purple-300 h-full w-2/3">
          
          </View>
          
          <View className="bg-orange-400 h-full w-1/3">
          
          </View>

        </View>
      
      
      
      </View>

      </View>
    </View>
  );
}
