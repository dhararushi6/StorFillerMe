import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Pressable,
  Animated,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { COLORS } from '@/theme/colors';
import { useResponsive } from '@/theme/responsive';
import {
  NOTIFICATION_STRINGS,
  NOTIFICATION_ROWS,
  TOGGLE_GEOMETRY,
  getNotificationStyles,
  type NotificationSettingsState,
} from '../../constants/notification';

import caretRightIcon from '../../assets/icons/caret-right (1) 15 (1).png';

// Route must match the file path under app/.
const ACCOUNT_SETTINGS_ROUTE = '/accountsettings';

// -------------------- Toggle Switch --------------------
interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  styles: ReturnType<typeof getNotificationStyles>;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange, styles }) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.toggle.off, COLORS.toggle.on],
  });

  const knobTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TOGGLE_GEOMETRY.knobTravel],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.toggleTrack, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[styles.toggleKnob, { transform: [{ translateX: knobTranslateX }] }]}
        />
      </Animated.View>
    </Pressable>
  );
};

// -------------------- Notification Row --------------------
interface NotificationRowProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  styles: ReturnType<typeof getNotificationStyles>;
}

const NotificationRow: React.FC<NotificationRowProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
  styles,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowTextContainer}>
        <AppText style={styles.rowTitle}>{title}</AppText>
        <AppText style={styles.rowSubtitle}>{subtitle}</AppText>
      </View>

      <ToggleSwitch value={value} onValueChange={onValueChange} styles={styles} />
    </View>
  );
};

// -------------------- Screen --------------------
interface NotificationsScreenProps {
  onSave?: (settings: NotificationSettingsState) => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onSave }) => {
  const router = useRouter();
  const { horizontalPadding } = useResponsive();
  const styles = useMemo(() => getNotificationStyles(horizontalPadding), [horizontalPadding]);

  const initialState = useMemo(
    () =>
      NOTIFICATION_ROWS.reduce((acc, row) => {
        acc[row.id] = row.defaultValue;
        return acc;
      }, {} as NotificationSettingsState),
    [],
  );

  const [settings, setSettings] = useState<NotificationSettingsState>(initialState);

  const goToAccountSettings = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ACCOUNT_SETTINGS_ROUTE);
    }
  }, [router]);

  const handleBack = useCallback(() => {
    goToAccountSettings();
  }, [goToAccountSettings]);

  const handleToggle = useCallback((id: keyof NotificationSettingsState, value: boolean) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onSave?.(settings);
    goToAccountSettings();
  }, [onSave, settings, goToAccountSettings]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.orange.normal} />

      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <Image source={caretRightIcon} style={styles.backIcon} resizeMode="contain" />
        </Pressable>

        <AppText style={styles.headerTitle}>{NOTIFICATION_STRINGS.headerTitle}</AppText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.sectionSubtitle}>{NOTIFICATION_STRINGS.sectionSubtitle}</AppText>

        {NOTIFICATION_ROWS.map((row) => (
          <NotificationRow
            key={row.id}
            title={row.title}
            subtitle={row.subtitle}
            value={settings[row.id]}
            onValueChange={(value) => handleToggle(row.id, value)}
            styles={styles}
          />
        ))}
      </ScrollView>

      <View style={styles.saveButtonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <AppText style={styles.saveButtonText}>{NOTIFICATION_STRINGS.saveButtonText}</AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
