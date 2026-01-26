import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'http://localhost:8000/api';

function getDayName(day) {
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  return days[day];
}

async function obtenerPlanificaciones(dia) {
  try {
    const response = await fetch(`${BASE_URL}/planificaciones`);
    const datos = await response.json();
    return datos.planificaciones
      ? datos.planificaciones.filter(p => p.dia === dia)
      : [];
  } catch {
    return [];
  }
}

async function obtenerReservasCliente(clienteId) {
  try {
    const response = await fetch(`${BASE_URL}/reservas/cliente/${clienteId}`);
    const reservas = await response.json();
    return reservas.map(r => r.fk_id_planificacion);
  } catch {
    return [];
  }
}

export default function Clases() {
  const [day, setDay] = useState('');
  const [clases, setClases] = useState([]);
  const [user, setUser] = useState(null);
  const [reservadas, setReservadas] = useState([]);

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [idClaseSeleccionada, setIdClaseSeleccionada] = useState(null);

  const cargando = useRef(false);

  const cargarDatos = async () => {
    if (!user || cargando.current) return;
    cargando.current = true;

    const hoy = new Date();
    const dia = getDayName(hoy.getDay());
    setDay(dia);

    const [clasesData, reservasData] = await Promise.all([
      obtenerPlanificaciones(dia),
      obtenerReservasCliente(user.id),
    ]);

    setClases(clasesData);
    setReservadas(reservasData);
    cargando.current = false;
  };

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));
    };
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user) cargarDatos();
      return () => (cargando.current = false);
    }, [user])
  );

  const reservarClase = async () => {
    if (!user || !idClaseSeleccionada) return;

    const payload = {
      fk_id_planificacion: idClaseSeleccionada,
      fk_id_cliente: user.id,
      fecha_reserva: new Date().toISOString().split('T')[0],
      estado: '1',
    };

    try {
      const response = await fetch(`${BASE_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModalConfirmar(false);
        setIdClaseSeleccionada(null);
        cargarDatos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModalConfirmacion = (idClase) => {
    setIdClaseSeleccionada(idClase);
    setModalConfirmar(true);
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-900 to-gray-700">
      
      
      <View className="w-full h-44 p-5 justify-center bg-gradient-to-b from-blue-600">
        <Text className="font-bold text-2xl text-amber-400">
          Actividades del {day}
        </Text>
        <Text className="font-light text-slate-200 text-md">
          Reserva tus clases disponibles para hoy
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {clases.length !== 0 ? (
          clases.map((clase) => {
            const yaReservada = reservadas.includes(clase.id);

            return (
              <View
                key={clase.id}
                className="bg-gray-800 p-4 mb-4 rounded-2xl shadow-md"
              >
                <View className="flex flex-row justify-between mb-2">
                  <Text className="text-white font-semibold text-base">
                    {clase.clase.nombre}
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    {clase.instructor.nombre} {clase.instructor.apellido1}
                  </Text>
                </View>

                <Text className="text-gray-300 mb-4">
                  {clase.hora_inicio} – {clase.hora_fin}
                </Text>

                <Pressable
                  disabled={yaReservada}
                  onPress={() => abrirModalConfirmacion(clase.id)}
                  className={`p-3 rounded-xl ${
                    yaReservada ? 'bg-gray-600' : 'bg-blue-600'
                  }`}
                >
                  <Text className="text-white text-center font-bold">
                    {yaReservada ? 'Clase reservada' : 'Reservar clase'}
                  </Text>
                </Pressable>
              </View>
            );
          })
        ) : (
          <Text className="text-white text-center mt-6 text-xl font-bold">
            No hay clases disponibles hoy
          </Text>
        )}
      </ScrollView>

      
      <Modal transparent visible={modalConfirmar} animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white w-full rounded-xl p-6">
            <Text className="text-xl font-bold text-center mb-4">
              ¿Confirmar reserva?
            </Text>

            <Pressable
              onPress={reservarClase}
              className="bg-blue-600 p-3 rounded-lg mb-2"
            >
              <Text className="text-white text-center font-bold">
                Confirmar
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setModalConfirmar(false);
                setIdClaseSeleccionada(null);
              }}
              className="bg-gray-400 p-3 rounded-lg"
            >
              <Text className="text-white text-center font-bold">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
