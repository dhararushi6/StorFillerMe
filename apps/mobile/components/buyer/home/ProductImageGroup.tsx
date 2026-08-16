import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface ProductImageGroupProps {
  images: readonly number[];
  centerSingleImage?: boolean;
}

export function ProductImageGroup({ images, centerSingleImage = false }: ProductImageGroupProps) {
  return (
    <View style={styles.container}>
      {images.slice(0, 2).map((image, index) => (
        <Image
          key={index}
          source={image}
          resizeMode="contain"
          style={[
            styles.image,
            images.length === 1 && centerSingleImage
              ? styles.centerSingleImage
              : index === 0
                ? styles.firstImage
                : styles.secondImage,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    position: 'absolute',
    width: '72%',
    height: '82%',
  },

  // FIRST IMAGE → BACK
  firstImage: {
    left: '-5%',
    zIndex: 1,
  },

  // SECOND IMAGE → FRONT
  secondImage: {
    right: '-5%',
    zIndex: 2,
  },

  centerSingleImage: {
    width: '72%',
    height: '82%',
    alignSelf: 'center',
  },
});
