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

async function obtenerTodasReservas() {
  try {
    const response = await fetch(`${BASE_URL}/reservas`);
    const reservas = await response.json();
    return Array.isArray(reservas) ? reservas : [];
  } catch {
    return [];
  }
}

export default function Clases() {
  const [day, setDay] = useState('');
  const [clases, setClases] = useState([]);
  const [user, setUser] = useState(null);
  const [reservadas, setReservadas] = useState([]);
  const [aforos, setAforos] = useState({});
  const [errorReserva, setErrorReserva] = useState('');

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [idClaseSeleccionada, setIdClaseSeleccionada] = useState(null);

  const cargando = useRef(false);

  const cargarDatos = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) return;
    
    const userData = JSON.parse(userStr);
    if (!userData?.id) return;
    
    if (cargando.current) return;
    cargando.current = true;

    const hoy = new Date();
    const dia = getDayName(hoy.getDay());
    setDay(dia);

    try {
      const clasesData = await obtenerPlanificaciones(dia);
      const reservasData = await obtenerReservasCliente(userData.id);
      const todasReservas = await obtenerTodasReservas();

      // Calcular aforos desde las clases
      const aforosData = {};
      for (const clase of clasesData) {
        const maximo = clase.clase?.aforo || 0;
        // Contar reservas para esta planificación (solo estado = 1)
        const actual = todasReservas.filter(
          r => r.fk_id_planificacion === clase.id && r.estado == 1
        ).length;
        aforosData[clase.id] = { actual, maximo };
      }
      setAforos(aforosData);

      // Verificar que el usuario actual es el mismo
      const currentUserStr = await AsyncStorage.getItem('user');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser?.id === userData.id) {
          setClases(clasesData);
          setReservadas(reservasData);
        }
      }
    } finally {
      cargando.current = false;
    }
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

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
      return () => {};
    }, [])
  );

  useEffect(() => {
    if (user?.id) {
      setReservadas([]);
      setClases([]);
      setAforos({});
      setErrorReserva('');
      cargando.current = false;
      cargarDatos();
    }
  }, [user?.id]);

  const verificarAforo = (planificacionId) => {
    const info = aforos[planificacionId];
    if (!info) return true;
    
    if (info.actual >= info.maximo && info.maximo > 0) {
      setErrorReserva('Esta clase ha alcanzado el aforo máximo');
      return false;
    }
    return true;
  };

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
        setErrorReserva('');
        cargarDatos();
      } else if (response.status === 400) {
        const errorData = await response.json();
        setErrorReserva(errorData.message || 'Error al realizar la reserva');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModalConfirmacion = (idClase) => {
    setErrorReserva('');
    if (verificarAforo(idClase)) {
      setIdClaseSeleccionada(idClase);
      setModalConfirmar(true);
    }
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

      {errorReserva ? (
        <Text className="text-red-500 text-center px-4 py-2 bg-red-100 mx-4 mt-2 rounded">
          {errorReserva}
        </Text>
      ) : null}

      <ScrollView className="flex-1 px-6 mt-2">
        {clases.length !== 0 ? (
          clases.map((clase) => {
            const yaReservada = reservadas.includes(clase.id);
            const infoAforo = aforos[clase.id];
            const maximo = infoAforo?.maximo || 0;
            const lleno = infoAforo ? infoAforo.actual >= infoAforo.maximo : false;
            const deshabilitado = yaReservada || (lleno && maximo > 0);

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
                    {clase.instructor.nombre} {clase.instructor.apellido1} {clase.instructor.apellido2}
                  </Text>
                </View>

                <Text className="text-gray-300 mb-4">
                  {clase.hora_inicio} – {clase.hora_fin}
                </Text>

                {maximo > 0 && (
                  <Text className={`text-sm mb-2 ${lleno ? 'text-red-400' : 'text-green-400'}`}>
                    Aforo: {infoAforo.actual}/{maximo}
                    {lleno ? ' (COMPLETO)' : ''}
                  </Text>
                )}

                <Pressable
                  disabled={deshabilitado}
                  onPress={() => abrirModalConfirmacion(clase.id)}
                  className={`p-3 rounded-xl ${
                    deshabilitado ? 'bg-gray-600' : 'bg-blue-600'
                  }`}
                >
                  <Text className="text-white text-center font-bold">
                    {yaReservada ? 'Clase reservada' : (lleno && maximo > 0 ? 'Aforo completo' : 'Reservar clase')}
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
