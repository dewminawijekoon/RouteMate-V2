import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TravelModeSelectorProps {
  selectedMode: 'DRIVING' | 'TRANSIT' | 'WALKING';
  onModeChange: (mode: 'DRIVING' | 'TRANSIT' | 'WALKING') => void;
}

const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({
  selectedMode,
  onModeChange,
}) => {
  const modes = [
    { key: 'DRIVING' as const, icon: 'car-outline', label: 'Drive' },
    { key: 'TRANSIT' as const, icon: 'bus-outline', label: 'Transit' },
    { key: 'WALKING' as const, icon: 'walk-outline', label: 'Walk' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Travel Mode</Text>
      <View style={styles.modeContainer}>
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.key}
            style={[
              styles.modeButton,
              selectedMode === mode.key && styles.selectedMode,
            ]}
            onPress={() => onModeChange(mode.key)}
          >
            <Ionicons
              name={mode.icon}
              size={20}
              color={selectedMode === mode.key ? '#fff' : '#666'}
            />
            <Text
              style={[
                styles.modeText,
                selectedMode === mode.key && styles.selectedModeText,
              ]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  selectedMode: {
    backgroundColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  modeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  selectedModeText: {
    color: '#fff',
  },
});

export default TravelModeSelector;