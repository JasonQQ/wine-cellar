import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { CreditCard as Edit2, Trash2, ArrowLeft, Star } from 'lucide-react-native';
import { getWineById, deleteWine } from '@/data/wineStorage';
import { Wine } from '@/types/Wine';

export default function WineDetailScreen() {
  const { id } = useLocalSearchParams();
  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWine = async () => {
      try {
        const wineData = await getWineById(id as string);
        setWine(wineData);
      } catch (error) {
        console.error('Failed to load wine details:', error);
        Alert.alert('Error', 'Could not load wine details');
      } finally {
        setLoading(false);
      }
    };

    loadWine();
  }, [id]);

  const handleDeleteWine = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this wine from your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWine(id as string);
              router.replace('/');
            } catch (error) {
              console.error('Failed to delete wine:', error);
              Alert.alert('Error', 'Failed to delete wine. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleEditWine = () => {
    router.push(`/wine/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={24}
        color={i < rating ? '#F9A602' : '#D1D1D1'}
        fill={i < rating ? '#F9A602' : 'none'}
      />
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#722F37" />
      </View>
    );
  }

  if (!wine) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Wine not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerActionButton} 
              onPress={handleEditWine}
            >
              <Edit2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerActionButton} 
              onPress={handleDeleteWine}
            >
              <Trash2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageContainer}>
          {wine.imageUri ? (
            <Image 
              source={{ uri: wine.imageUri }} 
              style={styles.wineImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.wineName}>{wine.name}</Text>
          <Text style={styles.wineProducer}>{wine.producer}</Text>
          
          <View style={styles.vintageTypeContainer}>
            {wine.vintage ? (
              <View style={styles.vintageContainer}>
                <Text style={styles.vintageLabel}>Vintage</Text>
                <Text style={styles.vintageValue}>{wine.vintage}</Text>
              </View>
            ) : null}
            
            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>Type</Text>
              <View style={[
                styles.typeValue, 
                { backgroundColor: getTypeColor(wine.type) }
              ]}>
                <Text style={styles.typeText}>{wine.type}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Your Rating</Text>
            <View style={styles.starsContainer}>
              {renderStars(wine.rating)}
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Region</Text>
              <Text style={styles.infoValue}>{wine.region || 'Not specified'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Country</Text>
              <Text style={styles.infoValue}>{wine.country || 'Not specified'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Grapes</Text>
              <Text style={styles.infoValue}>{wine.grapes || 'Not specified'}</Text>
            </View>
            
            {wine.price ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Price</Text>
                <Text style={styles.infoValue}>${wine.price}</Text>
              </View>
            ) : null}
            
            {wine.purchaseDate ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Purchase Date</Text>
                <Text style={styles.infoValue}>{wine.purchaseDate}</Text>
              </View>
            ) : null}
          </View>
          
          {wine.notes ? (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Tasting Notes</Text>
              <Text style={styles.notesText}>{wine.notes}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Red': return '#722F37';
    case 'White': return '#F0E68C';
    case 'Rosé': return '#FFB6C1';
    case 'Sparkling': return '#D4AF37';
    default: return '#999999';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F5F2',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#722F37',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    height: 200,
    backgroundColor: '#722F37',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  imageContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -100,
    marginBottom: 20,
  },
  wineImage: {
    width: 180,
    height: 300,
    borderRadius: 8,
  },
  noImageContainer: {
    width: 180,
    height: 300,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 16,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
  },
  wineName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  wineProducer: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  vintageTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  vintageContainer: {
    marginRight: 16,
  },
  vintageLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  vintageValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  typeContainer: {
  },
  typeLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  typeValue: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  notesSection: {
    marginBottom: 30,
  },
  notesLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});