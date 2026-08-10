import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import storeIllustration from '@/assets/images/home/store-illustration.png';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING } from '@/theme';

import { CategoryCard } from './CategoryCard';

interface CategoryItem {
  id: string;
  title: string;
  image: number;
}

interface CategorySectionProps {
  categories: readonly CategoryItem[];
  onCategoryPress?: (categoryId: string) => void;
  onViewAllPress?: () => void;
}

export function CategorySection({
  categories,
  onCategoryPress,
  onViewAllPress,
}: CategorySectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View style={styles.headingContent}>
          <AppText variant="heading" color="inverse" style={styles.title}>
            Shop by Category
          </AppText>

          <AppText variant="caption" color="inverse" style={styles.subtitle}>
            Find everything your store needs
          </AppText>
        </View>

        <Image source={storeIllustration} style={styles.illustration} resizeMode="contain" />
      </View>

      <View style={styles.categoriesRow}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            image={category.image}
            onPress={() => onCategoryPress?.(category.id)}
          />
        ))}
      </View>

      <Pressable
        style={styles.viewAllButton}
        onPress={onViewAllPress}
        accessibilityRole="button"
        accessibilityLabel="View all categories"
        hitSlop={8}
      >
        <AppText variant="button" color="inverse">
          View All
        </AppText>

        <AppText variant="button" color="inverse" style={styles.arrow}>
          →
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.orange.normal,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  headingRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headingContent: {
    flex: 1,
    paddingRight: SPACING.sm,
  },

  title: {
    fontSize: 22,
  },

  subtitle: {
    marginTop: SPACING.xs,
    opacity: 0.9,
  },

  illustration: {
    width: 92,
    height: 92,
  },

  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  viewAllButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.text.inverse,
    borderRadius: RADIUS.pill,
  },

  arrow: {
    marginLeft: SPACING.xs,
  },
});
