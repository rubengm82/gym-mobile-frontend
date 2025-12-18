import { View, Text, Button, Pressable  } from 'react-native';
import React, { useEffect, useState } from 'react';


/* Función para obtener el nombre del día */
function getDayName(day) {
  switch (day) {
    case 1:
      return 'Lunes';
    case 2:
      return 'Martes';
    case 3:
      return 'Miércoles';
    case 4:
      return 'Jueves';
    case 5:
      return 'Viernes';
    case 6:
      return 'Sábado';
    case 0:
      return 'Domingo';
    default:
      return '';
  }
}

/* Fetch de planificaciones */
async function obtenerPlanificaciones(dia) {
  try {
    const response = await fetch('http://localhost:8000/api/planificaciones');
    const datos = await response.json();

    const planificacionesFiltradas = datos.planificaciones.filter(
      (planificacion) => planificacion.dia === dia
    );

    return planificacionesFiltradas;
  } catch (error) {
    console.error('Error al obtener planificaciones', error);
    return [];
  }
}



export default function Clases() {
  const [day, setDay] = useState('');
  const [clases, setClases] = useState([]);

  useEffect(() => {
  const cargarDatos = async () => {
    const fechaActual = new Date().getDay();
    const diaActual = getDayName(fechaActual);

    setDay(diaActual);

    const data = await obtenerPlanificaciones(diaActual);
    setClases(data);
  };

  cargarDatos();
}, []);
 

  function showInfo(id){

    console.log(id);

  }

  return (
    <View className="flex-1 items-center p-6 bg-gradient-to-b from-blue-500 to-blue-800">
      <View className="mt-3">
        <Text className="text-2xl font-bold text-slate-100">
          Actividades del: {day}
        </Text>
      </View>

      <View className="bg-red-200 w-full flex-1 px-4 mt-9">
        {/* Map de las clases */}
        {clases.map((clase, index) => (
          <View key={index} className="mb-3 p-3 bg-white rounded-xl">
            <Text>{clase.clase.nombre}</Text>
            <View className=" flex w-full bg-green-400">
              <Text>{clase.hora_inicio}</Text>
              <Text>{clase.hora_fin}</Text>
              <Text>{clase.instructor.nombre +" "+clase.instructor.apellido1+" "+clase.instructor.apellido2}</Text>
            </View>
            <Pressable
              onPress={() => showInfo(clase.clase.id)}
              className="p-3 bg-blue-500 rounded-xl"
            >
              <Text className="text-white font-bold text-center">
                Reservar clase
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
