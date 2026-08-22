import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from '@/theme';

import { ProductDealItem, ProductDealList } from './ProductDealList';

export interface RiceVariety {
  id: string;
  title: string;
  image: number;
}

interface RiceVarietySectionProps {
  title: string;
  varieties: readonly RiceVariety[];
  products: readonly ProductDealItem[];
  weightLabel: string;
  exploreLabel: string;
  horizontalPadding: number;
  onProductPress?: (productId: string) => void;
  onAddPress?: (productId: string) => void;
  onExplorePress?: () => void;
}

export function RiceVarietySection({
  title,
  varieties,
  products,
  weightLabel,
  exploreLabel,
  horizontalPadding,
  onProductPress,
  onAddPress,
  onExplorePress,
}: RiceVarietySectionProps) {
  const [selectedVariety, setSelectedVariety] = useState<string | undefined>(varieties[0]?.id);

  const handleVarietyPress = (varietyId: string) => {
    setSelectedVariety(varietyId);
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: horizontalPadding,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="subheading" color="primary" style={styles.title}>
          {title}
        </AppText>

        <View style={styles.headerControls}>
          <Pressable
            style={styles.arrowButton}
            accessibilityRole="button"
            accessibilityLabel={`Previous ${title}`}
            hitSlop={8}
          >
            <AppText style={styles.arrow}>‹</AppText>
          </Pressable>

          <AppText variant="bodyMedium" color="primary" style={styles.weightLabel}>
            {weightLabel}
          </AppText>

          <Pressable
            style={styles.arrowButton}
            accessibilityRole="button"
            accessibilityLabel={`Next ${title}`}
            hitSlop={8}
          >
            <AppText style={styles.arrow}>›</AppText>
          </Pressable>
        </View>
      </View>

      {/* Rice Varieties */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.varietyContent,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        {varieties.map((variety) => {
          const isSelected = selectedVariety === variety.id;

          return (
            <Pressable
              key={variety.id}
              style={styles.varietyItem}
              onPress={() => handleVarietyPress(variety.id)}
              accessibilityRole="button"
              accessibilityLabel={variety.title}
            >
              <View style={styles.varietyImageContainer}>
                <Image source={variety.image} style={styles.varietyImage} resizeMode="contain" />
              </View>

              <AppText
                variant="caption"
                color="primary"
                numberOfLines={2}
                style={styles.varietyTitle}
              >
                {variety.title}
              </AppText>

              {isSelected && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Products */}
      <View style={styles.productListContainer}>
        <ProductDealList
          products={products}
          horizontalPadding={SPACING.lg}
          onProductPress={onProductPress}
          onAddPress={onAddPress}
        />
      </View>

      {/* Explore All */}
      <Pressable
        style={({ pressed }) => [styles.exploreButton, pressed && styles.pressed]}
        onPress={onExplorePress}
        accessibilityRole="button"
        accessibilityLabel={exploreLabel}
      >
        <AppText variant="bodyMedium" style={styles.exploreText}>
          {exploreLabel}
        </AppText>

        <AppText style={styles.exploreArrow}>→</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.orange.showcase,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },

  header: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },

  title: {
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.xxl,
    fontWeight: '500',
  },

  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  arrowButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
    color: COLORS.text.primary,
  },

  weightLabel: {
    fontSize: FONT_SIZE.lg,
  },

  varietyContent: {
    gap: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },

  varietyItem: {
    width: 78,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  varietyImageContainer: {
    width: 58,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  varietyImage: {
    width: '100%',
    height: '100%',
  },

  varietyTitle: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.md,
  },

  activeIndicator: {
    width: '100%',
    height: 2,
    marginTop: SPACING.xs,
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
  },

  productListContainer: {
    marginTop: SPACING.sm,
  },

  exploreButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    minHeight: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },

  exploreText: {
    color: COLORS.text.inverse,
    fontSize: FONT_SIZE.lg,
  },

  exploreArrow: {
    color: COLORS.text.inverse,
    fontSize: FONT_SIZE.xxl,
  },

  pressed: {
    opacity: 0.85,
  },
});
