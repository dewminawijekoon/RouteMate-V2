import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

// Replace this with your own Google Maps API Key
const API_KEY = 'AIzaSyChJiEeeJHKaqvXh7MFYNSg0jHfR6MAo2o'; 

const { width, height } = Dimensions.get('window');

export default function RoutesScreen() {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [route, setRoute] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView | null>(null);

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
      alert('Please enter both start and end locations');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startAddress}&destination=${endAddress}&mode=transit&key=${API_KEY}`
      );

      const data = response.data;
      if (data.status === 'OK') {
        const routeData = data.routes[0];
        const leg = routeData.legs[0];
        setRoute(leg);
        setSteps(leg.steps);

        // Collect coordinates from each step's polyline for more accurate path
        let allCoordinates: { latitude: number; longitude: number }[] = [];
        for (let step of leg.steps) {
          if (step.polyline && step.polyline.points) {
            const stepPoints = decodePolyline(step.polyline.points);
            allCoordinates = allCoordinates.concat(stepPoints);
          }
        }
        setCoordinates(allCoordinates);
      } else {
        alert('Error fetching directions');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching directions');
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
    let description = step.html_instructions
      ? step.html_instructions.replace(/<[^>]+>/g, '') // clean HTML tags
      : step.instructions || '';
    let duration = step.duration.text;

    if (step.travel_mode === 'TRANSIT' && step.transit_details) {
      const line = step.transit_details.line;
      const lineName = line.short_name || line.name || 'Bus';
      const headsign = step.transit_details.headsign || '';
      description = `Take bus ${lineName} towards ${headsign} - ${description}`;
    } else if (step.travel_mode === 'WALKING') {
      description = `Walk - ${description}`;
    }

    return `${index + 1}. ${description} (${duration})`;
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
            {/* Render Polyline with detailed route coordinates */}
            {coordinates.length > 0 && (
              <Polyline coordinates={coordinates} strokeColor="#2D6CDF" strokeWidth={4} />
            )}

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
            <Text key={index} style={styles.stepText}>{getStepText(step, index)}</Text>
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