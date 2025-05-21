import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getWineCollection } from '@/data/wineStorage';
import { WineCard } from '@/components/WineCard';
import { EmptyState } from '@/components/EmptyState';
import { Wine } from '@/types/Wine';
import { useCallback } from 'react';

export default function CollectionScreen() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadWines = async () => {
        try {
          const storedWines = await getWineCollection();
          setWines(storedWines);
        } catch (error) {
          console.error('Failed to load wine collection:', error);
        } finally {
          setLoading(false);
        }
      };

      loadWines();
    }, [])
  );

  const handleWinePress = (id: string) => {
    router.push(`/wine/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading your collection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {wines.length === 0 ? (
        <EmptyState
          message="Your wine collection is empty"
          subMessage="Start adding wines to build your collection"
          actionLabel="Add Your First Wine"
          onAction={() => router.push('/add')}
        />
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wines.length}</Text>
              <Text style={styles.statLabel}>Total Wines</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {wines.filter(wine => wine.type === 'Red').length}
              </Text>
              <Text style={styles.statLabel}>Red Wines</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {wines.filter(wine => wine.type === 'White').length}
              </Text>
              <Text style={styles.statLabel}>White Wines</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your Collection</Text>
          <ScrollView 
            contentContainerStyle={styles.wineList}
            showsVerticalScrollIndicator={false}
          >
            {wines.map(wine => (
              <WineCard 
                key={wine.id} 
                wine={wine} 
                onPress={() => handleWinePress(wine.id)} 
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F5F2',
  },
  loadingText: {
    fontSize: 18,
    color: '#722F37',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#722F37',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  wineList: {
    paddingBottom: 20,
  },
});