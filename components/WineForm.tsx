import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform 
} from 'react-native';
import { Star } from 'lucide-react-native';
import { Wine, WineType } from '@/types/Wine';

interface WineFormProps {
  wine: Partial<Wine>;
  onChange: (field: keyof Wine, value: any) => void;
}

export function WineForm({ wine, onChange }: WineFormProps) {
  const wineTypes: WineType[] = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];

  const handleRatingPress = (rating: number) => {
    onChange('rating', rating);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={wine.name}
          onChangeText={(text) => onChange('name', text)}
          placeholder="Wine name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Producer <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={wine.producer}
          onChangeText={(text) => onChange('producer', text)}
          placeholder="Producer/winery"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Vintage</Text>
          <TextInput
            style={styles.input}
            value={wine.vintage}
            onChangeText={(text) => onChange('vintage', text)}
            placeholder="YYYY"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Type <Text style={styles.required}>*</Text></Text>
          <View style={styles.typeContainer}>
            {wineTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  wine.type === type && styles.typeButtonActive,
                  getTypeStyle(type),
                ]}
                onPress={() => onChange('type', type)}
              >
                <Text 
                  style={[
                    styles.typeButtonText,
                    wine.type === type && styles.typeButtonTextActive,
                    { color: getTypeTextColor(type) }
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Region</Text>
          <TextInput
            style={styles.input}
            value={wine.region}
            onChangeText={(text) => onChange('region', text)}
            placeholder="Wine region"
            placeholderTextColor="#999"
          />
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={wine.country}
            onChangeText={(text) => onChange('country', text)}
            placeholder="Country"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Grapes</Text>
        <TextInput
          style={styles.input}
          value={wine.grapes}
          onChangeText={(text) => onChange('grapes', text)}
          placeholder="Grape varieties"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={wine.price}
            onChangeText={(text) => onChange('price', text)}
            placeholder="$"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Purchase Date</Text>
          <TextInput
            style={styles.input}
            value={wine.purchaseDate}
            onChangeText={(text) => onChange('purchaseDate', text)}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              onPress={() => handleRatingPress(rating)}
            >
              <Star
                size={32}
                color={rating <= (wine.rating || 0) ? '#F9A602' : '#D1D1D1'}
                fill={rating <= (wine.rating || 0) ? '#F9A602' : 'none'}
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={wine.notes}
          onChangeText={(text) => onChange('notes', text)}
          placeholder="Tasting notes, aromas, food pairings..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={Platform.OS === 'ios' ? undefined : 4}
          textAlignVertical="top"
        />
      </View>
    </View>
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
  formContainer: {
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  required: {
    color: '#D32F2F',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 12,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 8,
  },
});