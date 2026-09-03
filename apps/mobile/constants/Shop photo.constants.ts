import { useState, useRef, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ICON_SIZES, FONT_SIZE, LINE_HEIGHT } from '../theme';

// ==========================================
// TYPES & INTERFACES
// ==========================================

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

export interface ShopPhotoLayoutData {
  scale: number;
  horizontalPadding: number;
  gridGap: number;
  contentWidth: number;
  itemWidth: number;
  placeholderIconSize: number;
  labelFontSize: number;
  labelLineHeight: number;
  boxAspectRatio: number;
}

export interface ActionSheetLayoutData {
  iconSize: number;
  iconLabelGap: number;
}

export interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  handleUpload: (photos: PhotoSlot[]) => void;
  setUploadError: (error: string | null) => void;
}

export interface WebCameraControls {
  cameraVisible: boolean;
  capturedImage: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  handleCamera: () => Promise<void>;
  capturePhoto: () => void;
  uploadPhoto: () => void;
  retakePhoto: () => Promise<void>;
  closeCamera: () => void;
}

// ==========================================
// STRING DICTIONARY & ROUTES
// ==========================================

export const SHOP_PHOTO_STRINGS = {
  headerTitle: 'Shop Photo',
  sectionTitle: 'Shop Images',
  addPhotoLabel: 'Add Shop Photo',
  editLabel: 'Edit',
  cameraLabel: 'Camera',
  galleryLabel: 'Gallery',
  cancelLabel: 'Cancel',
  uploadLabel: 'Upload',
  uploadingLabel: 'Uploading...',
  uploadingStatus: 'Uploading photos',
  successTitle: 'Photo Added!',
  successMessage: 'Your shop photo has been\nadded successfully',
  doneLabel: 'Done',
  takePhotoTitle: 'Take Photo',
  photoPreviewTitle: 'Photo Preview',
  uploadPhotoButton: 'Upload Photo',
  retakeButton: 'Retake',
  removeSymbol: '✕',
  okLabel: 'OK',
  alerts: {
    permissionTitle: 'Permission needed',
    permissionMsg:
      'Gallery access is required to select photos. Please enable it in your device settings.',
    invalidPhotoTitle: 'Invalid photo',
    invalidMimeMsg: 'Please select a valid image file (JPG, PNG, or WEBP).',
    invalidSizeMsg: (maxMb: number) => `Image is too large. Please choose a file under ${maxMb}MB.`,
    galleryErrorTitle: 'Gallery Error',
    galleryErrorMsg: 'Unable to open the gallery. Please try again.',
    uploadFailedMsg: 'Upload failed. Please check your connection and try again.',
    cameraNotSupportedTitle: 'Camera Not Supported',
    cameraNotSupportedMsg: 'Your browser does not support camera access.',
    cameraPermissionTitle: 'Camera Permission',
    cameraPermissionMsg: 'Please allow camera access in your browser.',
    cameraCaptureErrorTitle: 'Error',
    cameraCaptureErrorMsg: 'Unable to capture photo.',
    cameraReopenErrorMsg: 'Unable to reopen camera.',
    nativeCameraUnsupportedTitle: 'Camera',
    nativeCameraUnsupportedMsg: 'Camera capture is currently supported in the web version.',
  },
  routes: {
    shopPhoto: '/(buyer)/shop-photo',
    location: '/(buyer)/location',
    profile: '/(buyer)/profile',
  },
} as const;

// ==========================================
// CONSTANTS & METRICS
// ==========================================

export const PHOTO_SLOTS_COUNT = 4;
export const MAX_FILE_SIZE_MB = 10;

export const DEFAULT_SHOP_DETAILS = {
  shopName: 'Jagadeesh kirana shop',
  shopAddress: 'opposite: petrol bunk, B.C.Road, Gajuwaka, Visakhapatnam.',
} as const;

export const LAYOUT_METRICS = {
  baseScreenWidth: 402,
  figmaHorizontalPadding: 24,
  columns: 2,
  gridGapRatio: (211 - 24 - 167) / 402, // 20 / 402
  boxAspectRatio: 167 / 100, // 1.67
  minScale: 0.85,
  maxScale: 1.35,
} as const;

export const ACTION_SHEET_METRICS = {
  baseScreenWidth: 375,
  baseIconSize: 56,
  minIconSize: 48,
  maxIconSize: 80,
  iconLabelGap: 4,
} as const;

export const CAMERA_METRICS = {
  videoAspectRatio: 3 / 4,
  captureButtonOuter: 76,
  captureButtonInner: 62,
  captureButtonInnerBorder: 3,
  previewQuality: 0.9,
  maxWidth: 600,
  videoPlayDelayMs: 100,
} as const;

export const MODAL_METRICS = {
  messageMaxWidth: 250,
  activeOpacity: 0.85,
} as const;

export const HIT_SLOPS = {
  headerBack: { top: 12, bottom: 12, left: 12, right: 12 },
  editButton: { top: 8, bottom: 8, left: 8, right: 8 },
  removeButton: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;

export const UPLOAD_SIMULATION_CONFIG = {
  progressStep: 10,
  maxProgress: 100,
  intervalMs: 150,
  completionDelayMs: 200,
} as const;

export const IMAGE_PICKER_CONFIG: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

// ==========================================
// UTILITY & VALIDATION FUNCTIONS
// ==========================================

export const createInitialPhotoSlots = (): PhotoSlot[] => Array(PHOTO_SLOTS_COUNT).fill(null);

export const applyPhotoToSlots = (
  slots: PhotoSlot[],
  index: number,
  uri: string,
): PhotoSlot[] => {
  const next = [...slots];
  next[index] = uri;
  return next;
};

export const removePhotoFromSlots = (slots: PhotoSlot[], index: number): PhotoSlot[] => {
  const next = [...slots];
  next[index] = null;
  return next;
};

export const validateImageAsset = (
  asset: ImagePicker.ImagePickerAsset,
  maxMb: number = MAX_FILE_SIZE_MB,
): string | null => {
  const isImage =
    asset.mimeType?.startsWith('image/') ?? /\.(jpg|jpeg|png|webp|heic)$/i.test(asset.uri);

  if (!isImage) {
    return SHOP_PHOTO_STRINGS.alerts.invalidMimeMsg;
  }
  if (asset.fileSize && asset.fileSize > maxMb * 1024 * 1024) {
    return SHOP_PHOTO_STRINGS.alerts.invalidSizeMsg(maxMb);
  }
  return null;
};

// Legacy stub placeholders retained for backward compatibility
export const PLACEHOLDER_PHOTO_URIS = {
  camera: 'https://picsum.photos/seed/camera/400',
  gallery: 'https://picsum.photos/seed/gallery/400',
} as const;
export const PHOTO_SLOTS = PHOTO_SLOTS_COUNT;

// ==========================================
// CUSTOM HOOKS (DERIVED LOGIC & LAYOUT)
// ==========================================

export const useShopPhotoLayout = (
  screenWidth: number,
  themeHorizontalPadding?: number,
): ShopPhotoLayoutData => {
  const rawScale = screenWidth / LAYOUT_METRICS.baseScreenWidth;
  const scale = Math.min(
    LAYOUT_METRICS.maxScale,
    Math.max(LAYOUT_METRICS.minScale, rawScale),
  );

  const horizontalPadding =
    themeHorizontalPadding ?? LAYOUT_METRICS.figmaHorizontalPadding * scale;
  const gridGap = screenWidth * LAYOUT_METRICS.gridGapRatio;
  const contentWidth = screenWidth - horizontalPadding * 2;
  const itemWidth =
    (contentWidth - gridGap * (LAYOUT_METRICS.columns - 1)) / LAYOUT_METRICS.columns;

  const placeholderIconSize = ICON_SIZES.xxxl * scale;
  const labelFontSize = FONT_SIZE.sm * scale;
  const labelLineHeight = LINE_HEIGHT.sm * scale;

  return {
    scale,
    horizontalPadding,
    gridGap,
    contentWidth,
    itemWidth,
    placeholderIconSize,
    labelFontSize,
    labelLineHeight,
    boxAspectRatio: LAYOUT_METRICS.boxAspectRatio,
  };
};

export const useActionSheetLayout = (screenWidth: number): ActionSheetLayoutData => {
  const scale = screenWidth / ACTION_SHEET_METRICS.baseScreenWidth;
  const iconSize = Math.min(
    ACTION_SHEET_METRICS.maxIconSize,
    Math.max(ACTION_SHEET_METRICS.minIconSize, ACTION_SHEET_METRICS.baseIconSize * scale),
  );

  return {
    iconSize,
    iconLabelGap: ACTION_SHEET_METRICS.iconLabelGap,
  };
};

export const useShopPhotoUpload = (
  onUpload?: (photos: string[]) => void | Promise<void>,
  onSuccess?: () => void,
): UploadState => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = useCallback(
    (photos: PhotoSlot[]) => {
      const validPhotos = photos.filter(Boolean) as string[];
      if (validPhotos.length === 0 || isUploading) return;

      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + UPLOAD_SIMULATION_CONFIG.progressStep;
          if (next >= UPLOAD_SIMULATION_CONFIG.maxProgress) {
            clearInterval(interval);
            setTimeout(async () => {
              try {
                await onUpload?.(validPhotos);
                setIsUploading(false);
                setUploadProgress(0);
                onSuccess?.();
              } catch {
                setIsUploading(false);
                setUploadProgress(0);
                setUploadError(SHOP_PHOTO_STRINGS.alerts.uploadFailedMsg);
              }
            }, UPLOAD_SIMULATION_CONFIG.completionDelayMs);
            return UPLOAD_SIMULATION_CONFIG.maxProgress;
          }
          return next;
        });
      }, UPLOAD_SIMULATION_CONFIG.intervalMs);
    },
    [isUploading, onUpload, onSuccess],
  );

  return {
    isUploading,
    uploadProgress,
    uploadError,
    handleUpload,
    setUploadError,
  };
};

export const useWebCamera = (onCamera: (imageUri: string) => void): WebCameraControls => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleCamera = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Alert.alert(
        SHOP_PHOTO_STRINGS.alerts.nativeCameraUnsupportedTitle,
        SHOP_PHOTO_STRINGS.alerts.nativeCameraUnsupportedMsg,
      );
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        Alert.alert(
          SHOP_PHOTO_STRINGS.alerts.cameraNotSupportedTitle,
          SHOP_PHOTO_STRINGS.alerts.cameraNotSupportedMsg,
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;
      setCapturedImage(null);
      setCameraVisible(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, CAMERA_METRICS.videoPlayDelayMs);
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert(
        SHOP_PHOTO_STRINGS.alerts.cameraPermissionTitle,
        SHOP_PHOTO_STRINGS.alerts.cameraPermissionMsg,
      );
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      Alert.alert(
        SHOP_PHOTO_STRINGS.alerts.cameraCaptureErrorTitle,
        SHOP_PHOTO_STRINGS.alerts.cameraCaptureErrorMsg,
      );
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUri = canvas.toDataURL('image/jpeg', CAMERA_METRICS.previewQuality);

    stopCamera();
    setCapturedImage(imageUri);
  }, [stopCamera]);

  const uploadPhoto = useCallback(() => {
    if (!capturedImage) return;
    onCamera(capturedImage);
    setCapturedImage(null);
    setCameraVisible(false);
  }, [capturedImage, onCamera]);

  const retakePhoto = useCallback(async () => {
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, CAMERA_METRICS.videoPlayDelayMs);
    } catch {
      Alert.alert(
        SHOP_PHOTO_STRINGS.alerts.cameraPermissionTitle,
        SHOP_PHOTO_STRINGS.alerts.cameraReopenErrorMsg,
      );
    }
  }, []);

  const closeCamera = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setCameraVisible(false);
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    cameraVisible,
    capturedImage,
    videoRef,
    handleCamera,
    capturePhoto,
    uploadPhoto,
    retakePhoto,
    closeCamera,
  };
};
