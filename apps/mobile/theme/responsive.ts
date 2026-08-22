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
  };
}
