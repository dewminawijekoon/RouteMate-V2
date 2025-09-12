import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';
import { useRouter } from 'expo-router';

const TravelerHomeScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ThemedText type="title" style={styles.welcomeText}>
              Welcome back, Ravi
            </ThemedText>
            <HelloWave />
          </View>
          <ThemedText type="subtitle" style={styles.subtitleText}>
            Let's start your next journey.
          </ThemedText>
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <IconSymbol name={"chevron.left.forwardslash.chevron.right" as any} size={22} color="#666" />
        </TouchableOpacity>
      </View>

  {/* Traveler Rank Card */}
  <ThemedView style={styles.rankCard} lightColor="#B8860B">
        <View style={styles.rankHeader}>
          <View>
            <ThemedText style={styles.rankLabel}>Traveler Rank</ThemedText>
            <ThemedText type="title" style={styles.rankTitle}>Bronze</ThemedText>
          </View>
          <View style={styles.pointsContainer}>
            <IconSymbol name={"bell.fill" as any} size={18} color="#FFD700" />
            <ThemedText style={styles.pointsText}>1,250 pts</ThemedText>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <ThemedText style={styles.progressText}>You're 750 points away from Silver rank!</ThemedText>
      </ThemedView>
      
            {/* Lost Items */}
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Lost Items</ThemedText>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.card, { marginRight: 12 }]}
                onPress={() => router.push('/lost-items')}
                accessibilityRole="button"
              >
                <FontAwesome5 name="archive" size={24} color="#1e40af" />
                <ThemedText style={styles.cardText}>View reported lost items</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/lost-items/report')}
                accessibilityRole="button"
              >
                <FontAwesome5 name="plus-square" size={24} color="#dc2626" />
                <ThemedText style={styles.cardText}>Report a lost item</ThemedText>
              </TouchableOpacity>
            </View>

      {/* Nearest Bus Stop */}
      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Nearest Bus Stop</ThemedText>

        <ThemedView style={styles.busStopCard}>
    <ThemedView style={styles.busIcon} lightColor="#4A90E2">
            <IconSymbol name={"map.fill" as any} size={24} color="white" />
          </ThemedView>
          <View style={styles.busStopInfo}>
            <ThemedText style={styles.busStopName}>Colombo Fort</ThemedText>
            <ThemedText style={styles.busStopUpdate}>Updated just now</ThemedText>
          </View>
          <View style={styles.distanceContainer}>
            <ThemedText style={styles.distance}>500m</ThemedText>
            <TouchableOpacity style={styles.refreshButton}>
              <IconSymbol name={"chevron.right" as any} size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>

      {/* Recent Journeys */}
      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Recent Journeys</ThemedText>

        <View style={styles.journeysContainer}>
          <ThemedView style={styles.journeyCard}>
            <ThemedText style={styles.journeyTitle}>Kandy - Colombo</ThemedText>
            <ThemedText style={styles.journeyRoute}>ND-5874 (Route 01)</ThemedText>
          </ThemedView>

          <ThemedView style={styles.journeyCard}>
            <ThemedText style={styles.journeyTitle}>Galle - Matara</ThemedText>
            <ThemedText style={styles.journeyRoute}>NC-1234 (Route 02)</ThemedText>
          </ThemedView>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Notifications</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See all</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedView style={styles.notificationCard}>
    <ThemedView style={styles.notificationIcon} lightColor="#FFB000">
            <IconSymbol name={"bell.fill" as any} size={20} color="white" />
          </ThemedView>
          <View style={styles.notificationContent}>
            <ThemedText style={styles.notificationTitle}>Route 87 Update</ThemedText>
            <ThemedText style={styles.notificationMessage}>A new schedule has been published.</ThemedText>
          </View>
          <ThemedText style={styles.notificationTime}>2h</ThemedText>
        </ThemedView>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  rankCard: {
    backgroundColor: '#B8860B',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rankLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  rankTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    width: '62%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  lostItemsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  lostItemsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  busStopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  busIcon: {
    backgroundColor: '#4A90E2',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  busStopInfo: {
    flex: 1,
  },
  busStopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  busStopUpdate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distance: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A90E2',
  },
  refreshButton: {
    padding: 4,
  },
  journeysContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  journeyCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  journeyRoute: {
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  notificationIcon: {
    backgroundColor: '#FFB000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 14,
    color: '#999',
  },
});

export default TravelerHomeScreen;