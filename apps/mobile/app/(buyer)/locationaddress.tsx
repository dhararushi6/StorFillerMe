import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { HomeSearchBar } from '../../components/buyer/home/HomeSearchBar';

import { LOCATION_STRINGS, getAddAddressStyles } from '@/constants/location';
import { useAddresses } from './AddressContext';

import { useResponsive } from '@/theme/responsive';

// Icons
import MAP_PIN_ICON from '@/assets/icons/map-pin (4) 5.png';
import CROSSHAIR_ICON from '@/assets/icons/crosshair 1.png';
import ARROW_ICON from '@/assets/icons/Arrow 10.png';

export default function BuyerAddAddressMapScreen() {
  const { horizontalPadding } = useResponsive();
  const styles = useMemo(() => getAddAddressStyles(horizontalPadding), [horizontalPadding]);

  const [searchQuery, setSearchQuery] = useState('');
  const { selectedAddress, addresses } = useAddresses();
  const currentAddress = selectedAddress || addresses?.[0];

  const handleBack = useCallback(() => {
    router.push(LOCATION_STRINGS.routes.location);
  }, []);

  const handleAddAddressDetails = useCallback(() => {
    router.push(LOCATION_STRINGS.routes.addAddressForm);
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
            <Image source={ARROW_ICON} style={styles.arrowIcon} resizeMode="contain" />
          </Pressable>
          <AppText style={styles.headerTitle}>{LOCATION_STRINGS.addAddressHeader}</AppText>
        </View>
      </View>

      <View style={styles.mapArea}>
        <View style={styles.searchContainer} pointerEvents="box-none">
          <HomeSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={LOCATION_STRINGS.searchPlaceholder}
            onPress={() => {}}
            onMicPress={() => {}}
          />
        </View>

        <View style={styles.bottomStack} pointerEvents="box-none">
          <Pressable style={styles.currentLocationBadge} pointerEvents="auto">
            <Image source={CROSSHAIR_ICON} style={styles.crosshairIcon} resizeMode="contain" />
            <AppText style={styles.locationText}>{LOCATION_STRINGS.useCurrentLocation}</AppText>
          </Pressable>

          <View style={styles.addressCard} pointerEvents="auto">
            <AppText style={styles.deliveryLabel}>{LOCATION_STRINGS.deliveringYourOrderTo}</AppText>
            <View style={styles.addressDetailsRow}>
              <View style={styles.pinIconBox}>
                <Image source={MAP_PIN_ICON} style={styles.mapPinIcon} resizeMode="contain" />
              </View>
              <View style={styles.addressTextContainer}>
                <AppText style={styles.shopTitle} numberOfLines={1}>
                  {currentAddress?.title || 'Jagadeesh shop'}
                </AppText>
                <AppText style={styles.addressText} numberOfLines={2}>
                  {currentAddress?.address || 'Bangarpet, Kolar District, Karnataka, India'}
                </AppText>
              </View>
            </View>
            <AppButton
              title={LOCATION_STRINGS.addAddressDetails}
              onPress={handleAddAddressDetails}
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
