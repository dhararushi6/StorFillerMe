import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import storeIllustration from '@/assets/images/home/store-illustration.png';
import { AppText } from '@/components/common/AppText';
import { COLORS, SPACING, useResponsive } from '@/theme';

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
  const { home, horizontalPadding } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: horizontalPadding,
        },
      ]}
    >
      <View style={styles.headingRow}>
        <View style={styles.headingContent}>
          <AppText variant="subheading" color="inverse" style={styles.title}>
            Shop by Category
          </AppText>

          <AppText variant="caption" color="inverse" style={styles.subtitle}>
            Find everything you need for your store
          </AppText>
        </View>

        <Image
          source={storeIllustration}
          style={{
            width: home.categoryIllustrationSize,
            height: home.categoryIllustrationSize,
          }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.categoriesGrid}>
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
    paddingTop: 0,
    paddingBottom: SPACING.sm,
  },

  headingRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headingContent: {
    flex: 1,
    paddingRight: SPACING.sm,
  },

  title: {
    marginBottom: SPACING.xs,
  },

  subtitle: {
    opacity: 0.9,
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.md,
    marginTop: 0,
  },

  viewAllButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },

  arrow: {
    marginLeft: SPACING.xs,
  },
});
