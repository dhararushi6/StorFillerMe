import React, { useCallback, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING, useResponsive } from '@/theme';

interface ProductGalleryProps {
  images: readonly number[];
  expiryLabel?: string;
}

export function ProductGallery({ images, expiryLabel }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { width, horizontalPadding, product } = useResponsive();

  const pageWidth = width - horizontalPadding * 2;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;

      const nextIndex = Math.max(0, Math.min(images.length - 1, Math.round(offsetX / pageWidth)));

      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
    },
    [images.length, pageWidth],
  );

  return (
    <View>
      <View
        style={[
          styles.gallery,
          {
            width: pageWidth,
            height: product.galleryHeight,
          },
        ]}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((image, index) => (
            <View
              key={`${index}-gallery-page`}
              style={[
                styles.page,
                {
                  width: pageWidth,
                  height: product.galleryHeight,
                },
              ]}
            >
              <Image
                source={image}
                style={[
                  styles.image,
                  {
                    width: `${product.galleryImageWidth}%`,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        {expiryLabel !== undefined && (
          <View style={styles.expiryBadge}>
            <AppText variant="caption" color="inverse">
              {expiryLabel}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={`${index}-gallery-dot`}
            style={[
              styles.dot,
              {
                width: product.paginationDotSize,
                height: product.paginationDotSize,
              },
              index === activeIndex && [
                styles.activeDot,
                {
                  width: product.paginationActiveDotWidth,
                },
              ],
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gallery: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderRadius: RADIUS.lg,
  },

  page: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },

  image: {
    flex: 1,
  },

  expiryBadge: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    backgroundColor: COLORS.overlay,
    borderRadius: RADIUS.xs,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },

  dot: {
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.pill,
  },

  activeDot: {
    backgroundColor: COLORS.text.primary,
  },
});
