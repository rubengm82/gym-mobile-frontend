import { View, Text, Pressable, SafeAreaView,ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReservaConfirmadaModal from '../components/ReservaConfirmadaModal';

const BASE_URL = 'http://localhost:8000/api';

/* Obtener nombre del dia */
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

/* Obtener planificaciones del dia */
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

/* Obtener reservas del cliente */
async function obtenerReservasCliente(clienteId) {
  try {
    const response = await fetch(`${BASE_URL}/reservas/cliente/${clienteId}`);
    const reservas = await response.json();

    console.log(reservas)
    // solo las del cliente
    return reservas
      .filter(r => r.fk_id_cliente === clienteId)
      .map(r => r.fk_id_planificacion);

  } catch {
    return [];
  }
}

export default function Clases() {
  const [day, setDay] = useState('');
  const [clases, setClases] = useState([]);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservadas, setReservadas] = useState([]);

  /*  Cargar usuario */
  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));
    };
    loadUser();
  }, []);

  /* FORZAR MARTES + cargar reservas */
  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      const diaForzado = getDayName(3); // MARTES
      setDay(diaForzado);

      const [clasesData, reservasData] = await Promise.all([
        obtenerPlanificaciones(diaForzado),
        obtenerReservasCliente(user.id),
      ]);

      setClases(clasesData);
      setReservadas(reservasData);
    };

    cargarDatos();
  }, [user]);

  /*  Reservar clase */
  const reservarClase = async (planificacionId) => {
    if (!user) return;

    const payload = {
      fk_id_planificacion: planificacionId,
      fk_id_cliente: user.id,
      fecha_reserva: new Date().toISOString().split('T')[0],
      estado: "1",
    };

    try {
      const response = await fetch(`${BASE_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) return;

      console.log('Reserva creada');
    } catch {
      console.log('Error de conexión');
    }
  };

  return (
    <View className="flex-1 bg-blue-600 p-6">
  <Text className="text-2xl font-bold text-white mb-4">
    Actividades del {day}
  </Text>

  <SafeAreaView className="flex-1">
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {clases.map((clase) => {
        const yaReservada = reservadas.includes(clase.id);

        return (
          <View key={clase.id} className="mb-4 bg-white p-4 rounded-xl">
            <Text className="font-bold">{clase.clase.nombre}</Text>
            <Text>{clase.hora_inicio} - {clase.hora_fin}</Text>
            <Text>
              {clase.instructor.nombre} {clase.instructor.apellido1}
            </Text>

            <Pressable
              disabled={yaReservada}
              onPress={() => reservarClase(clase.id)}
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
  </SafeAreaView>
</View>

  );

  
  
}
