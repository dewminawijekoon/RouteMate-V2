// app/notifications.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const notifications = [
  { id: '1', title: 'Lost Wallet', description: 'A brown leather wallet was found near the cafeteria.' },
  { id: '2', title: 'Lost Keys', description: 'A set of car keys found in the library study area.' },
  { id: '3', title: 'Lost Umbrella', description: 'Blue umbrella left in the lecture hall.' },
  { id: '4', title: 'Lost Phone', description: 'Black iPhone found near the bus stop.' },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {notifications.map((notice) => (
          <View key={notice.id} style={styles.card}>
            <Text style={styles.title}>{notice.title}</Text>
            <Text style={styles.description}>{notice.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});
