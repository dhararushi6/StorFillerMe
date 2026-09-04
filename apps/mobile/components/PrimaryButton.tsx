import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES } from '@/theme';

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <AppText variant="bodyMedium" color="inverse" style={styles.text}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    opacity: 0.8,
  },

  text: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
  },
});
