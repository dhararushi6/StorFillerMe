import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  small: 360,
  medium: 414,
  tablet: 768,
} as const;

// Base design dimensions (iPhone 12/13/14)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < BREAKPOINTS.small;
  const isMedium = width >= BREAKPOINTS.small && width < BREAKPOINTS.medium;
  const isLarge = width >= BREAKPOINTS.medium;
  const isTablet = width >= BREAKPOINTS.tablet;

  // Percentage-based scaling (as before)
  const wp = (percentage: number) => (width * percentage) / 100;
  const hp = (percentage: number) => (height * percentage) / 100;

  // Typical scale/verticalScale/moderateScale (based on base design)
  const scale = (size: number) => (width / BASE_WIDTH) * size;
  const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;
  const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

  const horizontalPadding = isTablet ? 32 : Math.min(Math.max(width * 0.04, 16), 24);

  // Space between the 3 category cards
  const categoryGap = isSmall ? 10 : 12;

  // Calculate 3 equal cards inside the available content width
  const categoryCardWidth = Math.floor((width - horizontalPadding * 2 - categoryGap * 2) / 3);

  const home = {
    headerBottomSpacing: isSmall ? 4 : 6,

    walletHeight: isSmall ? 30 : 32,
    walletHorizontalPadding: isSmall ? 8 : 10,
    walletIconSize: isSmall ? 14 : 15,

    cartIconSize: isSmall ? 21 : 22,

    locationFontSize: isSmall ? 15 : 17,

    categoryCardWidth,
    categoryCardHeight: isSmall ? 116 : 124,
    categoryImageSize: isSmall ? 70 : 90,
    categoryIllustrationSize: isSmall ? 120 : 140,
  };

  const product = {
    cartIconSize: isSmall ? 21 : 22,

    galleryHeight: isSmall ? 260 : 295,
    galleryImageWidth: isSmall ? 62 : 66,
    paginationDotSize: isSmall ? 5 : 6,
    paginationActiveDotWidth: isSmall ? 16 : 18,

    titleFontSize: isSmall ? 20 : 22,
    priceFontSize: isSmall ? 18 : 20,
    oldPriceFontSize: isSmall ? 12 : 13,
    starSize: isSmall ? 12 : 13,

    quantityChipHeight: isSmall ? 38 : 42,
    quantityChipMinWidth: isSmall ? 54 : 60,

    detailRowHeight: isSmall ? 42 : 46,

    ratingValueFontSize: isSmall ? 26 : 30,
    ratingFilterSize: isSmall ? 20 : 22,
    reviewPhotoSize: isSmall ? 88 : 100,
    reviewPhotoWidth: isSmall ? 96 : 111,
    reviewPhotoHeight: isSmall ? 114 : 132,
    reviewActionSize: isSmall ? 18 : 20,
  };

  const wallet = {
    cardMinHeight: isSmall ? 116 : 132,
    balanceFontSize: isSmall ? 30 : 34,
    chipHeight: isSmall ? 30 : 34,
  };

  const cart = {
    headerPaddingTop: isSmall ? 8 : 12,
    headerBottomRadius: isSmall ? 24 : 28,
    itemImageSize: isSmall ? 68 : 76,
    qtyButtonWidth: isSmall ? 68 : 76,
    qtyButtonHeight: isSmall ? 28 : 32,
  };

  // ★ Shop Photo screen — 2-column image grid (added)
  const shopPhotoGridGap = isSmall ? 10 : 12;
  const shopPhoto = {
    gridGap: shopPhotoGridGap,
    gridCardWidth: Math.floor((width - horizontalPadding * 2 - shopPhotoGridGap) / 2),
    gridCardHeight: isSmall ? 108 : 122,
    placeholderIconSize: isSmall ? 28 : 32,
  };

  return {
    width,
    height,
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    wp,
    hp,
    scale,
    verticalScale,
    moderateScale,
    horizontalPadding,
    home,
    wallet,
    product,
    cart,
    shopPhoto,
  };
}
