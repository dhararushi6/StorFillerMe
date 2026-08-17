import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import {
  DeliveryAddressCard,
  ProductDetailRow,
  ProductGallery,
  ProductSectionHeader,
  ProductSummary,
  ProductTopBar,
  QuantitySelector,
  RatingsSummary,
  ReviewCard,
  SimilarProductCard,
} from '@/components/buyer/product';
import {
  getProductById,
  PRODUCT_ADDRESS,
  PRODUCT_DETAIL_ROWS,
  PRODUCT_QUANTITY_OPTIONS,
  PRODUCT_RATING_SUMMARY,
  PRODUCT_REVIEWS,
  PRODUCT_SECTION_TITLES,
  PRODUCT_SIMILAR,
  PRODUCT_YOU_MAY_ALSO_LIKE,
} from '@/constants/product';
import { COLORS, SPACING, useResponsive } from '@/theme';

export default function BuyerProductScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const productDetail = useMemo(() => getProductById(id), [id]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuantityId, setSelectedQuantityId] = useState<string>(
    PRODUCT_QUANTITY_OPTIONS[0].id,
  );
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number>(
    PRODUCT_RATING_SUMMARY.selectedFilter,
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { horizontalPadding } = useResponsive();

  const handleProductPress = useCallback((productId: string) => {
    router.push({
      pathname: '/(buyer)/product/[id]',
      params: { id: productId },
    });
  }, []);

  const handleSearchSubmit = useCallback(() => {
    router.push('/(buyer)/category');
  }, []);

  const handleAddToCart = useCallback(() => {
    // Cart integration will be connected to the cart store/API.
  }, []);

  const handleChangeAddress = useCallback(() => {
    router.push('/(buyer)/profile');
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Curved Hero Section */}
        <View style={styles.heroSection}>
          <ProductTopBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onCartPress={() => router.push('/(buyer)/cart')}
          />

          <View style={sidePadding}>
            <ProductGallery
              images={productDetail.gallery}
              expiryLabel={productDetail.expiryLabel}
            />

            <View style={styles.summary}>
              <ProductSummary
                name={productDetail.name}
                rating={productDetail.rating}
                reviewsLabel={productDetail.reviewsLabel}
                price={productDetail.price}
                oldPrice={productDetail.oldPrice}
                isWishlisted={isWishlisted}
                onWishlistPress={() => setIsWishlisted((wishlisted) => !wishlisted)}
              />
            </View>
          </View>
        </View>

        {/* Lower Body Section */}
        <View style={sidePadding}>
          <View style={styles.section}>
            <QuantitySelector
              title={PRODUCT_SECTION_TITLES.quantity}
              selectedLabel={productDetail.selectedQuantityLabel}
              options={PRODUCT_QUANTITY_OPTIONS}
              selectedId={selectedQuantityId}
              onSelect={setSelectedQuantityId}
            />
          </View>

          <View style={styles.section}>
            <AppButton title={PRODUCT_SECTION_TITLES.addToCart} onPress={handleAddToCart} />
          </View>

          <View style={styles.section}>
            <ProductSectionHeader title={PRODUCT_SECTION_TITLES.address} />

            <View style={styles.sectionBody}>
              <DeliveryAddressCard
                name={PRODUCT_ADDRESS.name}
                address={PRODUCT_ADDRESS.address}
                changeLabel={PRODUCT_ADDRESS.changeLabel}
                deliveryWindow={PRODUCT_ADDRESS.deliveryWindow}
                onChangePress={handleChangeAddress}
              />
            </View>
          </View>

          <View style={styles.section}>
            <ProductSectionHeader title={PRODUCT_SECTION_TITLES.productDetails} />

            <View style={[styles.sectionBody, styles.detailRows]}>
              {PRODUCT_DETAIL_ROWS.map((row) => (
                <ProductDetailRow key={row.id} label={row.label} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={sidePadding}>
            <ProductSectionHeader
              title={PRODUCT_SECTION_TITLES.similarProducts}
              actionLabel={PRODUCT_SECTION_TITLES.viewAll}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.carousel, sidePadding]}
          >
            {PRODUCT_SIMILAR.map((similarProduct) => (
              <SimilarProductCard
                key={similarProduct.id}
                name={similarProduct.name}
                unit={similarProduct.unit}
                price={similarProduct.price}
                oldPrice={similarProduct.oldPrice}
                image={similarProduct.image}
                onPress={() => handleProductPress(similarProduct.id)}
                onAddPress={handleAddToCart}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={sidePadding}>
            <ProductSectionHeader
              title={PRODUCT_SECTION_TITLES.youMayAlsoLike}
              actionLabel={PRODUCT_SECTION_TITLES.viewAll}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.carousel, sidePadding]}
          >
            {PRODUCT_YOU_MAY_ALSO_LIKE.map((suggestedProduct) => (
              <SimilarProductCard
                key={suggestedProduct.id}
                name={suggestedProduct.name}
                unit={suggestedProduct.unit}
                price={suggestedProduct.price}
                oldPrice={suggestedProduct.oldPrice}
                image={suggestedProduct.image}
                onPress={() => handleProductPress(suggestedProduct.id)}
                onAddPress={handleAddToCart}
              />
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, sidePadding]}>
          <ProductSectionHeader title={PRODUCT_SECTION_TITLES.ratingsAndReviews} />

          <View style={styles.sectionBody}>
            <RatingsSummary
              value={PRODUCT_RATING_SUMMARY.value}
              label={PRODUCT_RATING_SUMMARY.label}
              filters={PRODUCT_RATING_SUMMARY.filters}
              selectedFilter={selectedRatingFilter}
              onFilterPress={setSelectedRatingFilter}
            />
          </View>

          {PRODUCT_REVIEWS.map((review) => (
            <ReviewCard
              key={review.id}
              author={review.author}
              rating={review.rating}
              comment={review.comment}
              photo={review.photo}
              date={review.date}
            />
          ))}

          <Pressable
            style={styles.viewMore}
            accessibilityRole="button"
            accessibilityLabel="View more reviews"
            hitSlop={8}
          >
            <AppText variant="bodyMedium" color="primary">
              {PRODUCT_SECTION_TITLES.viewMore}
            </AppText>

            <AppIcon name="chevronDown" size="md" color={COLORS.text.primary} />
          </Pressable>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    backgroundColor: COLORS.orange.light,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: SPACING.xl,
  },

  summary: {
    marginTop: SPACING.lg,
  },

  section: {
    marginTop: SPACING.xl,
  },

  sectionBody: {
    marginTop: SPACING.md,
  },

  detailRows: {
    gap: SPACING.md,
  },

  carousel: {
    gap: SPACING.md,
    paddingTop: SPACING.md,
  },

  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },

  bottomSpacing: {
    height: SPACING.section,
  },
});
