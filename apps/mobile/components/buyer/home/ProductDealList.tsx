import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ProductDealCard } from './ProductDealCard';
import { SPACING } from '@/theme';

export interface ProductDealItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  image: number;
}

interface ProductDealListProps {
  products: readonly ProductDealItem[];
  horizontalPadding?: number;
  onProductPress?: (productId: string) => void;
  onAddPress?: (productId: string) => void;
}

export function ProductDealList({
  products,
  horizontalPadding = 0,
  onProductPress,
  onAddPress,
}: ProductDealListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: horizontalPadding,
        },
      ]}
    >
      {products.map((product) => (
        <ProductDealCard
          key={product.id}
          name={product.name}
          unit={product.unit}
          price={product.price}
          oldPrice={product.oldPrice}
          image={product.image}
          onPress={() => onProductPress?.(product.id)}
          onAddPress={() => onAddPress?.(product.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING.md,
  },
});
