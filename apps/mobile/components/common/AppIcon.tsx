import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS, ICON_SIZES } from '@/theme';
import { ICONS, type IconName } from '@/constants/icons';

type IconSize = keyof typeof ICON_SIZES;

interface AppIconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function AppIcon({ name, size = 'md', color = COLORS.text.primary, style }: AppIconProps) {
  return (
    <Ionicons
      name={ICONS[name] as React.ComponentProps<typeof Ionicons>['name']}
      size={ICON_SIZES[size]}
      color={color}
      style={style}
    />
  );
}
