import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps'; // Import MapView and Polyline
import axios from 'axios'; // For making HTTP requests to the Directions API

const { width, height } = Dimensions.get('window');

// Replace this with your own Google Maps API Key
const API_KEY = 'AIzaSyChJiEeeJHKaqvXh7MFYNSg0jHfR6MAo2o'; 

export default function RoutesScreen() {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [route, setRoute] = useState<any>(null); // Stores route data
  const [steps, setSteps] = useState<any[]>([]); // Stores steps for the route
  const [loading, setLoading] = useState(false);

  // Function to get the directions from Google Maps Directions API
  const getDirections = async () => {
    if (!startAddress || !endAddress) {
      alert('Please enter both start and end locations');
      return;
    }

    setLoading(true);
    try {
      // Google Maps Directions API request (for public transit mode)
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startAddress}&destination=${endAddress}&mode=transit&key=${API_KEY}`
      );

      const data = response.data;
      if (data.status === 'OK') {
        // Extract route and steps data
        const routeData = data.routes[0].legs[0];
        setRoute(routeData);
        setSteps(routeData.steps); // Set transit steps (bus/train directions)
      } else {
        alert('Error fetching directions');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching directions');
    }
    setLoading(false);
  };

  // Render the route on the map using Polyline
  const renderRoute = () => {
    if (!route) return null;

    const points = route.steps.map((step: any) => ({
      latitude: step.end_location.lat,
      longitude: step.end_location.lng,
    }));

    return <Polyline coordinates={points} strokeColor="#2D6CDF" strokeWidth={4} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="#000" />
        <Text style={styles.headerTitle}>Routes</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Ionicons name="ellipse-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter starting point"
            value={startAddress}
            onChangeText={setStartAddress}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={endAddress}
            onChangeText={setEndAddress}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={getDirections}>
          <Text style={styles.buttonText}>Find Route</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
        ) : (
          <MapView
            style={styles.map}
            provider="google"
            initialRegion={{
              latitude: 6.9271,
              longitude: 79.8612,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Render Polyline if route is available */}
            {renderRoute()}

            {/* Markers for Start and End Locations */}
            {route && (
              <>
                <Marker coordinate={{ latitude: route.start_location.lat, longitude: route.start_location.lng }} title="Start" />
                <Marker coordinate={{ latitude: route.end_location.lat, longitude: route.end_location.lng }} title="End" />
              </>
            )}
          </MapView>
        )}
      </View>

      {/* Bus Steps */}
      {steps.length > 0 && (
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsHeader}>Bus Steps:</Text>
          {steps.map((step, index) => (
            <Text key={index} style={styles.stepText}>{`${index + 1}. ${step.instructions} (${step.duration.text})`}</Text>
          ))}
        </View>
      )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    padding: 16,
    backgroundColor: '#F7F8FA',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#2D6CDF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  stepsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  stepsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
});
