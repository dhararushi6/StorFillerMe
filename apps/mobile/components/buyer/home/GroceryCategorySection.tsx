import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProductImageGroup } from './ProductImageGroup';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from '@/theme';

interface GroceryCategory {
  id: string;
  title: string;
  images: readonly number[];
}

interface GroceryCategorySectionProps {
  title: string;
  categories: readonly GroceryCategory[];
  onCategoryPress?: (categoryId: string) => void;
}

export function GroceryCategorySection({
  title,
  categories,
  onCategoryPress,
}: GroceryCategorySectionProps) {
  return (
    <View style={styles.container}>
      <AppText variant="subheading" style={styles.title}>
        {title}
      </AppText>

      <View style={styles.grid}>
        {categories.map((category, index) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.card,
              index % 4 !== 3 && styles.cardSpacing,
              pressed && styles.pressed,
            ]}
            onPress={() => onCategoryPress?.(category.id)}
            accessibilityRole="button"
            accessibilityLabel={category.title}
          >
            <View style={styles.imageContainer}>
              <ProductImageGroup
                images={category.images}
                centerSingleImage={category.images.length === 1}
              />
            </View>

            <AppText variant="caption" color="primary" style={styles.categoryTitle}>
              {category.title}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: SPACING.md,
  },

  card: {
    width: '22%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  cardSpacing: {
    marginRight: '4%',
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },

  categoryTitle: {
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.85,
  },
});
