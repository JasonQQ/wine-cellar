import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView 
} from 'react-native';
import { X } from 'lucide-react-native';
import { WineType } from '@/types/Wine';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    types: WineType[];
    minYear: string;
    maxYear: string;
    minRating: number;
  };
  onApplyFilters: (filters: {
    types: WineType[];
    minYear: string;
    maxYear: string;
    minRating: number;
  }) => void;
}

export function FilterModal({ 
  visible, 
  onClose, 
  filters,
  onApplyFilters 
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState({...filters});
  
  const wineTypes: WineType[] = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];

  const handleTypeToggle = (type: WineType) => {
    setLocalFilters(prev => {
      const types = [...prev.types];
      
      if (types.includes(type)) {
        return {
          ...prev,
          types: types.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          types: [...types, type]
        };
      }
    });
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      types: [],
      minYear: '',
      maxYear: '',
      minRating: 0,
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Wines</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Wine Type</Text>
              <View style={styles.typeContainer}>
                {wineTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      localFilters.types.includes(type) && styles.typeButtonActive,
                      getTypeStyle(type),
                    ]}
                    onPress={() => handleTypeToggle(type)}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        localFilters.types.includes(type) && styles.typeButtonTextActive,
                        { color: getTypeTextColor(type) }
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Vintage Range</Text>
              <View style={styles.vintageContainer}>
                <View style={styles.vintageInput}>
                  <Text style={styles.vintageLabel}>From</Text>
                  <TextInput
                    style={styles.yearInput}
                    value={localFilters.minYear}
                    onChangeText={(text) => setLocalFilters(prev => ({ ...prev, minYear: text }))}
                    placeholder="YYYY"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                <View style={styles.vintageInput}>
                  <Text style={styles.vintageLabel}>To</Text>
                  <TextInput
                    style={styles.yearInput}
                    value={localFilters.maxYear}
                    onChangeText={(text) => setLocalFilters(prev => ({ ...prev, maxYear: text }))}
                    placeholder="YYYY"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Minimum Rating</Text>
              <View style={styles.ratingButtons}>
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      localFilters.minRating === rating && styles.ratingButtonActive
                    ]}
                    onPress={() => handleRatingChange(rating)}
                  >
                    <Text style={[
                      styles.ratingButtonText,
                      localFilters.minRating === rating && styles.ratingButtonTextActive
                    ]}>
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getTypeStyle = (type: string) => {
  switch (type) {
    case 'Red': return { backgroundColor: '#722F37' };
    case 'White': return { backgroundColor: '#F0E68C' };
    case 'Rosé': return { backgroundColor: '#FFB6C1' };
    case 'Sparkling': return { backgroundColor: '#D4AF37' };
    case 'Dessert': return { backgroundColor: '#A2573E' };
    case 'Fortified': return { backgroundColor: '#7B3F00' };
    default: return { backgroundColor: '#999999' };
  }
};

const getTypeTextColor = (type: string) => {
  switch (type) {
    case 'Red': return '#FFFFFF';
    case 'Fortified': return '#FFFFFF';
    case 'Dessert': return '#FFFFFF';
    default: return '#333333';
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F8F5F2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  filtersContainer: {
    maxHeight: '70%',
  },
  filterSection: {
    marginVertical: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: '#999',
  },
  typeButtonText: {
    fontSize: 14,
  },
  typeButtonTextActive: {
    fontWeight: '600',
  },
  vintageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vintageInput: {
    width: '48%',
  },
  vintageLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  yearInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  ratingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#EEEEEE',
  },
  ratingButtonActive: {
    backgroundColor: '#722F37',
  },
  ratingButtonText: {
    fontSize: 14,
    color: '#333',
  },
  ratingButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#722F37',
    width: '30%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#722F37',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#722F37',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '65%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});