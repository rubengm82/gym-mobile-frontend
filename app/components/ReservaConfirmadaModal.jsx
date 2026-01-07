import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

export default function ReservaConfirmadaModal({ visible, onClose }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      className="justify-center items-center"
    >
      {/* FONDO OSCURO */}
      <View className="flex-1 bg-black/70 justify-center items-center rounded-xl">

        {/* MODAL PRINCIPAL */}
        <View
          className="
            w-[80%]
            h-[75%]
            bg-white
        
            px-10
            py-12
            justify-between
            shadow-2xl
            rounded-xl
          "
        >
          {/* PARTE SUPERIOR */}
          <View className="items-center">

            {/* ICONO GIGANTE */}
            <Text className="text-[96px] mb-6">
              🎉
            </Text>

            {/* TITULO ENORME */}
            <Text className="text-4xl font-extrabold text-center text-gray-900 mb-6">
              ¡RESERVA CONFIRMADA!
            </Text>

            {/* TEXTO GRANDE */}
            <Text className="text-xl text-center text-gray-700 leading-relaxed">
              Te esperamos este martes para entrenar con todo 💪
            </Text>

          </View>

          {/* BOTÓN INFERIOR */}
          <Pressable
            onPress={onClose}
            className="
              bg-blue-600
              py-6
              rounded-2xl
              active:opacity-80
            "
          >
            <Text className="text-white text-center text-2xl font-bold">
              CONTINUAR
            </Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}
