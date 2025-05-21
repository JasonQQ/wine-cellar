import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { X, RotateCcw, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFlipCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!camera) return;

    try {
      const photo = await camera.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });
      
      // Store the image in AsyncStorage
      if (photo.base64) {
        const imageUri = `data:image/jpeg;base64,${photo.base64}`;
        await AsyncStorage.setItem('lastCapturedImage', imageUri);
        setCapturedImage(imageUri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = async () => {
    if (capturedImage) {
      router.back();
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Camera Not Available</Text>
        </View>
        <View style={styles.webMessageContainer}>
          <Text style={styles.webMessage}>
            Camera functionality is not fully supported in the web version.
          </Text>
          <TouchableOpacity style={styles.webButton} onPress={handleClose}>
            <Text style={styles.webButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.previewImage} 
          />
          <View style={styles.previewActions}>
            <TouchableOpacity 
              style={styles.previewActionButton} 
              onPress={handleRetake}
            >
              <RotateCcw size={24} color="#FFF" />
              <Text style={styles.previewActionText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.previewActionButton, styles.usePhotoButton]} 
              onPress={handleUsePhoto}
            >
              <CheckCircle size={24} color="#FFF" />
              <Text style={styles.previewActionText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={(ref) => setCamera(ref)}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.flipButton} 
                  onPress={handleFlipCamera}
                >
                  <RotateCcw size={22} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.captureButton} 
                  onPress={handleCapture}
                />
                
                <View style={{ width: 50 }} />
              </View>
            </View>
          </CameraView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F5F2',
  },
  loadingText: {
    fontSize: 18,
    color: '#722F37',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F5F2',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#722F37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  previewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  usePhotoButton: {
    backgroundColor: '#722F37',
  },
  previewActionText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  webMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  webButton: {
    backgroundColor: '#722F37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  webButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});