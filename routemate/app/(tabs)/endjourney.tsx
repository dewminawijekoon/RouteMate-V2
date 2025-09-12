import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EndJourneyScreen() {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [startLocation, setStartLocation] = useState('Papiliyana');
  const [endLocation, setEndLocation] = useState('Information Communication Technology Agency of Sri Lanka');

  useEffect(() => {
    const loadRouteDetails = async () => {
      try {
        const savedStart = await AsyncStorage.getItem('startLocation');
        const savedEnd = await AsyncStorage.getItem('endLocation');
        if (savedStart) setStartLocation(savedStart);
        if (savedEnd) setEndLocation(savedEnd);
      } catch (error) {
        console.log('Error loading route details:', error);
      }
    };
    loadRouteDetails();
  }, []);

  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const handleSubmitRating = async () => {
    if (rating === null) {
      Alert.alert('Please select a rating');
      return;
    }
    
    try {
      // Clear the journey data
      await AsyncStorage.removeItem('routeSteps');
      await AsyncStorage.removeItem('routeCoordinates');
      
      Alert.alert('Rating Submitted', 'Thank you for your feedback!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to routes tab
            router.push('/routes');
          },
        },
      ]);
    } catch (error) {
      console.log('Error clearing route data:', error);
      router.push('/routes');
    }
  };

  const currentTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Colombo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>End Journey</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <View style={styles.content}>
        {/* Journey Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Journey Details</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Start:</Text>
            <Text style={styles.detailValue}>{startLocation}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>End:</Text>
            <Text style={styles.detailValue}>{endLocation}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{currentTime}</Text>
          </View>
        </View>

        {/* Rating Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Rate Your Journey</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity key={value} onPress={() => handleStarPress(value)} style={styles.starButton}>
                <Ionicons
                  name={value <= (rating || 0) ? 'star' : 'star-outline'}
                  size={28}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Submit Rating Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRating}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#8E8E93',
    width: 60,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  starButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});