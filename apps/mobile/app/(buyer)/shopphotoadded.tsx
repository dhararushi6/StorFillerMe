import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SPACING } from '../../theme';
import checkIcon from '../../assets/icons/Shop images (7).png';
import { PhotoAddedModalProps, photoAddedModalStyles as styles } from '../../constants/ShopPhoto';

export function PhotoAddedModal({
  visible,
  onDone,
  title = 'Photo Added!',
  message = 'Your shop photo has been\nadded successfully',
}: PhotoAddedModalProps) {
  const insets = useSafeAreaInsets();

  const handleDone = () => {
    onDone();
    router.replace('/(buyer)/profile');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
      <View style={styles.backdrop}>
        <Pressable style={styles.overlayPressable} onPress={onDone} />
        <Pressable
          style={[
            styles.card,
            { marginBottom: Math.max(insets.bottom, SPACING.lg) + SPACING.xxxl },
          ]}
          onPress={() => {}}
        >
          <Image source={checkIcon} style={styles.checkIcon} resizeMode="contain" />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.85}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </Modal>
  );
}
