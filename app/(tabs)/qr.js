import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalInfo from '../components/ModalInfo';
import QRCode from 'react-native-qrcode-svg';

import { MaterialIcons } from '@expo/vector-icons';

export default function QR() {
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrReservaId, setQrReservaId] = useState('');
  const cargando = useRef(false);
  const [modalCancelar, setModalCancelar]= useState(false);
  const [id_cancelar, setIdCancelar] = useState('');
  const [scannedId, setScannedId] = useState('');
  const debounceRef = useRef(null);

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
    <View className="flex-1 bg-gradient-to-b from-gray-900 to-gray-700">
      <View className = " w-full h-44 p-5 flex flex-col justify-center bg-gradient-to-b from-blue-600 ">
        <Text className="font-bold text-2xl text-amber-400">
          Reservas disponibles
        </Text>
        <Text className =" font-light text-slate-200 text-md">
          Aqui puedes encontrar tus inscripciones a las clases, obten el QR para entrar en ellas
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {reservas.length !== 0 ? (
          reservas.map((reserva) => (
            <View
            key={reserva.id}
            className="bg-gray-800 p-4 mb-4 rounded-2xl shadow-md"
          >

            <View className="flex flex-row justify-between mb-2">
              <Text className="text-white font-semibold text-base">
                {reserva.planificacion?.clase?.nombre ?? 'Clase no disponible'}
              </Text>
              <Text className="text-gray-300 text-sm">
                {reserva.planificacion?.instructor?.nombre ?? 'Sin instructor'}
              </Text>
            </View>
              <Text>
                {reserva.planificacion}
              </Text>
          
            <Text className="text-gray-300 mb-4">
              {reserva.planificacion?.hora_inicio} – {reserva.planificacion?.hora_fin}
            </Text>

            <View className="flex flex-row gap-3">

              <Pressable
                onPress={() => obtenerQR(reserva.id)}
                className="flex-1 flex-row items-center justify-center gap-2 bg-indigo-700 p-3 rounded-xl active:opacity-80"
              >
                <MaterialIcons name="qr-code" color="white" size={22} />
                <Text className="text-white font-bold">
                  Obtener QR
                </Text>
              </Pressable>

              <Pressable
                onPress={() => abrirModal(reserva.id)}
                className="bg-red-600 px-4 rounded-xl justify-center active:opacity-80"
              >
                <Text className="text-white font-bold">
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>

          ))
        ) : (
          <Text className="text-white text-center mt-4 text-xl font-bold">
            No tienes reservas actualmente
          </Text>
        )}
      </ScrollView>

      <ModalInfo
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setQrReservaId('');
          setScannedId('');
        }}
      >
        {qrReservaId !== '' && (
          <>
            <View className="bg-white w-64 h-64 justify-center items-center rounded-lg">
              <Text className="font-bold text-blue-950 text-xl mb-4">
                QR de la reserva #{qrReservaId}
              </Text>
              <QRCode
                value={qrReservaId}
                size={300}
              />
            </View>
            <TextInput
              value={scannedId}
              onChangeText={(text) => {
                setScannedId(text);
                if (debounceRef.current) {
                  clearTimeout(debounceRef.current);
                }
                debounceRef.current = setTimeout(() => {
                  const id = parseInt(text);
                  if (!isNaN(id) && text.length > 0) {
                    confirmarReserva(id).then(() => {
                      setScannedId('');
                      setModalVisible(false);
                    }).catch(error => {
                      alert('Error al confirmar: ' + error.message);
                      setScannedId('');
                    });
                  }
                }, 500);  // Esperar 500ms sin cambios
              }}
              style={{ position: 'absolute', left: -1000, top: -1000, width: 1, height: 1, opacity: 0 }}
              keyboardType="numeric"
              autoFocus
            />
          </>
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
