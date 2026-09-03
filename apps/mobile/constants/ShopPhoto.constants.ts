import { StyleSheet } from 'react-native';
import {
  COLORS,
  SPACING,
  RADIUS,
  SIZES,
  FONT_SIZE,
  FONT_FAMILY,
  FONT_WEIGHT,
  LINE_HEIGHT,
  ICON_SIZES,
} from '../theme'; // adjust relative path if needed – assumes theme is at root
import * as ImagePicker from 'expo-image-picker';

// ============ Types ============
export type PhotoSlot = string | null;

export interface ShopPhotoScreenProps {
  shopName?: string;
  shopAddress?: string;
  onBack?: () => void;
  onEditShop?: () => void;
  onUpload?: (photos: string[]) => void | Promise<void>;
}

export interface PhotoActionSheetProps {
  visible: boolean;
  onCamera: (imageUri: string) => void;
  onGallery: () => void;
  onCancel: () => void;
}

export interface PhotoAddedModalProps {
  visible: boolean;
  onDone: () => void;
  title?: string;
  message?: string;
}

// ============ Constants ============
export const SHOP_PHOTO_STRINGS = {
  headerTitle: 'Shop Photo',
  sectionTitle: 'Shop Images',
  addPhotoLabel: 'Add Shop Photo',
  editLabel: 'Edit',
  cameraLabel: 'Camera',
  galleryLabel: 'Gallery',
  cancelLabel: 'Cancel',
  uploadLabel: 'Upload',
  successTitle: 'Photo Added!',
  successMessage: 'Your shop photo has been added successfully',
  doneLabel: 'Done',
  routes: {
    shopPhoto: '/(buyer)/shop-photo',
  },
} as const;

export const PHOTO_SLOTS = 4;
export const MAX_FILE_SIZE_MB = 10;
export const BASE_SCREEN_WIDTH = 402;
export const FIGMA_HORIZONTAL_PADDING = 24;
export const GRID_GAP_RATIO = (211 - 24 - 167) / BASE_SCREEN_WIDTH;
export const FIGMA_BOX_ASPECT_RATIO = 167 / 100;
export const COLUMNS = 2;
export const MIN_SCALE = 0.85;
export const MAX_SCALE = 1.35;

// PhotoActionSheet constants
export const ACTION_SHEET_BASE_SCREEN_WIDTH = 375;
export const BASE_ICON_SIZE = 56;
export const MIN_ICON_SIZE = 48;
export const MAX_ICON_SIZE = 80;
export const ICON_LABEL_GAP = 4;
export const VIDEO_ASPECT_RATIO = 3 / 4;
export const CAPTURE_BUTTON_OUTER = 76;
export const CAPTURE_BUTTON_INNER = 62;
export const CAPTURE_BUTTON_INNER_BORDER = 3;
export const PREVIEW_QUALITY = 0.9;

export const DEFAULT_SHOP_DETAILS = {
  shopName: 'Jagadeesh kirana shop',
  shopAddress: 'opposite: petrol bunk, B.C.Road, Gajuwaka, Visakhapatnam.',
} as const;

// ============ Utility Functions ============
export const createInitialPhotoSlots = (): PhotoSlot[] => Array(PHOTO_SLOTS).fill(null);

export const applyPhotoToSlots = (slots: PhotoSlot[], index: number, uri: string): PhotoSlot[] => {
  const next = [...slots];
  next[index] = uri;
  return next;
};

export const validateAsset = (asset: ImagePicker.ImagePickerAsset): string | null => {
  const isImage =
    asset.mimeType?.startsWith('image/') ?? /\.(jpg|jpeg|png|webp|heic)$/i.test(asset.uri);
  if (!isImage) return 'Please select a valid image file (JPG, PNG, or WEBP).';
  if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Image is too large. Please choose a file under ${MAX_FILE_SIZE_MB}MB.`;
  }
  return null;
};

// ============ Static Styles ============
// PhotoActionSheet styles
export const actionSheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: SPACING.xl,
  },
  option: {
    alignItems: 'center',
    marginRight: SPACING.xxl,
  },
  optionLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.primary,
  },
  cancelButton: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.md,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.orange.normal,
    backgroundColor: COLORS.orange.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.orange.dark,
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  cameraTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.extraLarge,
    fontWeight: FONT_WEIGHT.semiBold,
    marginBottom: SPACING.xl,
  },
  videoContainer: {
    width: '100%',
    maxWidth: 600,
    aspectRatio: VIDEO_ASPECT_RATIO,
    overflow: 'hidden',
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.black,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  captureButton: {
    width: CAPTURE_BUTTON_OUTER,
    height: CAPTURE_BUTTON_OUTER,
    borderRadius: CAPTURE_BUTTON_OUTER / 2,
    backgroundColor: COLORS.white,
    marginTop: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: CAPTURE_BUTTON_INNER,
    height: CAPTURE_BUTTON_INNER,
    borderRadius: CAPTURE_BUTTON_INNER / 2,
    borderWidth: CAPTURE_BUTTON_INNER_BORDER,
    borderColor: COLORS.black,
  },
  previewContainer: {
    width: '100%',
    maxWidth: 600,
    aspectRatio: VIDEO_ASPECT_RATIO,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    width: '100%',
    maxWidth: 600,
    height: SIZES.buttonHeight,
    marginTop: SPACING.xxl,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: COLORS.black,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  retakeButton: {
    width: '100%',
    maxWidth: 600,
    height: SIZES.smallButtonHeight,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  closeCameraButton: {
    marginTop: SPACING.md,
    height: SIZES.smallButtonHeight,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeCameraText: {
    color: COLORS.black,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
  },
});

// PhotoAddedModal styles
export const photoAddedModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlayLight,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: SIZES.shadowOffsetSmall,
      height: SIZES.shadowOffsetSmall,
    },
    shadowOpacity: SIZES.shadowOpacityMedium,
    shadowRadius: SIZES.shadowRadiusMedium,
    elevation: SIZES.elevationLarge,
  },
  checkIcon: {
    width: ICON_SIZES.huge,
    height: ICON_SIZES.huge,
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.extraLarge,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.black,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  message: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.medium,
    color: COLORS.black,
    textAlign: 'center',
    maxWidth: 250,
    marginBottom: SPACING.xl,
  },
  doneButton: {
    width: '100%',
    height: SIZES.uploadButtonHeight,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.small,
    color: COLORS.white,
  },
});

// ShopPhotoScreen styles
export const shopPhotoScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shopScreenBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange.normal,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
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
