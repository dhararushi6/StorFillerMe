import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SIZES, SPACING } from '@/theme';
import { type IconName } from '@/constants/icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface AppButtonProps {
  title: string;
  onPress: () => void;

  variant?: ButtonVariant;
  size?: ButtonSize;

  icon?: IconName;
  iconPosition?: 'left' | 'right';

  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;

  style?: StyleProp<ViewStyle>;
}

const BUTTON_HEIGHTS: Record<ButtonSize, number> = {
  small: SIZES.smallButtonHeight,
  medium: SIZES.buttonHeight,
  large: 56,
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  const textColor = getTextColor(variant, isDisabled);
  const iconColor = textColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          height: BUTTON_HEIGHTS[size],
        },
        getVariantStyle(variant, isDisabled),
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <AppIcon name={icon} size="sm" color={iconColor} />}

          <AppText
            variant="button"
            color="primary"
            style={[
              styles.text,
              {
                color: textColor,
              },
            ]}
          >
            {title}
          </AppText>

          {icon && iconPosition === 'right' && <AppIcon name={icon} size="sm" color={iconColor} />}
        </View>
      )}
    </Pressable>
  );
}

function getVariantStyle(variant: ButtonVariant, disabled: boolean): ViewStyle {
  if (disabled) {
    return {
      backgroundColor: COLORS.border,
      borderColor: COLORS.border,
    };
  }

  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: COLORS.orange.light,
        borderColor: COLORS.orange.light,
      };

    case 'outline':
      return {
        backgroundColor: COLORS.surface,
        borderColor: COLORS.orange.normal,
      };

    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      };

    case 'primary':
    default:
      return {
        backgroundColor: COLORS.orange.normal,
        borderColor: COLORS.orange.normal,
      };
  }
}

function getTextColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) {
    return COLORS.text.muted;
  }

  switch (variant) {
    case 'primary':
      return COLORS.text.inverse;

    case 'secondary':
      return COLORS.orange.normal;

    case 'outline':
      return COLORS.orange.normal;

    case 'ghost':
      return COLORS.orange.normal;

    default:
      return COLORS.text.inverse;
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
  },

  fullWidth: {
    width: '100%',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },

  text: {
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.85,
  },
});
