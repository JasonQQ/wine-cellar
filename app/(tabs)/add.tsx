import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { WineForm } from '@/components/WineForm';
import { addWine } from '@/data/wineStorage';
import { Wine, WineType } from '@/types/Wine';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddWineScreen() {
  const [wine, setWine] = useState<Partial<Wine>>({
    name: '',
    producer: '',
    vintage: '',
    type: 'Red' as WineType,
    region: '',
    country: '',
    grapes: '',
    rating: 0,
    price: '',
    purchaseDate: '',
    notes: '',
    imageUri: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkForImage = async () => {
      try {
        const lastImage = await AsyncStorage.getItem('lastCapturedImage');
        if (lastImage) {
          setWine(prev => ({ ...prev, imageUri: lastImage }));
          // Clear the stored image
          await AsyncStorage.removeItem('lastCapturedImage');
        }
      } catch (error) {
        console.error('Error checking for captured image:', error);
      }
    };

    checkForImage();
  }, []);

  const handleChange = (field: keyof Wine, value: any) => {
    setWine(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleTakePhoto = () => {
    router.push('/camera');
  };

  const handleSaveWine = async () => {
    if (!wine.name || !wine.producer || !wine.type) {
      setError('Please fill in all required fields (Name, Producer, Type)');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await addWine({
        ...wine,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      } as Wine);
      
      router.replace('/');
    } catch (error) {
      console.error('Failed to save wine:', error);
      setError('Failed to save wine. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoSection}>
          {wine.imageUri ? (
            <View style={styles.photoPreview}>
              <Image 
                source={{ uri: wine.imageUri }} 
                style={styles.previewImage}
              />
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={handleTakePhoto}
              >
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={handleTakePhoto}
            >
              <Camera size={40} color="#722F37" />
              <Text style={styles.photoText}>Take Bottle Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <WineForm 
          wine={wine} 
          onChange={handleChange}
        />

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveWine}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Saving...' : 'Save Wine'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  photoSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  photoButton: {
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 180,
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
  },
  photoText: {
    color: '#333',
    marginTop: 8,
    fontSize: 16,
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#722F37',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});