import React from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

import microphoneIcon from '@/assets/icons/microphone.png';
import searchIcon from '@/assets/icons/search.png';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING, useResponsive } from '@/theme';

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
  const { isSmall, isTablet } = useResponsive();

  const searchIconSize = isSmall ? 18 : 20;
  const microphoneIconSize = isSmall ? 17 : 18;

  return (
    <View
      style={[
        styles.container,
        {
          height: isSmall ? 40 : 42,
          paddingHorizontal: isSmall ? SPACING.xs : SPACING.sm,
          borderRadius: isTablet ? RADIUS.lg : RADIUS.md,
        },
      ]}
    >
      <Image
        source={searchIcon}
        style={[
          styles.searchIcon,
          {
            width: searchIconSize,
            height: searchIconSize,
          },
        ]}
        resizeMode="contain"
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.muted}
        style={[
          styles.input,
          {
            height: isSmall ? 36 : 38,
            paddingHorizontal: isSmall ? SPACING.sm : SPACING.md,
            fontSize: isSmall ? FONT_SIZE.xs : FONT_SIZE.sm,
          },
        ]}
        returnKeyType="search"
        onSubmitEditing={onPress}
      />

      <Pressable
        onPress={onMicPress}
        accessibilityRole="button"
        accessibilityLabel="Voice search"
        hitSlop={8}
        style={[
          styles.microphoneButton,
          {
            paddingRight: isSmall ? SPACING.sm : SPACING.md,
          },
        ]}
      >
        <Image
          source={microphoneIcon}
          style={[
            styles.microphoneIcon,
            {
              width: microphoneIconSize,
              height: microphoneIconSize,
            },
          ]}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },

  searchIcon: {
    flexShrink: 0,
  },

  input: {
    flex: 1,
    paddingVertical: 0,
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.regular,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  microphoneButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  microphoneIcon: {
    flexShrink: 0,
  },
});
