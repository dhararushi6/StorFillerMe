import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
};

export default function AuthHeader({ step, totalSteps = 4, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack}>
        <Text style={styles.icon}>←</Text>
      </Pressable>

      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View key={index} style={[styles.line, index < step && styles.activeLine]} />
        ))}
      </View>

      <Text style={styles.icon}>×</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  line: {
    width: 28,
    height: 3,
    borderRadius: 5,
    backgroundColor: '#EFE8D9',
  },

  activeLine: {
    backgroundColor: '#D15C29',
  },

  icon: {
    fontSize: 24,
  },
});
