import React, { useCallback, useMemo } from 'react';
import { View, Image, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { COLORS } from '@/theme/colors';
import { useResponsive } from '@/theme/responsive';
import {
  ACCOUNT_SETTINGS_STRINGS,
  ACCOUNT_SETTINGS_ITEMS,
  getAccountSettingsStyles,
  type AccountSettingItemConfig,
} from '../../constants/accountsettings';

// Fixed imports
import bellIcon from '../../assets/icons/bell (4) 2 (1).png';
import shieldIcon from '../../assets/icons/shield-check (2) 1 (1).png';
import fileIcon from '../../assets/icons/file (2) 1 (1).png';
import phoneIcon from '../../assets/icons/phone-call (3) 2 (1).png';
import caretRightIcon from '../../assets/icons/caret-right (1) 15 (1).png';

const ITEM_ICONS: Record<AccountSettingItemConfig['id'], number> = {
  notifications: bellIcon,
  privacyPolicy: shieldIcon,
  termsAndConditions: fileIcon,
};

const AccountSettingsScreen = () => {
  const router = useRouter();
  const { horizontalPadding, verticalScale, moderateScale } = useResponsive();

  const styles = useMemo(
    () => getAccountSettingsStyles({ horizontalPadding, verticalScale, moderateScale }),
    [horizontalPadding, verticalScale, moderateScale],
  );

  const handleBack = useCallback(() => {
    router.push(ACCOUNT_SETTINGS_STRINGS.routes.profile);
  }, [router]);

  const handleItemPress = useCallback(
    (id: AccountSettingItemConfig['id']) => {
      if (id === 'notifications') router.push(ACCOUNT_SETTINGS_STRINGS.routes.notifications);
      if (id === 'privacyPolicy') router.push(ACCOUNT_SETTINGS_STRINGS.routes.privacyPolicy);
      if (id === 'termsAndConditions')
        router.push(ACCOUNT_SETTINGS_STRINGS.routes.termsAndConditions);
    },
    [router],
  );

  const handleContactSupport = useCallback(() => {
    router.push(ACCOUNT_SETTINGS_STRINGS.routes.support);
  }, [router]);

  type SettingItemProps = {
    icon: number;
    title: string;
    subtitle: string;
    onPress: () => void;
  };

  const SettingItem = ({ icon, title, subtitle, onPress }: SettingItemProps) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>

      <View style={styles.textContainer}>
        <AppText style={styles.itemTitle}>{title}</AppText>
        <AppText style={styles.itemSubtitle}>{subtitle}</AppText>
      </View>

      <Image source={caretRightIcon} style={styles.caret} resizeMode="contain" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.orange.normal} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Image source={caretRightIcon} style={styles.backArrow} resizeMode="contain" />
        </TouchableOpacity>

        <AppText style={styles.headerTitle}>{ACCOUNT_SETTINGS_STRINGS.headerTitle}</AppText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <AppText style={styles.sectionTitle}>{ACCOUNT_SETTINGS_STRINGS.sectionTitle}</AppText>

        <View style={styles.list}>
          {ACCOUNT_SETTINGS_ITEMS.map((item: AccountSettingItemConfig) => (
            <SettingItem
              key={item.id}
              icon={ITEM_ICONS[item.id]}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => handleItemPress(item.id)}
            />
          ))}
        </View>
      </View>

      {/* Need Help Section */}
      <View style={styles.helpContainer}>
        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <Image source={phoneIcon} style={styles.helpIcon} resizeMode="contain" />
          </View>

          <View style={styles.helpTextContainer}>
            <AppText style={styles.helpTitle}>{ACCOUNT_SETTINGS_STRINGS.helpTitle}</AppText>

            <AppText style={styles.helpSubtitle}>{ACCOUNT_SETTINGS_STRINGS.helpSubtitle}</AppText>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactSupport}
              activeOpacity={0.7}
            >
              <AppText style={styles.contactText}>{ACCOUNT_SETTINGS_STRINGS.contactText}</AppText>

              <Image source={caretRightIcon} style={styles.contactCaret} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;
