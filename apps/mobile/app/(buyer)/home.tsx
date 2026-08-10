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
import { COLORS, RADIUS, SPACING } from '@/theme';

export default function BuyerHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

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

          <View style={styles.searchContainer}>
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
          <SectionHeader title="Top Best Deal" />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
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

          <View style={styles.bannerSection}>
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
            </View>
          </View>

          <SectionHeader title="Popular Products" />

          <View style={styles.popularGrid}>
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
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <AppText variant="subheading" color="primary">
        {title}
      </AppText>

      <Pressable accessibilityRole="button" accessibilityLabel={`View all ${title}`} hitSlop={8}>
        <AppText variant="caption" color="secondary">
          View All
        </AppText>
      </Pressable>
    </View>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  contentSection: {
    paddingTop: SPACING.xxl,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },

  horizontalContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },

  bannerSection: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
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
    paddingHorizontal: SPACING.lg,
  },

  bottomSpacing: {
    height: SPACING.section,
  },
});
