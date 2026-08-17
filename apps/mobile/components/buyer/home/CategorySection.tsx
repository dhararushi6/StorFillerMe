import React, { useState } from 'react';
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

export function CategorySection({ categories, onCategoryPress }: CategorySectionProps) {
  const { home, horizontalPadding } = useResponsive();

  const [expanded, setExpanded] = useState(false);

  const visibleCategories = expanded ? categories.slice(0, 6) : categories.slice(0, 3);

  const handleViewToggle = () => {
    setExpanded((previous) => !previous);
  };

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
        {visibleCategories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            image={category.image}
            onPress={() => onCategoryPress?.(category.id)}
          />
        ))}
      </View>

      {categories.length > 3 && (
        <Pressable
          style={styles.viewAllButton}
          onPress={handleViewToggle}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'View less categories' : 'View all categories'}
          hitSlop={8}
        >
          <AppText variant="button" color="inverse">
            {expanded ? 'View Less' : 'View All'}
          </AppText>

          <AppText
            variant="button"
            color="inverse"
            style={[styles.arrow, expanded && styles.arrowUp]}
          >
            →
          </AppText>
        </Pressable>
      )}
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

  arrowUp: {
    transform: [{ rotate: '270deg' }],
  },
});
