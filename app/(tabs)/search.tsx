import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { Search as SearchIcon, Filter, X } from 'lucide-react-native';
import { getWineCollection } from '@/data/wineStorage';
import { WineCard } from '@/components/WineCard';
import { FilterModal } from '@/components/FilterModal';
import { Wine, WineType } from '@/types/Wine';

export default function SearchScreen() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [filteredWines, setFilteredWines] = useState<Wine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    types: WineType[];
    minYear: string;
    maxYear: string;
    minRating: number;
  }>({
    types: [],
    minYear: '',
    maxYear: '',
    minRating: 0,
  });

  useEffect(() => {
    const loadWines = async () => {
      try {
        const storedWines = await getWineCollection();
        setWines(storedWines);
        setFilteredWines(storedWines);
      } catch (error) {
        console.error('Failed to load wine collection:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWines();
  }, []);

  useEffect(() => {
    filterWines();
  }, [searchQuery, activeFilters, wines]);

  const filterWines = () => {
    let results = [...wines];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(wine => 
        wine.name.toLowerCase().includes(query) || 
        wine.producer.toLowerCase().includes(query) || 
        wine.region.toLowerCase().includes(query) ||
        wine.country.toLowerCase().includes(query) ||
        wine.grapes?.toLowerCase().includes(query)
      );
    }

    // Apply type filters
    if (activeFilters.types.length > 0) {
      results = results.filter(wine => activeFilters.types.includes(wine.type));
    }

    // Apply year filters
    if (activeFilters.minYear) {
      results = results.filter(wine => {
        const vintage = parseInt(wine.vintage);
        return !isNaN(vintage) && vintage >= parseInt(activeFilters.minYear);
      });
    }

    if (activeFilters.maxYear) {
      results = results.filter(wine => {
        const vintage = parseInt(wine.vintage);
        return !isNaN(vintage) && vintage <= parseInt(activeFilters.maxYear);
      });
    }

    // Apply rating filter
    if (activeFilters.minRating > 0) {
      results = results.filter(wine => wine.rating >= activeFilters.minRating);
    }

    setFilteredWines(results);
  };

  const handleWinePress = (id: string) => {
    router.push(`/wine/${id}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setActiveFilters({
      types: [],
      minYear: '',
      maxYear: '',
      minRating: 0,
    });
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.types.length > 0 ||
      activeFilters.minYear !== '' ||
      activeFilters.maxYear !== '' ||
      activeFilters.minRating > 0
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#722F37" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, producer, region..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            hasActiveFilters() && styles.filterButtonActive
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Filter 
            size={22} 
            color={hasActiveFilters() ? "#722F37" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      {hasActiveFilters() && (
        <View style={styles.activeFiltersBar}>
          <Text style={styles.activeFiltersText}>
            Filters applied: {activeFilters.types.join(', ')}
            {activeFilters.minYear ? ` from ${activeFilters.minYear}` : ''}
            {activeFilters.maxYear ? ` to ${activeFilters.maxYear}` : ''}
            {activeFilters.minRating > 0 ? ` rated ${activeFilters.minRating}+` : ''}
          </Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredWines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No wines found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWines}
          renderItem={({ item }) => (
            <WineCard 
              wine={item} 
              onPress={() => handleWinePress(item.id)} 
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.wineList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={activeFilters}
        onApplyFilters={setActiveFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F5F2',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#F2E2E4',
  },
  activeFiltersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEE5E6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  activeFiltersText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  clearFiltersText: {
    fontSize: 13,
    color: '#722F37',
    fontWeight: '600',
  },
  wineList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
});