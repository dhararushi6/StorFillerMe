import React, { useState } from 'react';
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
import { PhotoActionSheet } from './PhotoActionSheet';
import { PhotoAddedModal } from './PhotoAddedModal';

// Replaced require() with import
import backIcon from '../../assets/icons/Arrow 10 (1).png';
import editIcon from '../../assets/icons/edit 1.png';
import imageIcon from '../../assets/icons/image 2.png';
import storefrontIcon from '../../assets/icons/storefront (1) 2.png';

interface ShopPhotoScreenProps {
  shopName?: string;
  shopAddress?: string;
  onBack?: () => void;
  onEditShop?: () => void;
  onUpload?: (photos: string[]) => void | Promise<void>;
}

const PHOTO_SLOTS = 4;
const MAX_FILE_SIZE_MB = 10;
const BASE_SCREEN_WIDTH = 402;
// FIGMA_FRAME_RADIUS removed – not used
const FIGMA_HORIZONTAL_PADDING = 24;
const GRID_GAP_RATIO = (211 - 24 - 167) / BASE_SCREEN_WIDTH;
const FIGMA_BOX_ASPECT_RATIO = 167 / 100;
const COLUMNS = 2;
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.35;

export function ShopPhotoScreen({
  shopName = 'Jagadeesh kirana shop',
  shopAddress = 'opposite: petrol bunk, B.C.Road, Gajuwaka, Visakhapatnam.',
  onBack,
  onEditShop,
  onUpload,
}: ShopPhotoScreenProps) {
  const { horizontalPadding: themeHorizontalPadding } = useResponsive();
  const { width: screenWidth } = useWindowDimensions();

  const [photos, setPhotos] = useState<(string | null)[]>(Array(PHOTO_SLOTS).fill(null));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    setPhotos((prev) => {
      const next = [...prev];
      next[activeIndex] = uri;
      return next;
    });
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

  const validateAsset = (asset: ImagePicker.ImagePickerAsset): string | null => {
    const isImage =
      asset.mimeType?.startsWith('image/') ?? /\.(jpg|jpeg|png|webp|heic)$/i.test(asset.uri);

    if (!isImage) return 'Please select a valid image file (JPG, PNG, or WEBP).';
    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Image is too large. Please choose a file under ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleCameraCapture = (imageUri: string) => {
    applyPhoto(imageUri);
  };

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
    if (onEditShop) {
      onEditShop();
    } else {
      router.push('/(buyer)/location');
    }
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

  const placeholderIconSize = ICON_SIZES.xxxl * scale;
  const labelFontSize = FONT_SIZE.sm * scale;
  const labelLineHeight = LINE_HEIGHT.sm * scale;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.orange.normal}
        translucent={Platform.OS === 'android'}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
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
                {shopName}
              </Text>
              <Text style={styles.shopAddress}>{shopAddress}</Text>
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
                {
                  width: itemWidth,
                  marginHorizontal: gridGap / 2,
                  marginBottom: gridGap,
                },
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
