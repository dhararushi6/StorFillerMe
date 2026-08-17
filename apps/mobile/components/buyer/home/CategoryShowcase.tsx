import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SIZES, SPACING } from '@/theme';

interface ShowcaseCategory {
  id: string;
  title: string;
  image: number;
  backgroundColor: string;
}

interface CategoryShowcaseProps {
  title: string;
  description: string;
  categories: readonly ShowcaseCategory[];
  onCategoryPress?: (categoryId: string) => void;
}

export function CategoryShowcase({
  title,
  description,
  categories,
  onCategoryPress,
}: CategoryShowcaseProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headingContent}>
          <AppText variant="bodyMedium" color="primary" style={styles.title}>
            {title}
          </AppText>

          <AppText variant="caption" color="secondary" style={styles.description}>
            {description}
          </AppText>
        </View>

        <View style={styles.navigation}>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Previous categories"
          >
            <AppIcon name="chevronLeft" size="md" color={COLORS.text.secondary} />
          </Pressable>

          <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Next categories">
            <AppIcon name="chevronRight" size="md" color={COLORS.text.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryCard,
              { backgroundColor: category.backgroundColor },
              pressed && styles.pressed,
            ]}
            onPress={() => onCategoryPress?.(category.id)}
            accessibilityRole="button"
            accessibilityLabel={category.title}
          >
            <AppText variant="bodyMedium" color="primary" style={styles.categoryTitle}>
              {category.title}
            </AppText>

            <Image source={category.image} style={styles.categoryImage} resizeMode="contain" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.orange.showcase,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  headingContent: {
    flex: 1,
    paddingRight: SPACING.sm,
  },

  title: {
    fontWeight: '500',
  },

  description: {
    marginTop: SPACING.xs,
    color: COLORS.orange.normal,
    maxWidth: 180,
  },

  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: SPACING.xs,
  },

  categoryContent: {
    gap: SPACING.lg,
    paddingTop: SPACING.md,
  },

  categoryCard: {
    width: SIZES.showcaseCardWidth,
    height: SIZES.showcaseCardHeight,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  categoryTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.category,
    textAlign: 'center',
  },

  categoryImage: {
    width: '100%',
    height: SIZES.showcaseImageHeight,
  },

  pressed: {
    opacity: 0.85,
  },
});
