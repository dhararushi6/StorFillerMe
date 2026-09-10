import React, { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ProductDealCard } from '@/components/buyer/home/ProductDealCard';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  ICON_SIZES,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  useResponsive,
} from '@/theme';
import { INPUT_THEME } from '@/constants/theme';
import { HOME_BEST_DEALS } from '@/constants/home';
import microphoneIcon from '@/assets/icons/microphone.png';
import storeIllustration from '@/assets/images/home/store-illustration.png';

const TRENDING_SEARCHES = [
  'Rice',
  'Dals',
  'Oils',
  'Soft Drinks',
  'Masalas',
  'Juices',
  'Chocolate',
  'Onion',
  'Tomato',
  'Books',
  'Pens',
  'Pencils',
] as const;

const RICE_SUGGESTIONS = [
  'Rice',
  'Sona Masuri Rice',
  'Basmati Rice',
  'Brown Rice',
  'Red Rice',
] as const;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { horizontalPadding } = useResponsive();

  const [query, setQuery] = useState('');

  const isTyped = query.trim().length > 0;

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/(buyer)/home');
    }
  }, [navigation]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  const handleSelectQuery = useCallback((selected: string) => {
    setQuery(selected);
  }, []);

  const handleProductPress = useCallback((id: string) => {
    router.push({
      pathname: '/(buyer)/product/[id]',
      params: { id },
    });
  }, []);

  return (
    <View style={styles.screen}>
      {/* Search Header: Single rounded pill with back button inside on the left */}
      <View
        style={[
          styles.headerContainer,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: Math.max(insets.top, SPACING.md) + SPACING.xs,
          },
        ]}
      >
        <View style={styles.searchPill}>
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={SPACING.sm}
            style={styles.backButton}
          >
            <AppIcon name="back" size="md" color={COLORS.text.primary} />
          </Pressable>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={COLORS.text.muted}
            autoFocus
            returnKeyType="search"
            style={styles.input}
          />

          {isTyped ? (
            <Pressable
              onPress={handleClear}
              accessibilityRole="button"
              accessibilityLabel="Clear search input"
              hitSlop={SPACING.sm}
              style={styles.actionButton}
            >
              <AppIcon name="close" size="sm" color={COLORS.text.muted} />
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voice search"
              hitSlop={SPACING.sm}
              style={styles.actionButton}
            >
              <Image source={microphoneIcon} style={styles.micIcon} resizeMode="contain" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content: Typed Suggestions vs Initial State */}
      {isTyped ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.suggestionsContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {RICE_SUGGESTIONS.map((suggestion, index) => (
            <Pressable
              key={suggestion}
              onPress={() => handleSelectQuery(suggestion)}
              style={[
                styles.suggestionRow,
                index === RICE_SUGGESTIONS.length - 1 && styles.suggestionRowLast,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Search suggestion ${suggestion}`}
            >
              <AppIcon name="search" size="md" color={COLORS.text.muted} />
              <AppText variant="body" color="primary" style={styles.suggestionText}>
                {suggestion}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.initialContent, { paddingHorizontal: horizontalPadding }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Trending Searches Section */}
          <View style={styles.section}>
            <AppText variant="subheading" color="primary" style={styles.sectionTitle}>
              Trending Searches
            </AppText>

            <View style={styles.chipsContainer}>
              {TRENDING_SEARCHES.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => handleSelectQuery(item)}
                  style={styles.trendingChip}
                  accessibilityRole="button"
                  accessibilityLabel={`Trending search ${item}`}
                >
                  <AppText variant="caption" style={styles.chipText}>
                    {item}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Previously Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <AppText variant="subheading" color="primary" style={styles.sectionTitle}>
                Previously
              </AppText>

              <Pressable hitSlop={SPACING.sm}>
                <AppText variant="caption" style={styles.viewAllText}>
                  View All
                </AppText>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {HOME_BEST_DEALS.map((product: (typeof HOME_BEST_DEALS)[number]) => (
                <ProductDealCard
                  key={product.id}
                  name={product.name}
                  unit={product.unit}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                  onPress={() => handleProductPress(product.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Store Filler Specials Section */}
          <View style={styles.section}>
            <AppText variant="subheading" color="primary" style={styles.sectionTitle}>
              Store Filler Specials
            </AppText>

            <View style={styles.specialsCard}>
              <View style={styles.specialsContent}>
                <AppText variant="subheading" style={styles.specialsTitle}>
                  Bulk savings, Better business!
                </AppText>

                <AppText variant="caption" style={styles.specialsDescription}>
                  Get better prices on bulk orders.
                </AppText>
              </View>

              <Image source={storeIllustration} style={styles.specialsImage} resizeMode="contain" />

              <Pressable
                style={({ pressed }: { pressed: boolean }) => [
                  styles.specialsButton,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Shop Bulk Deals"
              >
                <AppText variant="button" color="inverse" style={styles.specialsButtonText}>
                  Shop Bulk Deals
                </AppText>
                <AppText variant="button" color="inverse" style={styles.specialsArrow}>
                  →
                </AppText>
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Search Header: Single rounded pill */
  headerContainer: {
    paddingBottom: SPACING.md,
  },

  searchPill: {
    height: INPUT_THEME.height,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: INPUT_THEME.borderWidth,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
  },

  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: SPACING.sm,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    paddingHorizontal: SPACING.xs,
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: SPACING.xs,
  },

  micIcon: {
    width: ICON_SIZES.sm,
    height: ICON_SIZES.sm,
  },

  /* Content */
  scroll: {
    flex: 1,
  },

  initialContent: {
    paddingTop: SPACING.sm,
  },

  suggestionsContent: {
    paddingTop: SPACING.sm,
  },

  /* Typed Suggestions */
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: INPUT_THEME.borderWidth,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },

  suggestionRowLast: {
    borderBottomWidth: 0,
  },

  suggestionText: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },

  /* Section Styling */
  section: {
    marginBottom: SPACING.xl,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },

  viewAllText: {
    color: COLORS.orange.normal,
    fontFamily: FONT_FAMILY.medium,
  },

  /* Trending Chips */
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  trendingChip: {
    backgroundColor: COLORS.orange.light,
    borderWidth: INPUT_THEME.borderWidth,
    borderColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },

  chipText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.orange.normal,
  },

  /* Previously Carousel */
  carouselContent: {
    gap: SPACING.md,
    paddingRight: SPACING.md,
  },

  /* Specials Card */
  specialsCard: {
    height: 279,
    backgroundColor: COLORS.orange.banner,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },

  specialsContent: {
    zIndex: 2,
    paddingTop: SPACING.md,
    paddingLeft: 10,
    maxWidth: '85%',
  },

  specialsTitle: {
    color: COLORS.orange.promoText,
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },

  specialsDescription: {
    marginTop: SPACING.xs,
    marginLeft: -1,
    color: COLORS.orange.darker,
    fontFamily: FONT_FAMILY.regular,
  },

  specialsImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 245,
    height: 163,
    zIndex: 1,
  },

  specialsButton: {
    position: 'absolute',
    left: 10,
    bottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    zIndex: 3,
  },

  specialsButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
  },

  specialsArrow: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
  },

  pressed: {
    opacity: 0.85,
  },

  bottomSpacer: {
    height: SPACING.xxxl,
  },
});
