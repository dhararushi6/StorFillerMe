import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { AuthHeader } from '@/components/common/AuthHeader';
import { AppButton } from '@/components/ui/AppButton';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/constants/languages';

import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LETTER_SPACING,
  LINE_HEIGHT,
  RADIUS,
  SIZES,
  SPACING,
} from '@/theme';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);

  const handleContinue = () => {
    if (!selectedLanguage) {
      return;
    }

    router.push('/(auth)/shop-detail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View>
          <AuthHeader
            currentStep={3}
            totalSteps={4}
            onBack={() => router.back()}
            onClose={() => router.replace('/(auth)')}
          />

          <View style={styles.content}>
            <AppText style={styles.title}>Choose your{'\n'}language</AppText>

            <AppText variant="body" color="primary" style={styles.subtitle}>
              Choose your language
              {'\n'}
              You can change it later in Settings.
            </AppText>

            <View style={styles.languageGrid}>
              {LANGUAGES.map((language) => {
                const isSelected = selectedLanguage === language.id;

                return (
                  <Pressable
                    key={language.id}
                    onPress={() => setSelectedLanguage(language.id)}
                    style={[styles.languageCard, isSelected && styles.languageCardSelected]}
                  >
                    <View style={styles.languageText}>
                      <AppText variant="bodyMedium" style={styles.languageName}>
                        {language.name}
                      </AppText>

                      <AppText variant="caption" color="muted" style={styles.nativeName}>
                        {language.nativeName}
                      </AppText>
                    </View>

                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedLanguage}
          style={styles.button}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
  },

  content: {
    paddingTop: SIZES.authHeaderContentGap,
  },

  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.authTitle,
    lineHeight: LINE_HEIGHT.authTitle,
    letterSpacing: LETTER_SPACING.authTitle,
    color: COLORS.text.primary,
  },

  subtitle: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.authDescription,
  },

  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.xxl,
    rowGap: SPACING.md,
  },

  languageCard: {
    width: '48%',
    minHeight: SIZES.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: SIZES.borderStandard,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  languageCardSelected: {
    borderColor: COLORS.orange.normal,
  },

  languageText: {
    flex: 1,
    marginRight: SPACING.sm,
  },

  languageName: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },

  nativeName: {
    marginTop: SPACING.xxs,
    fontSize: FONT_SIZE.sm,
  },

  radio: {
    width: SIZES.backIcon,
    height: SIZES.backIcon,
    borderWidth: SIZES.borderStandard,
    borderColor: COLORS.border,
    borderRadius: SIZES.backIcon / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: COLORS.orange.normal,
  },

  radioDot: {
    width: SPACING.sm,
    height: SPACING.sm,
    borderRadius: SPACING.sm / 2,
    backgroundColor: COLORS.orange.normal,
  },

  button: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.sm,
  },
});
