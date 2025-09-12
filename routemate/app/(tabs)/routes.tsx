import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace this with your own Google Maps API Key
const API_KEY = 'AIzaSyChJiEeeJHKaqvXh7MFYNSg0jHfR6MAo2o'; 

export default function RoutesScreen() {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [route, setRoute] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track successful submission
  const mapRef = useRef<MapView | null>(null);
  const router = useRouter();

  // Clear journey state when returning to routes
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.removeItem('journeyStarted');
    }, [])
  );

  // Save to AsyncStorage on input change
  useEffect(() => {
    const saveRouteDetails = async () => {
      try {
        await AsyncStorage.setItem('startLocation', startAddress);
        await AsyncStorage.setItem('endLocation', endAddress);
      } catch (error) {
        console.log('Error saving route details:', error);
      }
    };
    saveRouteDetails();
  }, [startAddress, endAddress]);

  // Function to decode polyline points from Google Maps API
  const decodePolyline = (encoded: string) => {
    const points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  // Function to get the directions from Google Maps Directions API
  const getDirections = async () => {
    if (!startAddress || !endAddress) {
      Alert.alert('Please enter both start and end locations');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(startAddress)}&destination=${encodeURIComponent(endAddress)}&mode=transit&key=${API_KEY}`
      );

      const data = response.data;
      if (data.status === 'OK') {
        const routeData = data.routes[0];
        const leg = routeData.legs[0];
        setRoute(leg);
        setSteps(leg.steps);

        let allCoordinates: { latitude: number; longitude: number }[] = [];
        for (let step of leg.steps) {
          if (step.polyline && step.polyline.points) {
            const stepPoints = decodePolyline(step.polyline.points);
            allCoordinates = allCoordinates.concat(stepPoints);
          }
        }
        setCoordinates(allCoordinates);
        setIsSubmitted(true); // Set to true only on successful API response

        // Save start, end, and current time to AsyncStorage
        await AsyncStorage.setItem('startLocation', startAddress);
        await AsyncStorage.setItem('endLocation', endAddress);
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
        await AsyncStorage.setItem('journeyTime', currentTime);
      } else {
        Alert.alert('Error fetching directions', `Status: ${data.status}. Please check your locations or API key.`);
        setIsSubmitted(false); // Reset on error
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Error fetching directions',
        err.message || 'Network error or invalid API key. Please check your connection and API key restrictions.'
      );
    }
    setLoading(false);
  };

  // Zoom to fit the route
  useEffect(() => {
    if (coordinates.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [coordinates]);

  interface Step {
    html_instructions?: string;
    instructions?: string;
    duration: { text: string };
    transit_details?: {
      line: { short_name: string; name: string };
      headsign: string;
    };
    travel_mode: string;
  }

  // Function to get formatted step text
  const getStepText = (step: Step, index: number) => {
    let description = step.html_instructions ? step.html_instructions.replace(/<[^>]+>/g, '') : step.instructions || '';
    let duration = step.duration.text;

    if (step.travel_mode === 'TRANSIT' && step.transit_details) {
      const line = step.transit_details.line;
      const lineName = line.short_name ? line.short_name : (line.name || 'Bus');
      const headsign = step.transit_details.headsign || '';
      description = `Take bus ${lineName} towards ${headsign} - ${description}`;
    } else if (step.travel_mode === 'WALKING') {
      description = `Walk - ${description}`;
    }
    
    return `${index + 1}. ${description} (${duration})`;
  };

  // Handle OnBoard navigation
  const handleOnBoardPress = async () => {
    try {
      // Save route details before navigation
      await AsyncStorage.setItem('routeSteps', JSON.stringify(steps));
      await AsyncStorage.setItem('routeCoordinates', JSON.stringify(coordinates));
      
      // Navigate to onboard screen using Expo Router
      router.push('/onboard');
      console.log('Navigating to OnBoard screen');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to navigate to OnBoard screen. Please try again.');
    }
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

        <TouchableOpacity style={styles.button} onPress={getDirections} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Find Route'}</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider="google"
            initialRegion={{
              latitude: 6.9271,
              longitude: 79.8612,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {coordinates.length > 0 && (
              <Polyline coordinates={coordinates} strokeColor="#2D6CDF" strokeWidth={4} />
            )}
            {route && (
              <>
                <Marker 
                  coordinate={{ latitude: route.start_location.lat, longitude: route.start_location.lng }} 
                  title="Start" 
                />
                <Marker 
                  coordinate={{ latitude: route.end_location.lat, longitude: route.end_location.lng }} 
                  title="End" 
                />
              </>
            )}
          </MapView>
        )}
      </View>

      {/* Bus Steps */}
      {steps.length > 0 && (
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsHeader}>Bus Steps:</Text>
          {steps
            .map((step, index) => getStepText(step, index))
            .filter(step => step !== null && typeof step === 'string')
            .map((step, index) => (
              <Text key={index} style={styles.stepText}>{String(step)}</Text>
            ))}
        </View>
      )}

      {/* OnBoard Button */}
      {isSubmitted && steps.length > 0 && (
        <TouchableOpacity style={styles.onboardButton} onPress={handleOnBoardPress}>
          <Text style={styles.onboardButtonText}>OnBoard</Text>
        </TouchableOpacity>
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
  onboardButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    margin: 16,
    marginBottom: 20,
  },
  onboardButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});