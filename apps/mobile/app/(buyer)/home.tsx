import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import {
  CategorySection,
  CategoryShowcase,
  GroceryCategorySection,
  HomeHeader,
  HomeSearchBar,
  ProductDealList,
  PromoBanner,
  RiceVarietySection,
} from '@/components/buyer/home';
import {
  HOME_BEST_DEALS,
  HOME_CATEGORIES,
  HOME_GROCERY_CATEGORIES,
  HOME_POPULAR_PRODUCTS,
  HOME_PROMO,
  HOME_SNACKS_CATEGORIES,
  HOME_STATIONERY_CATEGORIES,
  HOME_BEAUTY_CATEGORIES,
  HOME_STATIONARY_GRID_CATEGORIES,
  HOME_OTHER_CATEGORIES,
  HOME_PERSONAL_CARE_PRODUCTS,
  HOME_DRINKS_PRODUCTS,
  HOME_GHEE_PRODUCTS,
  HOME_RICE_VARIETIES,
  HOME_RICE_PRODUCTS,
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
        {/* Hero Section */}
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

        {/* Main Content */}
        <View style={styles.contentSection}>
          {/* Top Best Deal */}
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

          <ProductDealList
            products={HOME_BEST_DEALS}
            horizontalPadding={horizontalPadding}
            onProductPress={handleProductPress}
            onAddPress={handleAddToCart}
          />
          {/* Promo Banner */}
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

          {/* Popular Products */}
          <View
            style={[
              styles.popularSection,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <View style={styles.popularHeader}>
              <AppText variant="subtitle" style={styles.popularTitle}>
                Popular Products
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all Popular Products"
                hitSlop={8}
              >
                <AppText variant="caption" style={styles.popularViewAll}>
                  View All
                </AppText>
              </Pressable>
            </View>

            <ProductDealList
              products={HOME_POPULAR_PRODUCTS}
              onProductPress={handleProductPress}
              onAddPress={handleAddToCart}
            />
          </View>
          {/* Stationery Categories */}
          <View style={[styles.showcaseSection, { paddingHorizontal: horizontalPadding }]}>
            <CategoryShowcase
              title="Stationery Categories"
              description="Everything you need, All in one place!"
              categories={HOME_STATIONERY_CATEGORIES}
              onCategoryPress={handleCategoryPress}
            />
          </View>
          <View style={[styles.categorySection, { paddingHorizontal: horizontalPadding }]}>
            <GroceryCategorySection
              title="Grocery"
              categories={HOME_GROCERY_CATEGORIES}
              onCategoryPress={handleCategoryPress}
            />
          </View>
          <View style={[styles.categorySection, { paddingHorizontal: horizontalPadding }]}>
            <GroceryCategorySection
              title="Snacks & drinks"
              categories={HOME_SNACKS_CATEGORIES}
              onCategoryPress={handleCategoryPress}
            />
          </View>
          <View style={[styles.categorySection, { paddingHorizontal: horizontalPadding }]}>
            <GroceryCategorySection
              title="Beauty & personal care"
              categories={HOME_BEAUTY_CATEGORIES}
              onCategoryPress={handleCategoryPress}
            />
          </View>
          <View style={[styles.categorySection, { paddingHorizontal: horizontalPadding }]}>
            <GroceryCategorySection
              title="Stationary"
              categories={HOME_STATIONARY_GRID_CATEGORIES}
              onCategoryPress={handleCategoryPress}
            />
          </View>

          <View style={[styles.categorySection, { paddingHorizontal: horizontalPadding }]}>
            <GroceryCategorySection
              title="Other"
              categories={HOME_OTHER_CATEGORIES}
              onCategoryPress={handleCategoryPress}
            />
          </View>

          {/* Household Cleaning Needs */}
          <View
            style={[
              styles.productSection,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <View style={styles.productSectionHeader}>
              <AppText variant="subtitle" color="primary" style={styles.productSectionTitle}>
                Household cleaning needs
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all Household cleaning needs"
                hitSlop={8}
                onPress={handleViewAllCategories}
              >
                <AppText variant="caption" style={styles.viewAll}>
                  View All
                </AppText>
              </Pressable>
            </View>
            <ProductDealList
              products={HOME_BEST_DEALS}
              onProductPress={handleProductPress}
              onAddPress={handleAddToCart}
            />
          </View>
          <RiceVarietySection
            title="Rice Varieties"
            varieties={HOME_RICE_VARIETIES}
            products={HOME_RICE_PRODUCTS}
            weightLabel="1 KG"
            exploreLabel="Explore All"
            horizontalPadding={horizontalPadding}
            onProductPress={handleProductPress}
            onAddPress={handleAddToCart}
            onExplorePress={handleViewAllCategories}
          />
          {/* Personal Care & More */}
          <View
            style={[
              styles.productSection,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <View style={styles.productSectionHeader}>
              <AppText variant="subtitle" color="primary" style={styles.productSectionTitle}>
                Personal care & more
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all Personal care & more"
                hitSlop={8}
                onPress={handleViewAllCategories}
              >
                <AppText variant="caption" style={styles.viewAll}>
                  View All
                </AppText>
              </Pressable>
            </View>

            <ProductDealList
              products={HOME_PERSONAL_CARE_PRODUCTS}
              onProductPress={handleProductPress}
              onAddPress={handleAddToCart}
            />
          </View>

          {/* Drinks */}
          <View
            style={[
              styles.productSection,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <View style={styles.productSectionHeader}>
              <AppText variant="subtitle" color="primary" style={styles.productSectionTitle}>
                Drinks
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all Drinks"
                hitSlop={8}
                onPress={handleViewAllCategories}
              >
                <AppText variant="caption" style={styles.viewAll}>
                  View All
                </AppText>
              </Pressable>
            </View>

            <ProductDealList
              products={HOME_DRINKS_PRODUCTS}
              onProductPress={handleProductPress}
              onAddPress={handleAddToCart}
            />
          </View>

          {/* Ghee */}
          <View
            style={[
              styles.productSection,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <View style={styles.productSectionHeader}>
              <AppText variant="subtitle" color="primary" style={styles.productSectionTitle}>
                Ghee
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all Ghee"
                hitSlop={8}
                onPress={handleViewAllCategories}
              >
                <AppText variant="caption" style={styles.viewAll}>
                  View All
                </AppText>
              </Pressable>
            </View>

            <ProductDealList
              products={HOME_GHEE_PRODUCTS}
              onProductPress={handleProductPress}
              onAddPress={handleAddToCart}
            />
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
      <AppText variant="subheading" color="primary" style={styles.sectionTitle}>
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
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xxl,
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

  /* Popular Products */

  popularSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.orange.banner,
  },

  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },

  popularTitle: {
    color: COLORS.orange.promoText,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.xl,
    fontWeight: '500',
  },

  popularViewAll: {
    color: COLORS.text.inverse,
  },

  bottomSpacing: {
    height: SPACING.section,
  },
  showcaseSection: {
    marginTop: SPACING.lg,
  },
  categorySection: {
    marginTop: SPACING.xs,
  },
  productSection: {
    marginTop: SPACING.xs,
  },

  productSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },

  productSectionTitle: {
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xxl,
    fontWeight: '500',
  },
  viewAll: {
    color: COLORS.orange.normal,
  },
});
