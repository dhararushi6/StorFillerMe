import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  useWindowDimensions,
  Platform,
  Alert,
} from 'react-native';
import { useResponsive } from '../../theme';
import cameraIcon from '../../assets/icons/camera.png';
import galleryIcon from '../../assets/icons/gallery.png';
import {
  PhotoActionSheetProps,
  ACTION_SHEET_BASE_SCREEN_WIDTH,
  BASE_ICON_SIZE,
  MIN_ICON_SIZE,
  MAX_ICON_SIZE,
  ICON_LABEL_GAP,
  PREVIEW_QUALITY,
  actionSheetStyles as styles,
} from '../../constants/ShopPhoto';

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

  const scale = width / ACTION_SHEET_BASE_SCREEN_WIDTH;
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
    if (!videoRef.current) return;

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
    if (!capturedImage) return;
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
      Alert.alert('Camera Permission', 'Unable to reopen camera.');
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCapturedImage(null);
    setCameraVisible(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <>
      <Modal
        visible={visible && !cameraVisible}
        transparent
        animationType="slide"
        onRequestClose={onCancel}
      >
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable
            style={[styles.sheet, { paddingHorizontal: horizontalPadding }]}
            onPress={() => {}}
          >
            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.option} onPress={handleCamera} activeOpacity={0.8}>
                <Image
                  source={cameraIcon}
                  style={{ width: iconSize, height: iconSize, marginBottom: ICON_LABEL_GAP }}
                  resizeMode="contain"
                />
                <Text style={styles.optionLabel}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={onGallery} activeOpacity={0.8}>
                <Image
                  source={galleryIcon}
                  style={{ width: iconSize, height: iconSize, marginBottom: ICON_LABEL_GAP }}
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
