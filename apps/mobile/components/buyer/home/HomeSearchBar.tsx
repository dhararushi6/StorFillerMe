import React from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

import microphoneIcon from '@/assets/icons/microphone.png';
import searchIcon from '@/assets/icons/search.png';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface HomeSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onMicPress?: () => void;
  placeholder?: string;
}

export function HomeSearchBar({
  value = '',
  onChangeText,
  onPress,
  onMicPress,
  placeholder = 'Look for Products, brands or categories...',
}: HomeSearchBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Search products"
        hitSlop={4}
      >
        <Image source={searchIcon} style={styles.searchIcon} resizeMode="contain" />
      </Pressable>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.muted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onPress}
      />

      <Pressable
        onPress={onMicPress}
        accessibilityRole="button"
        accessibilityLabel="Voice search"
        hitSlop={8}
      >
        <Image source={microphoneIcon} style={styles.microphoneIcon} resizeMode="contain" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
  },

  searchIcon: {
    width: 19,
    height: 19,
  },

  input: {
    flex: 1,
    height: 38,
    paddingHorizontal: SPACING.md,
    paddingVertical: 0,
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  microphoneIcon: {
    width: 18,
    height: 18,
    marginRight: SPACING.md,
  },
});
