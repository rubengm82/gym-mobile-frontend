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

    const diaAhora = new Date();
    console.log(diaAhora)

    const dia = getDayName(diaAhora.getDay());
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
        await cargarDatos();
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
    <View className="flex-1 bg-gradient-to-b from-gray-900 to-gray-700 px-6">
      <Text className="text-2xl font-bold text-white mb-4 mt-6">
        Actividades del {day}
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {clases.map((clase) => {
          const yaReservada = reservadas.includes(clase.id);

          return (
            <View key={clase.id} className="mb-4 bg-white p-4 rounded-xl shadow-md">
              <Text className="font-bold text-lg">{clase.clase.nombre}</Text>
              <Text className="text-gray-600">
                {clase.hora_inicio} - {clase.hora_fin}
              </Text>
              <Text className="text-gray-600">
                {clase.instructor.nombre} {clase.instructor.apellido1}
              </Text>

              <Pressable
                disabled={yaReservada}
                onPress={() => abrirModalConfirmacion(clase.id)}
                className={`mt-3 p-3 rounded-lg ${
                  yaReservada ? 'bg-gray-400' : 'bg-blue-500'
                }`}
              >
                <Text className="text-white text-center font-bold">
                  {yaReservada ? 'Clase reservada' : 'Reservar clase'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <Modal transparent visible={modalConfirmar} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-xl p-6">
            <Text className="text-xl font-bold text-center mb-4">
              ¿Confirmar reserva?
            </Text>

            <Pressable
              onPress={reservarClase}
              className="bg-blue-500 p-3 rounded-lg mb-2"
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
