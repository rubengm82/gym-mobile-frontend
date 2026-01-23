import { View, Text, ScrollView, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalInfo from '../components/ModalInfo';
import QRCode from 'react-native-qrcode-svg';

export default function QR() {
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrReservaId, setQrReservaId] = useState('');
  const cargando = useRef(false);
  const [modalCancelar, setModalCancelar]= useState(false);
  const [id_cancelar, setIdCancelar] = useState('');

  async function cancelarReserva(reservaID) {
    try {
      await fetch(
        `http://localhost:8000/api/reservas/${reservaID}/cancelar`,
        { method: 'POST' }
      );
      setModalCancelar(false);
      cargarDatos();
    } catch {}
  }

  async function obtenerReservasCliente(clienteId) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reservas/cliente/${clienteId}`
      );
      const data = await response.json();
      return data.filter(r => r.fk_id_cliente === clienteId);
    } catch {
      return [];
    }
  }

  const confirmarReserva = async (id_reserva) => {
    const response = await fetch(
      `http://localhost:8000/api/reservas/${id_reserva}/confirmada`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    if (!response.ok) throw new Error();
    return await response.json();
  };

  const obtenerQR = async (id_reserva) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reservas/${id_reserva}`
      );
      if (!response.ok) return;

      const data = await response.json();
      setQrReservaId(String(data.id));
      setModalVisible(true);

      await confirmarReserva(id_reserva);
      cargarDatos();
    } catch {}
  };

  function abrirModal(reserva_id){
    console.log(reserva_id);
    setModalCancelar(true);
    setIdCancelar(reserva_id);
  }

  const cargarDatos = async () => {
    if (!user || cargando.current) return;
    cargando.current = true;
    const reservasData = await obtenerReservasCliente(user.id);
    setReservas(reservasData);
    cargando.current = false;
  };

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    cargarDatos();
  }, [user]);

  useFocusEffect(
      useCallback(() => {
        if (!user) return;
        cargarDatos();
        return () => {
          cargando.current = false;
        };
      }, [user])
    );

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-900 to-gray-700 px-6">
      <Text className="text-2xl font-bold text-white mb-4 mt-6">
        Tus clases
      </Text>

      <ScrollView className="flex-1">
        {reservas.length !== 0 ? (
          reservas.map((reserva) => (
            <View key={reserva.id} className="bg-gray-700 p-4 mb-3 rounded-lg">
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
                  onPress={() => abrirModal(reserva.id)}
                  className="mt-3 p-3 rounded-lg w-1/4 bg-red-500"
                >
                  <Text className="text-white text-center font-bold">
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-white text-center mt-4">
            No tienes reservas
          </Text>
        )}
      </ScrollView>

      <ModalInfo
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setQrReservaId('');
        }}
      >
        {qrReservaId !== '' && (
          <View className="bg-white w-64 h-64 justify-center items-center rounded-lg">
            <Text className="font-bold text-blue-950 text-xl mb-4">
              Pasa
            </Text>
            <QRCode value={qrReservaId} size={300} />
          </View>
        )}
      </ModalInfo>

      <ModalInfo
        visible={modalCancelar}
        onClose={()=>{
          setModalCancelar(false);
          setIdCancelar('');
        }}
      >
        <View className=" w-full h-40 justify-center items-center rounded-lg">
            <Text className="font-bold text-center text-xl mb-2">
              Estas seguro de que quieres cancelar la reserva
            </Text>
            <Pressable
                  onPress={() => cancelarReserva(id_cancelar)}
                  className="mt-3 p-3 rounded-lg w-full bg-red-500"
                >
                  <Text className="text-white text-center font-bold">
                    Cancelar
                  </Text>
            </Pressable>
          </View>

      </ModalInfo>
    </View>
  );
}
