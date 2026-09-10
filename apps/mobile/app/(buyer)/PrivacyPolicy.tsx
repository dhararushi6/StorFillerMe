import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, TouchableOpacity, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { COLORS } from '@/theme/colors';
import { useResponsive } from '@/theme/responsive';
import {
  PRIVACY_POLICY_STRINGS,
  PRIVACY_POLICY_SECTIONS,
  getPrivacyPolicyStyles,
} from '../../constants/PrivacyPolicy';

import caretRightIcon from '../../assets/icons/caret-right (1) 15.png';

export default function PrivacyPolicy() {
  const router = useRouter();
  const { horizontalPadding, verticalScale, moderateScale } = useResponsive();

  const styles = useMemo(
    () =>
      getPrivacyPolicyStyles({
        horizontalPadding,
        verticalScale,
        moderateScale,
      }),
    [horizontalPadding, verticalScale, moderateScale],
  );

  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleBack = useCallback(() => {
    router.push(PRIVACY_POLICY_STRINGS.routes.accountSettings);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.orange.normal} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Image source={caretRightIcon} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>

        <AppText style={styles.headerTitle}>{PRIVACY_POLICY_STRINGS.headerTitle}</AppText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <AppText style={styles.subtitle}>{PRIVACY_POLICY_STRINGS.subtitle}</AppText>

          <View style={styles.accordionContainer}>
            {PRIVACY_POLICY_SECTIONS.map((section) => {
              const isOpen = openId === section.id;

              return (
                <TouchableOpacity
                  key={section.id}
                  onPress={() => toggle(section.id)}
                  style={styles.accordionButton}
                  activeOpacity={0.7}
                >
                  <View style={styles.textContainer}>
                    <AppText style={styles.sectionTitle}>{section.title}</AppText>
                    <AppText style={styles.sectionDescription}>
                      {isOpen ? section.detail : section.summary}
                    </AppText>
                  </View>

                  <Image
                    source={caretRightIcon}
                    style={[
                      styles.arrowImage,
                      isOpen ? styles.arrowExpanded : styles.arrowCollapsed,
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
