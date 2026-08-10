import { View, Text, StyleSheet } from 'react-native';

export default function BuyerHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StoreFiller</Text>
      <Text style={styles.subtitle}>Buyer Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
  },
});
