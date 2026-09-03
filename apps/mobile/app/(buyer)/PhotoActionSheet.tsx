import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
  Alert,
} from 'react-native';
import {
  COLORS,
  SPACING,
  RADIUS,
  SIZES,
  FONT_SIZE,
  FONT_FAMILY,
  FONT_WEIGHT,
  LINE_HEIGHT,
  useResponsive,
} from '../../theme';

import cameraIcon from '../../assets/icons/camera.png';
import galleryIcon from '../../assets/icons/gallery.png';

interface PhotoActionSheetProps {
  visible: boolean;
  onCamera: (imageUri: string) => void;
  onGallery: () => void;
  onCancel: () => void;
}

// Local constants for camera UI (not shared across the app)
const BASE_SCREEN_WIDTH = 375;
const BASE_ICON_SIZE = 56;
const MIN_ICON_SIZE = 48;
const MAX_ICON_SIZE = 80;
const ICON_LABEL_GAP = 4;
const VIDEO_ASPECT_RATIO = 3 / 4;
const CAPTURE_BUTTON_OUTER = 76;
const CAPTURE_BUTTON_INNER = 62;
const CAPTURE_BUTTON_INNER_BORDER = 3;
const PREVIEW_QUALITY = 0.9;

export function PhotoActionSheet({
  visible,
  onCamera,
  onGallery,
  onCancel,
}: PhotoActionSheetProps) {
  const { width } = useWindowDimensions();
  const { horizontalPadding } = useResponsive();

  const [cameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const scale = width / BASE_SCREEN_WIDTH;

  const iconSize = Math.min(MAX_ICON_SIZE, Math.max(MIN_ICON_SIZE, BASE_ICON_SIZE * scale));

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCamera = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Camera', 'Camera capture is currently supported in the web version.');
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        Alert.alert('Camera Not Supported', 'Your browser does not support camera access.');
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
      }, 100);
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Camera Permission', 'Please allow camera access in your browser.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      Alert.alert('Error', 'Unable to capture photo.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUri = canvas.toDataURL('image/jpeg', PREVIEW_QUALITY);

    stopCamera();

    setCapturedImage(imageUri);
  };

  const uploadPhoto = () => {
    if (!capturedImage) {
      return;
    }

    onCamera(capturedImage);

    setCapturedImage(null);
    setCameraVisible(false);
  };

  const retakePhoto = async () => {
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
      }, 100);
    } catch {
      // ✅ No parameter needed – ESLint no longer complains
      Alert.alert('Camera Permission', 'Unable to reopen camera.');
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCapturedImage(null);
    setCameraVisible(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <>
      {/* PHOTO ACTION SHEET */}
      <Modal
        visible={visible && !cameraVisible}
        transparent
        animationType="slide"
        onRequestClose={onCancel}
      >
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable
            style={[
              styles.sheet,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
            onPress={() => {}}
          >
            <View style={styles.optionsRow}>
              {/* CAMERA */}
              <TouchableOpacity style={styles.option} onPress={handleCamera} activeOpacity={0.8}>
                <Image
                  source={cameraIcon}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    marginBottom: ICON_LABEL_GAP,
                  }}
                  resizeMode="contain"
                />

                <Text style={styles.optionLabel}>Camera</Text>
              </TouchableOpacity>

              {/* GALLERY */}
              <TouchableOpacity style={styles.option} onPress={onGallery} activeOpacity={0.8}>
                <Image
                  source={galleryIcon}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    marginBottom: ICON_LABEL_GAP,
                  }}
                  resizeMode="contain"
                />

                <Text style={styles.optionLabel}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* CAMERA MODAL (web only) */}
      {Platform.OS === 'web' && (
        <Modal
          visible={cameraVisible}
          transparent={false}
          animationType="slide"
          onRequestClose={closeCamera}
        >
          <View style={styles.cameraScreen}>
            {!capturedImage ? (
              <>
                <Text style={styles.cameraTitle}>Take Photo</Text>

                <View style={styles.videoContainer}>
                  {React.createElement('video', {
                    ref: videoRef,
                    autoPlay: true,
                    playsInline: true,
                    muted: true,
                    style: styles.video,
                  })}
                </View>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={capturePhoto}
                  activeOpacity={0.8}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeCameraButton}
                  onPress={closeCamera}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCameraText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cameraTitle}>Photo Preview</Text>

                <View style={styles.previewContainer}>
                  <Image
                    source={{ uri: capturedImage }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </View>

                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={uploadPhoto}
                  activeOpacity={0.8}
                >
                  <Text style={styles.uploadText}>Upload Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={retakePhoto}
                  activeOpacity={0.8}
                >
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeCameraButton}
                  onPress={closeCamera}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCameraText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  } as any, // ⚠️ warning only – not blocking
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
