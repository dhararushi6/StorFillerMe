export const RADIUS = {
  none: 0, // ✅ added
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  huge: 32,
  header: 40,
  pill: 999, // used for fully rounded buttons/pills
  full: 999, // ✅ alias for pill – or you can use `pill` directly
} as const;
