import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  small: 360,
  medium: 414,
  tablet: 768,
} as const;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < BREAKPOINTS.small;
  const isMedium = width >= BREAKPOINTS.small && width < BREAKPOINTS.medium;
  const isLarge = width >= BREAKPOINTS.medium;
  const isTablet = width >= BREAKPOINTS.tablet;

  const wp = (percentage: number) => (width * percentage) / 100;
  const hp = (percentage: number) => (height * percentage) / 100;

  const horizontalPadding = isTablet ? 32 : Math.min(Math.max(width * 0.04, 16), 24);

  const home = {
    headerBottomSpacing: isSmall ? 4 : 6,

    walletHeight: isSmall ? 30 : 32,
    walletHorizontalPadding: isSmall ? 8 : 10,
    walletIconSize: isSmall ? 14 : 15,

    cartIconSize: isSmall ? 21 : 22,

    locationFontSize: isSmall ? 15 : 17,

    categoryCardWidth: isSmall ? 92 : 104,
    categoryCardHeight: isSmall ? 116 : 124,
    categoryImageSize: isSmall ? 52 : 56,
    categoryIllustrationSize: isSmall ? 120 : 140,
  };

  const product = {
    cartIconSize: isSmall ? 21 : 22,

    galleryHeight: isSmall ? 252 : 288,
    galleryImageWidth: isSmall ? 62 : 66,
    paginationDotSize: isSmall ? 5 : 6,
    paginationActiveDotWidth: isSmall ? 16 : 18,

    titleFontSize: isSmall ? 20 : 22,
    priceFontSize: isSmall ? 18 : 20,
    oldPriceFontSize: isSmall ? 12 : 13,
    starSize: isSmall ? 12 : 13,
    summaryActionSize: isSmall ? 20 : 22,

    quantityChipHeight: isSmall ? 38 : 42,
    quantityChipMinWidth: isSmall ? 54 : 60,

    detailRowHeight: isSmall ? 42 : 46,

    similarCardWidth: isSmall ? 128 : 142,
    similarImageHeight: isSmall ? 88 : 98,
    similarAddButtonSize: isSmall ? 24 : 26,

    ratingValueFontSize: isSmall ? 26 : 30,
    ratingFilterSize: isSmall ? 20 : 22,
    reviewPhotoSize: isSmall ? 68 : 76,
    reviewActionSize: isSmall ? 16 : 18,
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
    horizontalPadding,
    home,
    product,
  };
}
