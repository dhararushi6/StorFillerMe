import React, { useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputKeyPressEventData,
  type NativeSyntheticEvent,
  View,
} from 'react-native';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
}

export function OtpInput({ length = 5, value, onChange }: OtpInputProps) {
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const otpArray = Array.from({ length }, (_, i) => value[i] || '');

  const handleChangeText = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, '');

    if (cleaned.length > 1) {
      // Pasted full or partial OTP
      const combined = (value.slice(0, index) + cleaned).slice(0, length);
      onChange(combined);
      const nextIndex = Math.min(index + cleaned.length, length - 1);
      inputsRef.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otpArray];
    newOtp[index] = cleaned;
    const combined = newOtp.join('');
    onChange(combined);

    if (cleaned && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        const isFilled = !!otpArray[index];

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputsRef.current[index] = ref;
            }}
            style={[styles.box, isFilled && styles.boxFilled]}
            keyboardType="numeric"
            maxLength={1}
            value={otpArray[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
            textAlign="center"
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },

  box: {
    flex: 1,
    height: 60,
    maxWidth: 56,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.orange.lightActive,
    borderRadius: RADIUS.md,
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.text.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  boxFilled: {
    borderColor: COLORS.orange.normal,
  },
});
