import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getWineCollection, clearWineCollection } from '@/data/wineStorage';
import { Trash2, CloudDownload as DownloadCloud, Share2, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const [wineCount, setWineCount] = useState(0);
  const [stats, setStats] = useState({
    redWines: 0,
    whiteWines: 0,
    sparklingWines: 0,
    roseWines: 0,
    otherWines: 0,
    totalRatings: 0,
    averageRating: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const wines = await getWineCollection();
      setWineCount(wines.length);

      // Calculate statistics
      if (wines.length > 0) {
        const redCount = wines.filter(w => w.type === 'Red').length;
        const whiteCount = wines.filter(w => w.type === 'White').length;
        const sparklingCount = wines.filter(w => w.type === 'Sparkling').length;
        const roseCount = wines.filter(w => w.type === 'Rosé').length;
        const otherCount = wines.filter(w => !['Red', 'White', 'Sparkling', 'Rosé'].includes(w.type)).length;
        
        const totalRatings = wines.reduce((sum, wine) => sum + (wine.rating || 0), 0);
        const avg = wines.length > 0 ? totalRatings / wines.length : 0;
        
        setStats({
          redWines: redCount,
          whiteWines: whiteCount,
          sparklingWines: sparklingCount,
          roseWines: roseCount,
          otherWines: otherCount,
          totalRatings,
          averageRating: Math.round(avg * 10) / 10, // Round to 1 decimal
        });
      }
    } catch (error) {
      console.error('Failed to load wine stats:', error);
    }
  };

  const handleClearCollection = () => {
    Alert.alert(
      'Clear Collection',
      'Are you sure you want to delete your entire wine collection? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearWineCollection();
              setWineCount(0);
              setStats({
                redWines: 0,
                whiteWines: 0,
                sparklingWines: 0,
                roseWines: 0,
                otherWines: 0,
                totalRatings: 0,
                averageRating: 0,
              });
              Alert.alert('Success', 'Your wine collection has been cleared.');
            } catch (error) {
              console.error('Failed to clear collection:', error);
              Alert.alert('Error', 'Failed to clear collection. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Feature Coming Soon',
      'Export functionality will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleShareCollection = () => {
    Alert.alert(
      'Feature Coming Soon',
      'Sharing functionality will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>My Wine Profile</Text>
        <Text style={styles.statsSubtitle}>
          You have {wineCount} wine{wineCount !== 1 ? 's' : ''} in your collection
        </Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Collection Breakdown</Text>
        <View style={styles.statCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.colorIndicator, { backgroundColor: '#722F37' }]} />
              <Text style={styles.statLabel}>Red</Text>
              <Text style={styles.statValue}>{stats.redWines}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.colorIndicator, { backgroundColor: '#F0E68C' }]} />
              <Text style={styles.statLabel}>White</Text>
              <Text style={styles.statValue}>{stats.whiteWines}</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.colorIndicator, { backgroundColor: '#FFB6C1' }]} />
              <Text style={styles.statLabel}>Rosé</Text>
              <Text style={styles.statValue}>{stats.roseWines}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.colorIndicator, { backgroundColor: '#D4AF37' }]} />
              <Text style={styles.statLabel}>Sparkling</Text>
              <Text style={styles.statValue}>{stats.sparklingWines}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingLabel}>Average Rating</Text>
          <Text style={styles.ratingValue}>{stats.averageRating}/5</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Management</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <DownloadCloud size={22} color="#333" />
          <Text style={styles.actionButtonText}>Export Collection Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShareCollection}>
          <Share2 size={22} color="#333" />
          <Text style={styles.actionButtonText}>Share Collection</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Settings size={22} color="#333" />
          <Text style={styles.actionButtonText}>Preferences</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleClearCollection}>
          <Trash2 size={22} color="#D32F2F" />
          <Text style={styles.deleteButtonText}>Clear Collection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  headerSection: {
    padding: 24,
    paddingTop: 30,
    backgroundColor: '#722F37',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statsSubtitle: {
    fontSize: 16,
    color: '#F2E2E4',
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  statLabel: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    width: 40,
    textAlign: 'right',
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#555',
  },
  ratingValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#722F37',
  },
  actionSection: {
    padding: 16,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE8E8',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#D32F2F',
    marginLeft: 12,
  },
});