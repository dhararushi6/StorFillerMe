import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { COLORS } from '@/theme/colors';
import { useResponsive } from '@/theme/responsive';

import {
  LOCATION_STRINGS,
  getAddAddressFormStyles,
  type AddressType,
  type Address,
} from '@/constants/location';
import { CustomTextInput } from '@/components/Customtextinput';
import { useAddresses } from './AddressContext';

// Icons
import ARROW_ICON from '@/assets/icons/Arrow 10.png';
import SHOP_ICON from '@/assets/icons/storefront (2) 1.png';
import WAREHOUSE_ICON from '@/assets/icons/warehouse 1.png';

export default function BuyerAddAddressFormScreen() {
  const { horizontalPadding } = useResponsive();
  const styles = useMemo(() => getAddAddressFormStyles(horizontalPadding), [horizontalPadding]);

  const { addAddress } = useAddresses();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('Shop');

  const [addressFocused, setAddressFocused] = useState(false);
  const [pincodeFocused, setPincodeFocused] = useState(false);

  const isFormComplete = useMemo(
    () => shopName.trim().length > 0 && address.trim().length > 0 && pincode.trim().length > 0,
    [shopName, address, pincode],
  );

  const handleBack = useCallback(() => {
    router.push(LOCATION_STRINGS.routes.addAddress);
  }, []);

  const handleSaveAddress = useCallback(() => {
    if (!isFormComplete) return;
    const newAddress: Address = {
      id: Date.now().toString(),
      title: shopName.trim(),
      address: address.trim(),
      pincode: pincode.trim(),
      isSelected: true,
      type: addressType,
    };
    addAddress(newAddress);
    // navigate() pops back to the existing '/location' screen already on the
    // stack (skipping over '/add-address') instead of push(), which would
    // stack a brand-new duplicate on top of an already-growing stack.
    router.navigate(LOCATION_STRINGS.routes.location);
  }, [isFormComplete, shopName, address, pincode, addressType, addAddress]);

  const renderTypeCard = (type: AddressType, icon: ImageSourcePropType) => {
    const selected = addressType === type;
    const cardStyle = selected
      ? type === 'Shop'
        ? styles.typeCardShopSelected
        : styles.typeCardWarehouseSelected
      : styles.typeCardUnselected;

    return (
      <Pressable style={[styles.typeCard, cardStyle]} onPress={() => setAddressType(type)}>
        <Image source={icon} style={styles.typeIcon} resizeMode="contain" />
        <Text style={styles.typeText}>{type}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
            <Image source={ARROW_ICON} style={styles.arrowIcon} resizeMode="contain" />
          </Pressable>
          <Text style={styles.headerTitle}>{LOCATION_STRINGS.addAddressHeader}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionHeading}>{LOCATION_STRINGS.editAddress}</Text>

          <CustomTextInput
            label={LOCATION_STRINGS.shopNameLabel}
            value={shopName}
            onChangeText={setShopName}
            placeholder={LOCATION_STRINGS.shopNamePlaceholder}
          />

          <View style={styles.rowContainer}>
            <View style={styles.addressColumn}>
              <Text style={styles.label}>{LOCATION_STRINGS.addressLabel}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={address}
                  onChangeText={setAddress}
                  placeholder=""
                  underlineColorAndroid="transparent"
                  cursorColor={COLORS.text.location}
                  selectionColor={COLORS.text.location}
                  onFocus={() => setAddressFocused(true)}
                  onBlur={() => setAddressFocused(false)}
                />
                {address.length === 0 && !addressFocused && (
                  <Text style={styles.customPlaceholder} pointerEvents="none">
                    {LOCATION_STRINGS.addressPlaceholder}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.pincodeColumn}>
              <Text style={styles.label}>{LOCATION_STRINGS.pincodeLabel}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder=""
                  underlineColorAndroid="transparent"
                  cursorColor={COLORS.text.location}
                  selectionColor={COLORS.text.location}
                  keyboardType="number-pad"
                  onFocus={() => setPincodeFocused(true)}
                  onBlur={() => setPincodeFocused(false)}
                />
                {pincode.length === 0 && !pincodeFocused && (
                  <Text style={styles.customPlaceholder} pointerEvents="none">
                    {LOCATION_STRINGS.pincodePlaceholder}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <CustomTextInput
            label={LOCATION_STRINGS.deliveryDetailsLabel}
            value={landmark}
            onChangeText={setLandmark}
            placeholder={LOCATION_STRINGS.deliveryDetailsPlaceholder}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{LOCATION_STRINGS.addressTypeLabel}</Text>
            <View style={styles.typeRow}>
              {renderTypeCard('Shop', SHOP_ICON)}
              {renderTypeCard('Warehouse', WAREHOUSE_ICON)}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Pressable
            onPress={handleSaveAddress}
            disabled={!isFormComplete}
            style={[styles.saveButton, isFormComplete && styles.saveButtonActive]}
          >
            <Text style={[styles.saveButtonText, isFormComplete && styles.saveButtonTextActive]}>
              {LOCATION_STRINGS.saveAddress}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
