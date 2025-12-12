import { View, Text } from 'react-native';
import {} from '../../api/endpoints';
import React, { useEffect, useState } from 'react';


{/* Funcion de obtener el nombre del dia */}
function getDayName(day){
  let dayName="";
  switch(day){
    case 1:
      dayName="Lunes";
      break;
    case 2:
      dayName="Martes";
      break;
    case 3:
      dayName="Miercoles";
      break;
    case 4:
      dayName="Jueves";
      break;
    case 5:
      dayName="Viernes";
      break;
      
  }
  return dayName;
}

{/* Pricipal */}

export default function Clases() {

  const [day, setDay] = useState("");

  {/* UseEffect para extaer el dia actual y las clases del mismo */}
  useEffect(() => {
    console.log('Componente montado');

    let fechaActual = new Date();
    fechaActual = fechaActual.getDay();
    setDay(getDayName(fechaActual));


    {/* Falta el fetch de las clases */}

    return () => {
      
    };
  }, [day]);


  return (
    
    <View className="flex-1 items-center p-6 bg-gradient-to-b from-blue-500 to-blue-800">
      <View className=" mt-3">
        <Text className="text-2xl font-bold text-slate-100">Actividades del: {day}</Text>
      </View>

      <View className=" bg-red-200 w-full h-full px-4 mt-9 ">
        {/*Map de las clases*/}
        {clases.map((clase) =>(
          <View>
            <p>{clase.nombre}</p>
          </View>   
        )
      
        )}


      </View>
    

    </View>
    
  );
}

const clases = [
  {
    id: 1,
    nombre: "Yoga",
    aforo: 3,
    descripcion: "Clase de yoga para principiantes",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 2,
    nombre: "Crossfit",
    aforo: 3,
    descripcion: "Entrenamiento de alta intensidad",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 3,
    nombre: "Pilates",
    aforo: 4,
    descripcion: "Pilates para fortalecer el core",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 4,
    nombre: "Zumba",
    aforo: 2,
    descripcion: "Baile y cardio divertido",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 5,
    nombre: "Spinning",
    aforo: 3,
    descripcion: "Bicicleta estática en grupo",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 6,
    nombre: "Boxeo",
    aforo: 2,
    descripcion: "Entrenamiento de boxeo para principiantes",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 7,
    nombre: "HIIT",
    aforo: 2,
    descripcion: "Sesión de alta intensidad",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 8,
    nombre: "Meditación",
    aforo: 3,
    descripcion: "Meditación para relajamiento",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 9,
    nombre: "Funcional",
    aforo: 2,
    descripcion: "Funcional para movimiento total corporal",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 10,
    nombre: "Cardio Dance",
    aforo: 3,
    descripcion: "Baile para cardio",
    estado: 1,
    created_at: null,
    updated_at: null
  },
  {
    id: 11,
    nombre: "Judo",
    aforo: 3,
    descripcion: "Clase de judo para principiantes",
    estado: 0,
    created_at: null,
    updated_at: null
  },
  {
    id: 12,
    nombre: "Taekwondo",
    aforo: 2,
    descripcion: "Taekwondo para todos los niveles",
    estado: 0,
    created_at: null,
    updated_at: null
  }
];







