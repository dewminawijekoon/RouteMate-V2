import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  placeholder: string;
  icon: 'start' | 'end';
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  onClear,
  placeholder,
  icon,
}) => {
  const iconName = icon === 'start' ? 'ellipse-outline' : 'location-outline';
  const iconColor = icon === 'start' ? '#4A90E2' : '#E74C3C';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={iconName} size={20} color={iconColor} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChange}
        />
        {value ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
});

export default LocationInput;