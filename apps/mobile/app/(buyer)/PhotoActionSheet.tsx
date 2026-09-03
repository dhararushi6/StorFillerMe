import React from 'react';
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
import {
  SHOP_PHOTO_STRINGS,
  CAMERA_METRICS,
  useActionSheetLayout,
  useWebCamera,
  PhotoActionSheetProps,
} from '../../constants/Shop photo.constants';

import cameraIcon from '../../assets/icons/camera.png';
import galleryIcon from '../../assets/icons/gallery.png';

export function PhotoActionSheet({
  visible,
  onCamera,
  onGallery,
  onCancel,
}: PhotoActionSheetProps) {
  const { width } = useWindowDimensions();
  const { horizontalPadding } = useResponsive();

  const { iconSize, iconLabelGap } = useActionSheetLayout(width);

  const {
    cameraVisible,
    capturedImage,
    videoRef,
    handleCamera,
    capturePhoto,
    uploadPhoto,
    retakePhoto,
    closeCamera,
  } = useWebCamera(onCamera);

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
                    marginBottom: iconLabelGap,
                  }}
                  resizeMode="contain"
                />
                <Text style={styles.optionLabel}>{SHOP_PHOTO_STRINGS.cameraLabel}</Text>
              </TouchableOpacity>

              {/* GALLERY */}
              <TouchableOpacity style={styles.option} onPress={onGallery} activeOpacity={0.8}>
                <Image
                  source={galleryIcon}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    marginBottom: iconLabelGap,
                  }}
                  resizeMode="contain"
                />
                <Text style={styles.optionLabel}>{SHOP_PHOTO_STRINGS.galleryLabel}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelText}>{SHOP_PHOTO_STRINGS.cancelLabel}</Text>
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
                <Text style={styles.cameraTitle}>{SHOP_PHOTO_STRINGS.takePhotoTitle}</Text>

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
                  <Text style={styles.closeCameraText}>{SHOP_PHOTO_STRINGS.cancelLabel}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cameraTitle}>{SHOP_PHOTO_STRINGS.photoPreviewTitle}</Text>

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
                  <Text style={styles.uploadText}>{SHOP_PHOTO_STRINGS.uploadPhotoButton}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={retakePhoto}
                  activeOpacity={0.8}
                >
                  <Text style={styles.retakeText}>{SHOP_PHOTO_STRINGS.retakeButton}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeCameraButton}
                  onPress={closeCamera}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCameraText}>{SHOP_PHOTO_STRINGS.cancelLabel}</Text>
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
    maxWidth: CAMERA_METRICS.maxWidth,
    aspectRatio: CAMERA_METRICS.videoAspectRatio,
    overflow: 'hidden',
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.black,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as any,
  captureButton: {
    width: CAMERA_METRICS.captureButtonOuter,
    height: CAMERA_METRICS.captureButtonOuter,
    borderRadius: CAMERA_METRICS.captureButtonOuter / 2,
    backgroundColor: COLORS.white,
    marginTop: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: CAMERA_METRICS.captureButtonInner,
    height: CAMERA_METRICS.captureButtonInner,
    borderRadius: CAMERA_METRICS.captureButtonInner / 2,
    borderWidth: CAMERA_METRICS.captureButtonInnerBorder,
    borderColor: COLORS.black,
  },
  previewContainer: {
    width: '100%',
    maxWidth: CAMERA_METRICS.maxWidth,
    aspectRatio: CAMERA_METRICS.videoAspectRatio,
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
    maxWidth: CAMERA_METRICS.maxWidth,
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
    maxWidth: CAMERA_METRICS.maxWidth,
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
