import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING, useResponsive } from '@/theme';
import { HELP_TOPICS } from '@/features/orders/orders.constants';
export type OrderHelpTopic = (typeof HELP_TOPICS)[number];

interface OrderHelpModalProps {
  visible: boolean;
  onClose: () => void;
  onTopicPress?: (topic: OrderHelpTopic) => void;
}

export function OrderHelpModal({ visible, onClose, onTopicPress }: OrderHelpModalProps) {
  const { horizontalPadding } = useResponsive();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={[
          styles.overlay,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close help modal"
        />
        <View style={styles.modal}>
          <View style={styles.handle} />
          <AppText variant="bodyMedium" color="primary" style={styles.title}>
            Need help with this order?
          </AppText>

          <AppText variant="caption" color="primary" style={styles.subtitle}>
            Select a topic below and we'll help you right away
          </AppText>

          <View style={styles.topicList}>
            {HELP_TOPICS.map((topic) => (
              <Pressable
                key={topic.id}
                onPress={() => onTopicPress?.(topic)}
                accessibilityRole="button"
                accessibilityLabel={topic.title}
                style={({ pressed }) => [styles.topic, pressed && styles.pressed]}
              >
                <View style={styles.topicContent}>
                  <AppText variant="bodyMedium" color="primary" style={styles.topicTitle}>
                    {topic.title}
                  </AppText>

                  <AppText variant="caption" color="primary" style={styles.topicDescription}>
                    {topic.description}
                  </AppText>
                </View>

                <AppIcon name="chevronRight" size="md" color={COLORS.text.primary} />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.overlay,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modal: {
    width: '100%',
    maxWidth: SIZES.helpModalMaxWidth,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },

  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontSize: FONT_SIZE.sm,
  },

  topicList: {
    gap: SPACING.xs,
  },

  topic: {
    height: SIZES.helpModalTopicHeight,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  topicContent: {
    flex: 1,
  },

  topicTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },

  topicDescription: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
  },

  pressed: {
    opacity: 0.75,
  },
  handle: {
    width: SIZES.helpModalHandleWidth,
    height: SIZES.helpModalHandleHeight,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.black,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
});
