import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

const COLORS = {
  background: '#F7F3E8',
  primary: '#D15C29',
  text: '#111111',
  secondaryText: '#666666',
  white: '#FFFFFF',
  border: '#E7D8CB',
};

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  onSubmitEditing?: () => void;
  inputRef?: React.RefObject<TextInput | null>;
};

function FormField({
  label,
  value,
  onChangeText,
  placeholder = '',
  multiline = false,
  onSubmitEditing,
  inputRef,
}: FieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        multiline={multiline}
        returnKeyType={multiline ? 'done' : 'next'}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={multiline}
        style={[styles.input, multiline && styles.addressInput]}
      />
    </View>
  );
}

export default function ShopDetailsScreen() {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');

  const ownerRef = useRef<TextInput>(null);
  const businessRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  const isValid = shopName.trim() && ownerName.trim() && businessName.trim() && address.trim();

  const handleContinue = () => {
    if (!isValid) {
      return;
    }

    router.push('/(auth)/success');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>

            <View style={styles.progressContainer}>
              <View style={styles.activeProgress} />
              <View style={styles.activeProgress} />
              <View style={styles.activeProgress} />
              <View style={styles.inactiveProgress} />
            </View>

            <Pressable onPress={() => router.replace('/(auth)')} style={styles.headerButton}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Tell us about{'\n'}your shop</Text>

            <Text style={styles.subtitle}>The helps us personalize your experience</Text>

            <View style={styles.form}>
              <FormField
                label="Shop Name"
                value={shopName}
                onChangeText={setShopName}
                onSubmitEditing={() => ownerRef.current?.focus()}
              />

              <FormField
                label="Owner Name"
                value={ownerName}
                onChangeText={setOwnerName}
                inputRef={ownerRef}
                onSubmitEditing={() => businessRef.current?.focus()}
              />

              <FormField
                label="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                inputRef={businessRef}
                onSubmitEditing={() => addressRef.current?.focus()}
              />

              <FormField
                label="Address of shop"
                value={address}
                onChangeText={setAddress}
                inputRef={addressRef}
                multiline
              />
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.button, !isValid && styles.buttonDisabled]}
          disabled={!isValid}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },

  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 34,
    color: COLORS.text,
  },

  closeIcon: {
    fontSize: 29,
    color: COLORS.text,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: 7,
  },

  activeProgress: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },

  inactiveProgress: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EDE8DD',
  },

  content: {
    paddingTop: 25,
  },

  title: {
    color: COLORS.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '500',
  },

  subtitle: {
    marginTop: 7,
    color: COLORS.secondaryText,
    fontSize: 12,
  },

  form: {
    marginTop: 24,
    gap: 13,
  },

  fieldContainer: {
    gap: 6,
  },

  label: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '500',
  },

  input: {
    height: 40,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    color: COLORS.text,
    fontSize: 13,
  },

  addressInput: {
    height: 70,
    textAlignVertical: 'top',
    paddingTop: 10,
  },

  button: {
    height: 48,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
