import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DEVICE = {
  width,
  height,
  isSmall: width < 360,
  isMedium: width >= 360 && width < 414,
  isLarge: width >= 414,
  isTablet: width >= 768,
} as const;

export const wp = (percentage: number) => (DEVICE.width * percentage) / 100;

export const hp = (percentage: number) => (DEVICE.height * percentage) / 100;
