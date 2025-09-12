import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OnBoardScreen() {
  const router = useRouter();
  const [crowdLevel, setCrowdLevel] = useState<string | null>(null);
  const [busStatus, setBusStatus] = useState<string | null>(null);
  const [driverCondition, setDriverCondition] = useState<string | null>(null);

  const handleCrowdSelect = (level: string) => {
    setCrowdLevel(level);
  };

  const handleStatusSelect = (status: string) => {
    setBusStatus(status);
  };

  const handleDriverSelect = (condition: string) => {
    setDriverCondition(condition);
  };

  const handleSubmit = () => {
    if (!crowdLevel || !driverCondition) {
      Alert.alert('Please select Crowd Level and Driver\'s Condition');
      return;
    }
    Alert.alert('Submitted', 'Bus details have been recorded successfully!');
    router.back();
  };

  const handleSOS = () => {
    Alert.alert('SOS', 'Emergency SOS activated! Help is on the way.');
  };

  const handleEndJourney = () => {
    router.push('/endjourney');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OnBoard</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Crowd Level Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crowd Level</Text>
          <Text style={styles.sectionSubtitle}>Help others by sharing how crowded the bus is.</Text>
          
          <View style={styles.iconRow}>
            <TouchableOpacity 
              style={[styles.iconButton, crowdLevel === 'Low' && styles.selectedIconButton]}
              onPress={() => handleCrowdSelect('Low')}
            >
              <Ionicons name="happy-outline" size={24} color="#4CAF50" />
              <Text style={[styles.iconLabel, crowdLevel === 'Low' && styles.selectedLabel]}>Low</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.iconButton, crowdLevel === 'Medium' && styles.selectedIconButton]}
              onPress={() => handleCrowdSelect('Medium')}
            >
              <Ionicons name="happy-outline" size={24} color="#FF9800" />
              <Text style={[styles.iconLabel, crowdLevel === 'Medium' && styles.selectedLabel]}>Medium</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.iconButton, crowdLevel === 'High' && styles.selectedIconButton]}
              onPress={() => handleCrowdSelect('High')}
            >
              <Ionicons name="sad-outline" size={24} color="#F44336" />
              <Text style={[styles.iconLabel, crowdLevel === 'High' && styles.selectedLabel]}>High</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Section (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status (Optional)</Text>
          <Text style={styles.sectionSubtitle}>Is the bus on schedule?</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.statusButton, busStatus === 'On-time' && styles.selectedStatusButton]}
              onPress={() => handleStatusSelect('On-time')}
            >
              <Text style={[styles.statusButtonText, busStatus === 'On-time' && styles.selectedStatusText]}>On-time</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statusButton, busStatus === 'Late' && styles.selectedStatusButton]}
              onPress={() => handleStatusSelect('Late')}
            >
              <Text style={[styles.statusButtonText, busStatus === 'Late' && styles.selectedStatusText]}>Late</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statusButton, busStatus === 'Early' && styles.selectedStatusButton]}
              onPress={() => handleStatusSelect('Early')}
            >
              <Text style={[styles.statusButtonText, busStatus === 'Early' && styles.selectedStatusText]}>Early</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Driver's Condition Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver's Condition</Text>
          <Text style={styles.sectionSubtitle}>How is the driver's condition?</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.driverButton, driverCondition === 'Good' && styles.selectedDriverButton]}
              onPress={() => handleDriverSelect('Good')}
            >
              <Text style={[styles.driverButtonText, driverCondition === 'Good' && styles.selectedDriverText]}>Good</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.driverButton, driverCondition === 'Moderate' && styles.selectedDriverButton]}
              onPress={() => handleDriverSelect('Moderate')}
            >
              <Text style={[styles.driverButtonText, driverCondition === 'Moderate' && styles.selectedDriverText]}>Moderate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.driverButton, driverCondition === 'Bad' && styles.selectedDriverButton]}
              onPress={() => handleDriverSelect('Bad')}
            >
              <Text style={[styles.driverButtonText, driverCondition === 'Bad' && styles.selectedDriverText]}>Bad</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button (Renamed to End Journey) */}
        <TouchableOpacity style={styles.submitButton} onPress={handleEndJourney}>
          <Text style={styles.submitButtonText}>End Journey</Text>
        </TouchableOpacity>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosButtonText}>SOS EMERGENCY SOS</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    flex: 1,
    marginHorizontal: 4,
  },
  selectedIconButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  selectedLabel: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedStatusButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  selectedStatusText: {
    color: '#fff',
  },
  driverButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedDriverButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  driverButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  selectedDriverText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sosButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});