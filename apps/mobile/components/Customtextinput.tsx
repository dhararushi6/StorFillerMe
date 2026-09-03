import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { COLORS } from '@/theme/colors';
import { getAddAddressFormStyles } from '@/constants/location';

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export function CustomTextInput({ label, value, onChangeText, placeholder }: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholder = value.length === 0 && !isFocused;
  const styles = getAddAddressFormStyles(0);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder=""
          underlineColorAndroid="transparent"
          cursorColor={COLORS.text.location}
          selectionColor={COLORS.text.location}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {showPlaceholder ? (
          <Text style={styles.customPlaceholder} pointerEvents="none">
            {placeholder}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
