// components/ModalInfo.js
import { View, Text, Modal, Pressable } from 'react-native';
import React from 'react';

export default function ModalInfo({ visible, onClose, children }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >

      <View className="flex-1 bg-black/60 justify-center items-center px-5">
        <View className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl relative">

          <Pressable
            onPress={onClose}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-gray-700 text-lg font-bold">✕</Text>
          </Pressable>

         
          <View className="mt-4">
            {children}
          </View>

        </View>
      </View>
    </Modal>
  );
}
