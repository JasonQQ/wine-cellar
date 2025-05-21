import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { Wine } from '@/types/Wine';

interface WineCardProps {
  wine: Wine;
  onPress: () => void;
}

export function WineCard({ wine, onPress }: WineCardProps) {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={14}
        color={i < rating ? '#F9A602' : '#D1D1D1'}
        fill={i < rating ? '#F9A602' : 'none'}
      />
    ));
  };

  const getTypeBackgroundColor = (type: string) => {
    switch (type) {
      case 'Red': return '#722F37';
      case 'White': return '#F0E68C';
      case 'Rosé': return '#FFB6C1';
      case 'Sparkling': return '#D4AF37';
      default: return '#999999';
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'Red': return '#FFFFFF';
      case 'White': return '#333333';
      case 'Rosé': return '#333333';
      case 'Sparkling': return '#333333';
      default: return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {wine.imageUri ? (
          <Image source={{ uri: wine.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>{wine.name}</Text>
        <Text style={styles.producer} numberOfLines={1}>{wine.producer}</Text>
        
        <View style={styles.detailsRow}>
          {wine.vintage ? (
            <Text style={styles.vintage}>{wine.vintage}</Text>
          ) : null}
          
          <View style={[
            styles.typeLabel, 
            { backgroundColor: getTypeBackgroundColor(wine.type) }
          ]}>
            <Text style={[
              styles.typeText, 
              { color: getTypeTextColor(wine.type) }
            ]}>
              {wine.type}
            </Text>
          </View>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.starsContainer}>
            {renderStars(wine.rating)}
          </View>
          
          {wine.region ? (
            <Text style={styles.region} numberOfLines={1}>{wine.region}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 80,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  producer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vintage: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  typeLabel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  region: {
    fontSize: 12,
    color: '#888',
    maxWidth: '60%',
    textAlign: 'right',
  },
});