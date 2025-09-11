import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteInfo as RouteInfoType } from '../hooks/useGoogleMaps';

interface RouteInfoProps {
  routeInfo: RouteInfoType | null;
  onClearRoute: () => void;
  travelMode: 'DRIVING' | 'TRANSIT' | 'WALKING';
}

const RouteInfo: React.FC<RouteInfoProps> = ({ routeInfo, onClearRoute, travelMode }) => {
  if (!routeInfo) return null;

  const getTravelModeIcon = () => {
    switch (travelMode) {
      case 'DRIVING':
        return 'car-outline';
      case 'TRANSIT':
        return 'bus-outline';
      case 'WALKING':
        return 'walk-outline';
      default:
        return 'car-outline';
    }
  };

  const getTravelModeText = () => {
    switch (travelMode) {
      case 'DRIVING':
        return 'Driving';
      case 'TRANSIT':
        return 'Public Transit';
      case 'WALKING':
        return 'Walking';
      default:
        return 'Driving';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Information</Text>
        <TouchableOpacity onPress={onClearRoute} style={styles.clearButton}>
          <Ionicons name="close-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.modeContainer}>
        <Ionicons name={getTravelModeIcon()} size={20} color="#4A90E2" />
        <Text style={styles.modeText}>{getTravelModeText()}</Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={18} color="#666" />
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{routeInfo.duration}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="speedometer-outline" size={18} color="#666" />
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>{routeInfo.distance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A90E2',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default RouteInfo;