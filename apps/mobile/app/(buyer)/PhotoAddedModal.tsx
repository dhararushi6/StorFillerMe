import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  SIZES,
  ICON_SIZES,
} from '../../theme';

// Replaced require() with import
import checkIcon from '../../assets/icons/Shop images (7).png';

interface PhotoAddedModalProps {
  visible: boolean;
  onDone: () => void;
  title?: string;
  message?: string;
}

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
            {
              marginBottom: Math.max(insets.bottom, SPACING.lg) + SPACING.xxxl,
            },
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlayLight,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: SIZES.shadowOffsetSmall,
      height: SIZES.shadowOffsetSmall,
    },
    shadowOpacity: SIZES.shadowOpacityMedium,
    shadowRadius: SIZES.shadowRadiusMedium,
    elevation: SIZES.elevationLarge,
  },
  checkIcon: {
    width: ICON_SIZES.huge,
    height: ICON_SIZES.huge,
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.extraLarge,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.black,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  message: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.medium,
    color: COLORS.black,
    textAlign: 'center',
    maxWidth: 250,
    marginBottom: SPACING.xl,
  },
  doneButton: {
    width: '100%',
    height: SIZES.uploadButtonHeight,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.small,
    color: COLORS.white,
  },
});
