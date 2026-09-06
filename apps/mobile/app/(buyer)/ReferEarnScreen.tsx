import React from 'react';
import { Image, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SPACING } from '../../theme';

import {
  ICONS,
  REFER_EARN_CONTENT,
  HOW_IT_WORKS_CONTENT,
  useReferEarn,
  UseReferEarnProps,
  referEarnStyles as styles,
} from '../../constants/referearnscreen';

export default function ReferEarnScreen(props: UseReferEarnProps) {
  const {
    referralCode,
    copied,
    howItWorksVisible,
    setHowItWorksVisible,
    inviteSending,
    handleCopyCode,
    handleBack,
    handleInviteFriends,
  } = useReferEarn(props);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.orange.normal} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.headerInner}>
            <View style={styles.header}>
              <Pressable hitSlop={SPACING.md} onPress={handleBack} style={styles.headerIconButton}>
                <Image source={ICONS.back} style={styles.headerBackIcon} resizeMode="contain" />
              </Pressable>

              <Text style={styles.headerTitle}>{REFER_EARN_CONTENT.headerTitle}</Text>

              <Pressable
                hitSlop={SPACING.md}
                onPress={() => setHowItWorksVisible(true)}
                style={styles.headerIconButton}
              >
                <Image source={ICONS.info} style={styles.headerInfoIcon} resizeMode="contain" />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentContainer}>
          <Image source={ICONS.illustration} style={styles.illustration} resizeMode="contain" />

          <Text style={styles.heading}>{REFER_EARN_CONTENT.heading}</Text>

          <Text style={styles.subheading}>{REFER_EARN_CONTENT.subheading}</Text>

          <View style={styles.referralCard}>
            <Text style={styles.codeCardLabel}>{REFER_EARN_CONTENT.referralCodeLabel}</Text>

            <View style={styles.codePill}>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>

            <Pressable onPress={handleCopyCode} style={styles.copyButton}>
              <Image source={ICONS.copy} style={styles.copyIcon} resizeMode="contain" />

              <Text style={styles.copyButtonText}>
                {copied ? REFER_EARN_CONTENT.copiedLabel : REFER_EARN_CONTENT.copyButtonLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Invite Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <Pressable
            onPress={handleInviteFriends}
            disabled={inviteSending}
            style={({ pressed }) => [
              styles.inviteButton,
              (pressed || inviteSending) && styles.inviteButtonPressed,
            ]}
          >
            <Image source={ICONS.invite} style={styles.inviteIcon} resizeMode="contain" />

            <Text style={styles.inviteButtonText}>{REFER_EARN_CONTENT.inviteButtonLabel}</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* How It Works Modal */}
      <Modal
        visible={howItWorksVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setHowItWorksVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setHowItWorksVisible(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>{HOW_IT_WORKS_CONTENT.title}</Text>

            {HOW_IT_WORKS_CONTENT.steps.map((step, index) => (
              <View
                key={step.title}
                style={[
                  styles.stepRow,
                  index === HOW_IT_WORKS_CONTENT.steps.length - 1 && styles.lastStepRow,
                ]}
              >
                <View style={styles.stepIconCircle}>
                  <Image source={step.icon} style={styles.stepIcon} resizeMode="contain" />
                </View>

                <View style={styles.stepTextGroup}>
                  <Text style={styles.stepTitle}>{step.title}</Text>

                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}

            <Pressable
              onPress={() => setHowItWorksVisible(false)}
              style={({ pressed }) => [styles.gotItButton, pressed && styles.inviteButtonPressed]}
            >
              <Text style={styles.gotItButtonText}>{HOW_IT_WORKS_CONTENT.gotItLabel}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
