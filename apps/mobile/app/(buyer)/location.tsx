import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { LOCATION_STRINGS, getLocationStyles } from '@/constants/location';
import { useAddresses, type Address } from './AddressContext';

import { useResponsive } from '@/theme/responsive';

// Icons
import ArrowIcon from '../../assets/icons/Arrow 10.png';
import CaretRightIcon from '../../assets/icons/caret-right (1) 13.png';
import MapPinIcon from '../../assets/icons/map-pin (4) 5.png';
import CloseIcon from '../../assets/icons/x 1 (1).png';
import PlusSquareIcon from '../../assets/icons/plus-square (1) 1.png';
import TrashIcon from '../../assets/icons/trash 2.png';

export default function BuyerLocationScreen() {
  const { horizontalPadding } = useResponsive();
  const styles = getLocationStyles(horizontalPadding);

  const { addresses, removeAddress, selectAddress } = useAddresses();

  const handleBack = useCallback(() => {
    router.push(LOCATION_STRINGS.routes.home);
  }, []);

  const handleAddNewAddress = useCallback(() => {
    router.push(LOCATION_STRINGS.routes.addAddress);
  }, []);

  const handleDeleteAddress = useCallback(
    (id: string) => {
      removeAddress(id);
    },
    [removeAddress],
  );

  const handleSelectAddress = useCallback(
    (id: string) => {
      selectAddress(id);
      router.push(LOCATION_STRINGS.routes.home);
    },
    [selectAddress],
  );

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backdrop} onPress={handleBack} />
      <View style={styles.sheetContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={handleBack} hitSlop={12} style={styles.headerIconButton}>
              <Image source={ArrowIcon} style={styles.backIcon} />
            </Pressable>
            <AppText style={styles.headerTitleText}>{LOCATION_STRINGS.headerTitle}</AppText>
          </View>
          <Pressable onPress={handleBack} hitSlop={12} style={styles.headerIconButton}>
            <Image source={CloseIcon} style={styles.closeIcon} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <Pressable style={styles.addAddressRow} onPress={handleAddNewAddress}>
            <View style={styles.addAddressLeft}>
              <View style={styles.addIconBox}>
                <Image source={PlusSquareIcon} style={styles.plusIcon} />
              </View>
              <AppText style={styles.addAddressText}>{LOCATION_STRINGS.addNewAddress}</AppText>
            </View>
            <Image source={CaretRightIcon} style={styles.caretRightIcon} />
          </Pressable>

          <AppText style={styles.sectionHeading}>{LOCATION_STRINGS.savedAddresses}</AppText>

          <View style={styles.addressList}>
            {addresses.length === 0 ? (
              <AppText style={styles.emptyText}>No saved addresses. Add one now!</AppText>
            ) : (
              addresses.map((item: Address) => (
                <View
                  key={item.id}
                  style={[styles.addressCard, item.isSelected && styles.selectedAddressCard]}
                >
                  <Pressable style={styles.cardLeft} onPress={() => handleSelectAddress(item.id)}>
                    <View style={styles.pinIconBox}>
                      <Image source={MapPinIcon} style={styles.mapPinIcon} />
                    </View>
                    <View style={styles.addressTextContainer}>
                      <AppText style={styles.shopTitle}>{item.title}</AppText>
                      <AppText style={styles.addressBody}>{item.address}</AppText>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteAddress(item.id)}
                    hitSlop={12}
                    style={styles.deleteButton}
                  >
                    <Image source={TrashIcon} style={styles.trashIcon} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
