import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import gpayImg from '@/assets/icons/upi-group-105.png';
import paytmImg from '@/assets/icons/upi-group-106.png';
import superMoneyImg from '@/assets/icons/upi-group-107.png';
import naviImg from '@/assets/icons/upi-group-108.png';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface PaymentUpiSectionProps {
  title: string;
  onSelectApp?: (appId: string) => void;
}

export function PaymentUpiSection({ title, onSelectApp }: PaymentUpiSectionProps) {
  return (
    <View style={styles.card}>
      <AppText variant="bodyMedium" color="primary" style={styles.title}>
        {title}
      </AppText>

      {/* Dashed line */}
      <View style={styles.dashedDivider} />

      {/* Row of UPI apps */}
      <View style={styles.appsRow}>
        {/* PhonePe */}
        <Pressable
          style={({ pressed }) => [styles.appItem, pressed && styles.pressed]}
          onPress={() => onSelectApp?.('phonepe')}
          accessibilityRole="button"
          accessibilityLabel="PhonePe"
        >
          <View style={styles.phonePeCircle}>
            <AppText style={styles.phonePeText}>पे</AppText>
          </View>
          <AppText variant="caption" color="primary" style={styles.appName}>
            Phonepe
          </AppText>
        </Pressable>

        {/* GPay (Group 105) */}
        <Pressable
          style={({ pressed }) => [styles.appItem, pressed && styles.pressed]}
          onPress={() => onSelectApp?.('gpay')}
          accessibilityRole="button"
          accessibilityLabel="GPay"
        >
          <Image source={gpayImg} style={styles.groupImage} resizeMode="contain" />
        </Pressable>

        {/* Paytm (Group 106) */}
        <Pressable
          style={({ pressed }) => [styles.appItem, pressed && styles.pressed]}
          onPress={() => onSelectApp?.('paytm')}
          accessibilityRole="button"
          accessibilityLabel="Paytm"
        >
          <Image source={paytmImg} style={styles.groupImage} resizeMode="contain" />
        </Pressable>

        {/* Super Money (Group 107) */}
        <Pressable
          style={({ pressed }) => [styles.appItem, pressed && styles.pressed]}
          onPress={() => onSelectApp?.('supermoney')}
          accessibilityRole="button"
          accessibilityLabel="Super Money"
        >
          <Image source={superMoneyImg} style={styles.groupImageWide} resizeMode="contain" />
        </Pressable>

        {/* Navi (Group 108) */}
        <Pressable
          style={({ pressed }) => [styles.appItem, pressed && styles.pressed]}
          onPress={() => onSelectApp?.('navi')}
          accessibilityRole="button"
          accessibilityLabel="Navi"
        >
          <Image source={naviImg} style={styles.groupImage} resizeMode="contain" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.payment.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md + 2,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.sm + 1,
  },

  dashedDivider: {
    height: 1,
    borderWidth: 0.5,
    borderColor: COLORS.payment.dashedBorder,
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md + 2,
  },

  appsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },

  appItem: {
    width: 52,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },

  phonePeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5F259F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  phonePeText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontFamily: FONT_FAMILY.bold,
    lineHeight: 27,
  },

  appName: {
    fontSize: 11,
    marginTop: 5,
    fontFamily: FONT_FAMILY.medium,
  },

  groupImage: {
    width: 52,
    height: 65,
  },

  groupImageWide: {
    width: 64,
    height: 65,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
});
