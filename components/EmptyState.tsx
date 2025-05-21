import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wine } from 'lucide-react-native';

interface EmptyStateProps {
  message: string;
  subMessage: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({
  message,
  subMessage,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Wine size={64} color="#722F37" />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subMessage}>{subMessage}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={onAction}>
        <Text style={styles.actionButtonText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    backgroundColor: '#F2E2E4',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#722F37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});