import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface ProductImageGroupProps {
  images: readonly number[];
}

export function ProductImageGroup({ images }: ProductImageGroupProps) {
  return (
    <View style={styles.container}>
      {images.slice(0, 2).map((image, index) => (
        <Image
          key={index}
          source={image}
          resizeMode="contain"
          style={[styles.image, index === 0 ? styles.firstImage : styles.secondImage]}
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

  firstImage: {
    left: '-5%',
    zIndex: 1,
  },

  secondImage: {
    right: '-5%',
    zIndex: 2,
  },
});
