import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_FAMILY,
  ICON_SIZES,
  LINE_HEIGHT,
  SIZES,
  useResponsive,
} from '../../theme';
import {
  SHOP_PHOTO_STRINGS,
  DEFAULT_SHOP_DETAILS,
  IMAGE_PICKER_CONFIG,
  HIT_SLOPS,
  createInitialPhotoSlots,
  applyPhotoToSlots,
  removePhotoFromSlots,
  validateImageAsset,
  useShopPhotoLayout,
  useShopPhotoUpload,
  ShopPhotoScreenProps,
  PhotoSlot,
} from '../../constants/Shop photo.constants';
import { PhotoActionSheet } from './PhotoActionSheet';
import { PhotoAddedModal } from './PhotoAddedModal';

import backIcon from '../../assets/icons/Arrow 10 (1).png';
import editIcon from '../../assets/icons/edit 1.png';
import imageIcon from '../../assets/icons/image 2.png';
import storefrontIcon from '../../assets/icons/storefront (1) 2.png';

export function ShopPhotoScreen({
  shopName = DEFAULT_SHOP_DETAILS.shopName,
  shopAddress = DEFAULT_SHOP_DETAILS.shopAddress,
  onBack,
  onEditShop,
  onUpload,
}: ShopPhotoScreenProps) {
  const { horizontalPadding: themeHorizontalPadding } = useResponsive();
  const { width: screenWidth } = useWindowDimensions();

  const [photos, setPhotos] = useState<PhotoSlot[]>(createInitialPhotoSlots());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleUploadSuccess = useCallback(() => setSuccessVisible(true), []);

  const { isUploading, uploadProgress, uploadError, handleUpload, setUploadError } =
    useShopPhotoUpload(onUpload, handleUploadSuccess);

  const {
    horizontalPadding,
    gridGap,
    itemWidth,
    placeholderIconSize,
    labelFontSize,
    labelLineHeight,
    boxAspectRatio,
  } = useShopPhotoLayout(screenWidth, themeHorizontalPadding);

  const openActionSheet = (index: number) => {
    setActiveIndex(index);
    setActionSheetVisible(true);
  };

  const closeActionSheet = () => {
    setActionSheetVisible(false);
    setActiveIndex(null);
  };

  const applyPhoto = (uri: string) => {
    if (activeIndex === null) return;
    setPhotos((prev) => applyPhotoToSlots(prev, activeIndex, uri));
    closeActionSheet();
    setUploadError(null);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => removePhotoFromSlots(prev, index));
  };

  const handleCameraCapture = (imageUri: string) => {
    applyPhoto(imageUri);
  };

  const handleGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          SHOP_PHOTO_STRINGS.alerts.permissionTitle,
          SHOP_PHOTO_STRINGS.alerts.permissionMsg,
          [{ text: SHOP_PHOTO_STRINGS.okLabel }],
        );
        return;
      }

      closeActionSheet();

      const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_CONFIG);

      if (!result.canceled && result.assets?.[0]) {
        const error = validateImageAsset(result.assets[0]);
        if (error) {
          Alert.alert(SHOP_PHOTO_STRINGS.alerts.invalidPhotoTitle, error);
          return;
        }
        applyPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Gallery error:', error);
      Alert.alert(
        SHOP_PHOTO_STRINGS.alerts.galleryErrorTitle,
        SHOP_PHOTO_STRINGS.alerts.galleryErrorMsg,
      );
    }
  };

  const handleEdit = () => {
    if (onEditShop) {
      onEditShop();
    } else {
      router.push(SHOP_PHOTO_STRINGS.routes.location as any);
    }
  };

  const selectedCount = photos.filter(Boolean).length;
  const canUpload = selectedCount > 0 && !isUploading;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.orange.normal}
        translucent={Platform.OS === 'android'}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={HIT_SLOPS.headerBack}>
          <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{SHOP_PHOTO_STRINGS.headerTitle}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.shopCard}>
          <View style={styles.shopCardLeft}>
            <Image source={storefrontIcon} style={styles.storefrontIcon} resizeMode="contain" />
            <View style={styles.shopTextWrap}>
              <Text style={styles.shopName} numberOfLines={1}>
                {shopName}
              </Text>
              <Text style={styles.shopAddress}>{shopAddress}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            activeOpacity={0.7}
            hitSlop={HIT_SLOPS.editButton}
          >
            <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
            <Text style={styles.editText}>{SHOP_PHOTO_STRINGS.editLabel}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{SHOP_PHOTO_STRINGS.sectionTitle}</Text>

        <View style={[styles.grid, { marginHorizontal: -gridGap / 2 }]}>
          {photos.map((photo, index) => (
            <View
              key={index}
              style={[
                styles.photoBoxWrap,
                {
                  width: itemWidth,
                  marginHorizontal: gridGap / 2,
                  marginBottom: gridGap,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.photoBox, { width: itemWidth, aspectRatio: boxAspectRatio }]}
                onPress={() => openActionSheet(index)}
                activeOpacity={0.7}
              >
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                ) : (
                  <>
                    <Image
                      source={imageIcon}
                      style={{
                        width: placeholderIconSize,
                        height: placeholderIconSize,
                        marginBottom: SPACING.sm,
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.photoBoxLabel,
                        { fontSize: labelFontSize, lineHeight: labelLineHeight },
                      ]}
                    >
                      {SHOP_PHOTO_STRINGS.addPhotoLabel}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {photo && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePhoto(index)}
                  hitSlop={HIT_SLOPS.removeButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.removeButtonText}>{SHOP_PHOTO_STRINGS.removeSymbol}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.bottomSafeArea}>
        <View style={[styles.uploadWrap, { paddingHorizontal: horizontalPadding }]}>
          {uploadError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{uploadError}</Text>
            </View>
          )}

          {isUploading && (
            <View style={styles.progressWrap}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{SHOP_PHOTO_STRINGS.uploadingStatus}</Text>
                <Text style={styles.progressPercent}>{uploadProgress}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.uploadButton, !canUpload && styles.uploadButtonDisabled]}
            onPress={() => handleUpload(photos)}
            disabled={!canUpload}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadButtonText}>
              {isUploading ? SHOP_PHOTO_STRINGS.uploadingLabel : SHOP_PHOTO_STRINGS.uploadLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <PhotoActionSheet
        visible={actionSheetVisible}
        onCamera={handleCameraCapture}
        onGallery={handleGallery}
        onCancel={closeActionSheet}
      />

      <PhotoAddedModal visible={successVisible} onDone={() => setSuccessVisible(false)} />
    </View>
  );
}

export default ShopPhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shopScreenBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange.normal,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + SPACING.lg : 50,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: RADIUS.header,
    borderBottomRightRadius: RADIUS.header,
  },
  backIcon: {
    width: ICON_SIZES.lg,
    height: ICON_SIZES.lg,
    tintColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.md,
    marginLeft: SPACING.md,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.section,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.shopCardBackground,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.orange.card,
    borderRadius: RADIUS.lg,
    minHeight: SIZES.shopCardMinHeight,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  shopCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  storefrontIcon: {
    width: ICON_SIZES.xxxl,
    height: ICON_SIZES.xxxl,
    tintColor: COLORS.orange.normal,
    marginRight: SPACING.sm,
  },
  shopTextWrap: {
    flexShrink: 1,
    paddingRight: SPACING.sm,
  },
  shopName: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.small,
    color: COLORS.black,
  },
  shopAddress: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xxs,
    lineHeight: LINE_HEIGHT.xxs,
    color: COLORS.black,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  editIcon: {
    width: ICON_SIZES.xs,
    height: ICON_SIZES.xs,
    tintColor: COLORS.orange.normal,
    marginRight: SPACING.xs,
  },
  editText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.orange.normal,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.small,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoBoxWrap: {
    position: 'relative',
  },
  photoBox: {
    backgroundColor: COLORS.photoBoxBackground,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoBoxLabel: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.black,
  },
  removeButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: ICON_SIZES.lg,
    height: ICON_SIZES.lg,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
    lineHeight: FONT_SIZE.xs,
  },
  bottomSafeArea: {
    backgroundColor: COLORS.shopScreenBackground,
  },
  uploadWrap: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.shopScreenBackground,
  },
  errorBanner: {
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.danger,
    textAlign: 'center',
  },
  progressWrap: {
    marginBottom: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  progressPercent: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.orange.normal,
    minWidth: 36,
    textAlign: 'right',
  },
  progressTrack: {
    height: SIZES.progressTrackHeight,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.orange.card,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.full,
  },
  uploadButton: {
    height: SIZES.uploadButtonHeight,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: COLORS.orange.disabledButtonBackground,
  },
  uploadButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.small,
    color: COLORS.white,
  },
});
