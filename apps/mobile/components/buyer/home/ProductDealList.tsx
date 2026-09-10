import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ProductDealCard } from './ProductDealCard';
import { useCartStore } from '@/store';
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
  const { items, addItem, incrementItem, decrementItem } = useCartStore();

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
      {products.map((product) => {
        const cartItem = items.find((i) => i.id === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;

        return (
          <ProductDealCard
            key={product.id}
            name={product.name}
            unit={product.unit}
            price={product.price}
            oldPrice={product.oldPrice}
            image={product.image}
            quantity={quantity}
            onPress={() => onProductPress?.(product.id)}
            onAddPress={() => {
              if (onAddPress) {
                onAddPress(product.id);
              }
              addItem(product);
            }}
            onIncrement={() => {
              if (quantity === 0) {
                addItem(product);
              } else {
                incrementItem(product.id);
              }
            }}
            onDecrement={() => decrementItem(product.id)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING.md,
  },
});
