import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalInfo from '../components/ModalInfo';
import QRCode from 'react-native-qrcode-svg';

export default function QR() {
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrReservaId, setQrReservaId] = useState('');


  //Funcion para cancelar la reserva
  async function cancelarReserva(reservaID) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reservas/${reservaID}/cancelar`,
        { method: 'POST' }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error al cancelar:', error);
    }
  }

  //Funcion para obtener las reservas del cliente actual
  async function obtenerReservasCliente(clienteId) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reservas/cliente/${clienteId}`
      );
      const data = await response.json();
      return data.filter(r => r.fk_id_cliente === clienteId);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  //Funcion para devolver el estado a 2 en la BBDD


  //Funcion para mostrar el Qr de la reserva

  const obtenerQR = async (id_reserva) => {
  try {
    // Llamada a la API
    const response = await fetch(`http://localhost:8000/api/reservas/${id_reserva}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener la reserva');
    }

    const data = await response.json();

    // Convertimos a string antes de guardar en el estado
    const qrIdString = String(data.id);
    setQrReservaId(qrIdString);

    // console.log muestra el valor real
    console.log('QR VALUE from API:', data.id);
    console.log('QR VALUE in state (string):', qrIdString);

    // Mostramos el modal solo después de tener el valor
    setModalVisible(true);

  } catch (error) {
    console.error('Error al obtener QR:', error);
    // Puedes mostrar alerta o mensaje al usuario aquí
  }
};


  const cargarDatos = async () => {
     const reservasData = await obtenerReservasCliente(user.id);
     setReservas(reservasData);
  };

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    cargarDatos();
    console.log("se refresco")
  }, [user]);

 

  return (
    <View className="flex-1 bg-gray-800">
      <ScrollView className="flex-1 p-4">
        <Text className="text-white text-xl mb-4">
          Reservas del cliente
        </Text>

        {reservas.map((reserva) => (
          <View
            key={reserva.id}
            className="bg-gray-700 p-4 mb-3 rounded-lg"
          >
            <View className="flex flex-row justify-between">
              <Text className="text-white">
                Clase: {reserva.planificacion?.clase?.nombre ?? 'No disponible'}
              </Text>
              <Text className="text-white">
                Instructor: {reserva.planificacion?.instructor?.nombre ?? 'No disponible'}
              </Text>
            </View>

            <Text className="text-white">
              Hora: {reserva.planificacion?.hora_inicio} - {reserva.planificacion?.hora_fin}
            </Text>

            <View className="flex flex-row w-full justify-around">
              <Pressable
                onPress={() => obtenerQR(reserva.id)}
                className="mt-3 p-3 rounded-lg w-3/5 bg-blue-500"
              >
                <Text className="text-white text-center font-bold">
                  Obtener QR
                </Text>
              </Pressable>

              <Pressable
                onPress={() => cancelarReserva(reserva.id)}
                className="mt-3 p-3 rounded-lg w-1/4 bg-red-500"
              >
                <Text className="text-white text-center font-bold">
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <ModalInfo
  visible={modalVisible}
  onClose={() => {
    setModalVisible(false);
    setQrReservaId('');
  }}
>
  {qrReservaId !== '' && (
    <>
      <Text className="text-white text-xl mb-4">
        QR de la reserva #{qrReservaId}
      </Text>

      <View className="bg-white w-64 h-64 justify-center items-center rounded-lg">
        <QRCode 
          value={qrReservaId}
          size={300}
        />
      </View>
    </>
  )}
</ModalInfo>
    </View>
  );
}
