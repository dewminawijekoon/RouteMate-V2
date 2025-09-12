import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function LostItemsList() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Reported Lost Items</ThemedText>
      <ThemedText style={{ marginTop: 12, color: '#666' }}>No reports yet.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
