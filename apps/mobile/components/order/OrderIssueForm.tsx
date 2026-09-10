import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import imageIcon from '@/assets/icons/image.png';
import type { Order } from '@/features/orders/orders.types';
import type { OrderHelpTopic } from '@/components/order/OrderHelpModal';
import userIcon from '@/assets/icons/user.png';
import shieldIcon from '@/assets/icons/shield.png';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

const MAX_DETAILS_LENGTH = 1200;

interface OrderIssueFormProps {
  order: Order;
  issue: OrderHelpTopic;
  onChangeIssue: () => void;
  onSubmit: (details: string) => void;
}

export function OrderIssueForm({ order, issue, onChangeIssue, onSubmit }: OrderIssueFormProps) {
  const [details, setDetails] = useState('');

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.orderSection}>
        <AppText variant="bodyMedium" color="primary" style={styles.orderNumber}>
          Order #{order.id}
        </AppText>

        <AppText variant="caption" color="primary">
          {order.deliveredAt ? `Delivered on ${order.deliveredAt}` : 'Order placed'}
        </AppText>
      </View>

      <AppText variant="bodyMedium" color="primary" style={styles.sectionTitle}>
        Selected issue
      </AppText>

      <View style={styles.selectedIssue}>
        <View style={styles.selectedIssueContent}>
          <AppText
            variant="bodyMedium"
            color="primary"
            style={styles.selectedIssueTitle}
            numberOfLines={1}
          >
            {issue.title}
          </AppText>

          <AppText
            variant="caption"
            color="primary"
            style={styles.selectedIssueDescription}
            numberOfLines={1}
          >
            {issue.description}
          </AppText>
        </View>

        <Pressable
          onPress={onChangeIssue}
          accessibilityRole="button"
          accessibilityLabel="Change selected issue"
          style={styles.changeButton}
        >
          <AppText variant="caption" color="primary" style={styles.changeButtonText}>
            Change
          </AppText>
        </Pressable>
      </View>

      <AppText variant="bodyMedium" color="primary" style={styles.sectionTitle}>
        Tell us more
      </AppText>

      <View style={styles.detailsBox}>
        <AppInput
          value={details}
          onChangeText={setDetails}
          maxLength={MAX_DETAILS_LENGTH}
          multiline
          textAlignVertical="top"
          placeholder="Please share more details about the issue..."
          inputContainerStyle={styles.detailsInputContainer}
          style={styles.detailsInput}
        />

        <AppText variant="caption" color="primary" style={styles.counter}>
          {details.length}/{MAX_DETAILS_LENGTH}
        </AppText>
      </View>

      <AppText variant="bodyMedium" color="primary" style={styles.sectionTitle}>
        Upload Images
      </AppText>

      <AppText variant="caption" color="primary" style={styles.imageDescription}>
        Add photos related to the issue
      </AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add image"
        style={({ pressed }) => [styles.imageUpload, pressed && styles.pressed]}
      >
        <Image source={imageIcon} style={styles.imageIcon} />

        <AppText variant="caption" color="primary" style={styles.addImageText}>
          Add Image
        </AppText>
      </Pressable>

      <AppText variant="caption" color="primary" style={styles.minimumImages}>
        Minimum 3 Images
      </AppText>

      <View style={styles.customerRow}>
        <Image source={userIcon} style={styles.userIcon} />

        <AppText variant="caption" color="primary" style={styles.customerName}>
          {order.deliveryDetails.customerName}
        </AppText>

        <AppText variant="caption" color="primary" style={styles.customerPhone}>
          {order.deliveryDetails.customerPhone}
        </AppText>
      </View>

      <View style={styles.notice}>
        <Image source={shieldIcon} style={styles.shieldIcon} />

        <AppText variant="caption" color="primary" style={styles.noticeText}>
          We will review your request and get back to you within 24 hours.
        </AppText>
      </View>

      <AppButton title="Submit Request" onPress={() => onSubmit(details)} size="medium" fullWidth />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  orderSection: {
    marginBottom: SPACING.md,
  },

  orderNumber: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.xs,
  },

  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.sm,
  },

  selectedIssue: {
    minHeight: SIZES.smallButtonHeight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  selectedIssueContent: {
    flex: 1,
  },

  selectedIssueTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },

  selectedIssueDescription: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
  },

  changeButton: {
    width: SIZES.issueChangeButtonWidth,
    height: SIZES.issueChangeButtonHeight,
    paddingHorizontal: SPACING.sm,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.orange.normal,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  changeButtonText: {
    color: COLORS.orange.normal,
    fontSize: FONT_SIZE.sm,
  },

  detailsBox: {
    height: SIZES.reviewInputHeight,
    marginBottom: SPACING.md,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.orange.card,
    borderRadius: RADIUS.md,
  },

  detailsInputContainer: {
    height: SIZES.reviewInputHeight,
    minHeight: SIZES.reviewInputHeight,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    alignItems: 'stretch',
  },

  detailsInput: {
    flex: 1,
    minHeight: 0,
    padding: 0,
    margin: 0,
    fontSize: FONT_SIZE.sm,
  },

  counter: {
    position: 'absolute',
    right: SPACING.sm,
    bottom: SPACING.xs,
    fontSize: FONT_SIZE.xs,
  },

  imageDescription: {
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
  },

  imageUpload: {
    width: SIZES.issueDetailsImageBoxWidth,
    height: SIZES.issueDetailsImageBoxHeight,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.imageUpload,
    alignItems: 'center',
    justifyContent: 'center',
  },

  minimumImages: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.sm,
  },

  customerRow: {
    minHeight: SIZES.compactButtonHeight,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  customerName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
  },

  customerPhone: {
    marginLeft: SPACING.xs,
  },

  notice: {
    minHeight: SIZES.issueDetailsNoticeHeight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  noticeIcon: {
    color: COLORS.orange.normal,
  },

  noticeText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
  },
  userIcon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    resizeMode: 'contain',
  },

  shieldIcon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    resizeMode: 'contain',
  },
  pressed: {
    opacity: 0.75,
  },
});
