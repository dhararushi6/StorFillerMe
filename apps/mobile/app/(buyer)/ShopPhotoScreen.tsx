import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import { useResponsive, COLORS, SPACING, ICON_SIZES, FONT_SIZE, LINE_HEIGHT } from '../../theme';
import { PhotoActionSheet } from './shopphotoaction';
import { PhotoAddedModal } from './shopphotoadded';
import backIcon from '../../assets/icons/Arrow 10 (1).png';
import editIcon from '../../assets/icons/edit 1.png';
import imageIcon from '../../assets/icons/image 2.png';
import storefrontIcon from '../../assets/icons/storefront (1) 2.png';
import {
  ShopPhotoScreenProps,
  BASE_SCREEN_WIDTH,
  FIGMA_HORIZONTAL_PADDING,
  GRID_GAP_RATIO,
  FIGMA_BOX_ASPECT_RATIO,
  COLUMNS,
  MIN_SCALE,
  MAX_SCALE,
  DEFAULT_SHOP_DETAILS,
  createInitialPhotoSlots,
  applyPhotoToSlots,
  validateAsset,
  loadShopPhotos,
  saveShopPhotos,
  loadShopDetails,
  shopPhotoScreenStyles as styles,
} from '../../constants/ShopPhoto';

export function ShopPhotoScreen({
  shopName: shopNameProp,
  shopAddress: shopAddressProp,
  onBack,
  onEditShop,
  onUpload,
}: ShopPhotoScreenProps) {
  const { horizontalPadding: themeHorizontalPadding } = useResponsive();
  const { width: screenWidth } = useWindowDimensions();

  const [photos, setPhotos] = useState(createInitialPhotoSlots());
  const [photosHydrated, setPhotosHydrated] = useState(false);
  const [shopDetails, setShopDetails] = useState({
    shopName: shopNameProp ?? DEFAULT_SHOP_DETAILS.shopName,
    shopAddress: shopAddressProp ?? DEFAULT_SHOP_DETAILS.shopAddress,
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Hydrate photos from persisted storage once on mount so they survive
  // navigation and refresh instead of always starting from 4 empty slots.
  React.useEffect(() => {
    (async () => {
      const stored = await loadShopPhotos();
      if (stored) setPhotos(stored);
      setPhotosHydrated(true);
    })();
  }, []);

  // Persist photos any time they change (select, remove, or after upload).
  React.useEffect(() => {
    if (!photosHydrated) return; // avoid overwriting storage with the initial empty state
    saveShopPhotos(photos);
  }, [photos, photosHydrated]);

  // Re-read shop details every time this screen gains focus (e.g. returning
  // from the address/location edit screen) so it can never show a stale or
  // mismatched address. Explicit props still win if the caller passes them.
  useFocusEffect(
    useCallback(() => {
      if (shopNameProp !== undefined && shopAddressProp !== undefined) return;
      (async () => {
        const stored = await loadShopDetails();
        if (stored) {
          setShopDetails({
            shopName: shopNameProp ?? stored.shopName,
            shopAddress: shopAddressProp ?? stored.shopAddress,
          });
        }
      })();
    }, [shopNameProp, shopAddressProp]),
  );

  // Back handler – navigate to profile if no custom onBack is provided
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.replace('/(buyer)/profile');
    }
  };

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

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleCameraCapture = (imageUri: string) => applyPhoto(imageUri);

  const handleGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Gallery access is required to select photos. Please enable it in your device settings.',
          [{ text: 'OK' }],
        );
        return;
      }
      closeActionSheet();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) {
        const error = validateAsset(result.assets[0]);
        if (error) {
          Alert.alert('Invalid photo', error);
          return;
        }
        applyPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Gallery error:', error);
      Alert.alert('Gallery Error', 'Unable to open the gallery. Please try again.');
    }
  };

  const handleEdit = () => {
    if (onEditShop) onEditShop();
    else router.push('/(buyer)/location');
  };

  const selectedCount = photos.filter(Boolean).length;
  const canUpload = selectedCount > 0 && !isUploading;

  const handleUpload = () => {
    if (!canUpload) return;
    const validPhotos = photos.filter(Boolean) as string[];
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(async () => {
            try {
              await onUpload?.(validPhotos);
              await saveShopPhotos(photos);
              setIsUploading(false);
              setUploadProgress(0);
              setSuccessVisible(true);
            } catch {
              setIsUploading(false);
              setUploadProgress(0);
              setUploadError('Upload failed. Please check your connection and try again.');
            }
          }, 200);
          return 100;
        }
        return next;
      });
    }, 150);
  };

  const rawScale = screenWidth / BASE_SCREEN_WIDTH;
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, rawScale));
  const horizontalPadding = themeHorizontalPadding ?? FIGMA_HORIZONTAL_PADDING * scale;
  const gridGap = screenWidth * GRID_GAP_RATIO;
  const contentWidth = screenWidth - horizontalPadding * 2;
  const itemWidth = (contentWidth - gridGap * (COLUMNS - 1)) / COLUMNS;
  const placeholderIconSize = ICON_SIZES.xl * scale;
  const labelFontSize = FONT_SIZE.xs * scale;
  const labelLineHeight = LINE_HEIGHT.xxs * scale;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.orange.normal}
        translucent={Platform.OS === 'android'}
      />
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + SPACING.lg : 50,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Photo</Text>
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
                {shopDetails.shopName}
              </Text>
              <Text style={styles.shopAddress}>{shopDetails.shopAddress}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Shop Images</Text>

        <View style={[styles.grid, { marginHorizontal: -gridGap / 2 }]}>
          {photos.map((photo, index) => (
            <View
              key={index}
              style={[
                styles.photoBoxWrap,
                { width: itemWidth, marginHorizontal: gridGap / 2, marginBottom: gridGap },
              ]}
            >
              <TouchableOpacity
                style={[styles.photoBox, { width: itemWidth, aspectRatio: FIGMA_BOX_ASPECT_RATIO }]}
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
                        marginBottom: SPACING.xs,
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.photoBoxLabel,
                        { fontSize: labelFontSize, lineHeight: labelLineHeight },
                      ]}
                    >
                      Add Shop Photo
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              {photo && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
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
                <Text style={styles.progressLabel}>Uploading photos</Text>
                <Text style={styles.progressPercent}>{uploadProgress}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}
          <TouchableOpacity
            style={[styles.uploadButton, !canUpload && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={!canUpload}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadButtonText}>{isUploading ? 'Uploading...' : 'Upload'}</Text>
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
