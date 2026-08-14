import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import {
  CategorySection,
  HomeHeader,
  HomeSearchBar,
  PopularProductCard,
  ProductDealCard,
  PromoBanner,
} from '@/components/buyer/home';
import {
  HOME_BEST_DEALS,
  HOME_CATEGORIES,
  HOME_POPULAR_PRODUCTS,
  HOME_PROMO,
} from '@/constants/home';
import { COLORS, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING, useResponsive } from '@/theme';

export default function BuyerHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const { horizontalPadding } = useResponsive();

  const handleCategoryPress = useCallback((categoryId: string) => {
    router.push({
      pathname: '/(buyer)/category/[id]',
      params: { id: categoryId },
    });
  }, []);

  const handleViewAllCategories = useCallback(() => {
    router.push('/(buyer)/category');
  }, []);

  const handleProductPress = useCallback((productId: string) => {
    router.push({
      pathname: '/(buyer)/product/[id]',
      params: { id: productId },
    });
  }, []);

  const handleSearchPress = useCallback(() => {
    router.push('/(buyer)/category');
  }, []);

  const handlePromoPress = useCallback(() => {
    // Product/category destination can be wired when the catalog route is finalized.
  }, []);

  const handleAddToCart = useCallback((productId: string) => {
    // Cart integration will be connected to the cart store/API.
    console.log('Add to cart:', productId);
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <HomeHeader
            location="Kolar, Karnataka"
            walletBalance={500}
            onWalletPress={() => router.push('/(buyer)/profile')}
            onCartPress={() => router.push('/(buyer)/cart')}
          />

          <View
            style={[
              styles.searchContainer,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <HomeSearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onPress={handleSearchPress}
            />
          </View>

          <CategorySection
            categories={HOME_CATEGORIES}
            onCategoryPress={handleCategoryPress}
            onViewAllPress={handleViewAllCategories}
          />
        </View>

        <View style={styles.contentSection}>
          <View
            style={[
              styles.sectionHeader,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <SectionHeader title="Top Best Deal" showViewAll={false} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.horizontalContent,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            {HOME_BEST_DEALS.map((product) => (
              <ProductDealCard
                key={product.id}
                name={product.name}
                unit={product.unit}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
                onPress={() => handleProductPress(product.id)}
                onAddPress={() => handleAddToCart(product.id)}
              />
            ))}
          </ScrollView>

          <View
            style={[
              styles.bannerSection,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <PromoBanner
              title={HOME_PROMO.title}
              description={HOME_PROMO.description}
              image={HOME_PROMO.image}
              buttonTitle={HOME_PROMO.buttonTitle}
              onPress={handlePromoPress}
            />

            <View style={styles.pagination}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View
            style={[
              styles.sectionHeader,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <SectionHeader title="Popular Products" />
          </View>

          <View
            style={[
              styles.popularGrid,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            {HOME_POPULAR_PRODUCTS.map((product) => (
              <PopularProductCard
                key={product.id}
                name={product.name}
                image={product.image}
                onPress={() => handleProductPress(product.id)}
              />
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  showViewAll?: boolean;
}

function SectionHeader({ title, showViewAll = true }: SectionHeaderProps) {
  return (
    <>
      <AppText variant="subtitle" color="primary" style={styles.sectionTitle}>
        {title}
      </AppText>

      {showViewAll && (
        <Pressable accessibilityRole="button" accessibilityLabel={`View all ${title}`} hitSlop={8}>
          <AppText variant="caption" color="secondary">
            View All
          </AppText>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  heroSection: {
    backgroundColor: COLORS.orange.normal,
  },

  searchContainer: {
    paddingBottom: 0,
  },

  contentSection: {
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.orange.light,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontWeight: '600',
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
  },

  horizontalContent: {
    gap: SPACING.md,
  },

  bannerSection: {
    marginTop: SPACING.sm,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.border,
  },

  activeDot: {
    width: 18,
    backgroundColor: COLORS.orange.normal,
  },

  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },

  bottomSpacing: {
    height: SPACING.section,
  },
});
