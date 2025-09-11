import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Google Maps API Key
const GOOGLE_MAPS_APIKEY = 'AIzaSyChJiEeeJHKaqvXh7MFYNSg0jHfR6MAo2o';

// Sri Lankan coordinates (Colombo as default center)
const SRI_LANKA_CENTER = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export default function RoutesScreen() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoords, setStartCoords] = useState<LocationCoordinate | null>(null);
  const [endCoords, setEndCoords] = useState<LocationCoordinate | null>(null);
  const [region, setRegion] = useState(SRI_LANKA_CENTER);
  const [loading, setLoading] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your current location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setRegion(currentRegion);
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  const geocodeAddress = async (address: string): Promise<LocationCoordinate | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_APIKEY}&region=lk`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const findRoute = async () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      Alert.alert('Error', 'Please enter both starting point and destination');
      return;
    }

    setLoading(true);
    setRouteFound(false);

    try {
      // Geocode both addresses
      const startCoordinates = await geocodeAddress(startLocation);
      const endCoordinates = await geocodeAddress(endLocation);

      if (!startCoordinates || !endCoordinates) {
        Alert.alert('Error', 'Could not find one or both locations. Please check your addresses.');
        setLoading(false);
        return;
      }

      setStartCoords(startCoordinates);
      setEndCoords(endCoordinates);

      // Fit map to show both markers
      const coordinates = [startCoordinates, endCoordinates];
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });

      setLoading(false);
    } catch (error) {
      console.error('Route finding error:', error);
      Alert.alert('Error', 'Failed to find route. Please try again.');
      setLoading(false);
    }
  };

  const onDirectionsReady = (result: any) => {
    setRouteFound(true);
    setDistance(result.distance.toFixed(1) + ' km');
    setDuration(Math.ceil(result.duration) + ' min');
  };

  const onDirectionsError = (errorMessage: string) => {
    console.error('Directions error:', errorMessage);
    Alert.alert('Route Error', 'Could not calculate route between these locations.');
  };

  const clearRoute = () => {
    setStartLocation('');
    setEndLocation('');
    setStartCoords(null);
    setEndCoords(null);
    setRouteFound(false);
    setDistance('');
    setDuration('');
    setRegion(SRI_LANKA_CENTER);
  };

  const useCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      
      // Reverse geocode to get address
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setStartLocation(data.results[0].formatted_address);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Current location error:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="#000" />
        <Text style={styles.headerTitle}>Routes</Text>
        <TouchableOpacity onPress={clearRoute}>
          <Ionicons name="refresh-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Ionicons name="ellipse-outline" size={20} color="#4A90E2" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter starting point"
            placeholderTextColor="#999"
            value={startLocation}
            onChangeText={setStartLocation}
          />
          <TouchableOpacity onPress={useCurrentLocation} style={styles.locationButton}>
            <Ionicons name="locate-outline" size={18} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={20} color="#E74C3C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            placeholderTextColor="#999"
            value={endLocation}
            onChangeText={setEndLocation}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={findRoute}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Find Route</Text>
          )}
        </TouchableOpacity>

        {/* Route Info */}
        {routeFound && (
          <View style={styles.routeInfo}>
            <View style={styles.routeInfoItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.routeInfoText}>{duration}</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Ionicons name="speedometer-outline" size={16} color="#666" />
              <Text style={styles.routeInfoText}>{distance}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Google Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          mapType="standard"
          onRegionChangeComplete={setRegion}
        >
          {/* Start Location Marker */}
          {startCoords && (
            <Marker
              coordinate={startCoords}
              title="Start Location"
              description={startLocation}
              pinColor="#4A90E2"
            />
          )}

          {/* End Location Marker */}
          {endCoords && (
            <Marker
              coordinate={endCoords}
              title="Destination"
              description={endLocation}
              pinColor="#E74C3C"
            />
          )}

          {/* Route Directions */}
          {startCoords && endCoords && (
            <MapViewDirections
              origin={startCoords}
              destination={endCoords}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#4A90E2"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={onDirectionsReady}
              onError={onDirectionsError}
              mode="DRIVING"
              language="en"
              region="LK"
            />
          )}
        </MapView>
      </View>
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  form: {
    padding: 16,
    backgroundColor: '#F7F8FA',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
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
  locationButton: {
    padding: 8,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },
  map: {
    flex: 1,
  },
});