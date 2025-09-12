import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { Location as LocationType, RouteInfo } from '../hooks/useGoogleMaps';

const GOOGLE_MAPS_APIKEY = 'AIzaSyChJiEeeJHKaqvXh7MFYNSg0jHfR6MAo2o';

// Sri Lankan coordinates (Colombo as default center)
const SRI_LANKA_CENTER: Region = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface GoogleMapComponentProps {
  startLocation: LocationType | null;
  endLocation: LocationType | null;
  route: any;
  travelMode: 'DRIVING' | 'TRANSIT' | 'WALKING';
  onRouteCalculated: (routeInfo: RouteInfo) => void;
  onLocationSelect: (location: LocationType, address: string, type: 'start' | 'end') => void;
  onReset: () => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  startLocation,
  endLocation,
  travelMode,
  onRouteCalculated,
  onLocationSelect,
}) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(SRI_LANKA_CENTER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (startLocation && endLocation && mapRef.current) {
      // Fit map to show both markers
      const coordinates = [
        { latitude: startLocation.lat, longitude: startLocation.lng },
        { latitude: endLocation.lat, longitude: endLocation.lng },
      ];
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [startLocation, endLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your current location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(currentRegion);
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLoading(true);

    try {
      const address = await reverseGeocode(latitude, longitude);
      const location: LocationType = { lat: latitude, lng: longitude };

      if (!startLocation) {
        onLocationSelect(location, address, 'start');
      } else if (!endLocation) {
        onLocationSelect(location, address, 'end');
      } else {
        // If both locations are set, replace the start location
        onLocationSelect(location, address, 'start');
      }
    } catch (error) {
      console.error('Error handling map press:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDirectionsReady = (result: any) => {
    const routeInfo: RouteInfo = {
      distance: result.distance.toFixed(1) + ' km',
      duration: Math.ceil(result.duration) + ' min',
    };
    onRouteCalculated(routeInfo);
  };

  const onDirectionsError = (errorMessage: string) => {
    console.error('Directions error:', errorMessage);
    Alert.alert('Route Error', 'Could not calculate route between these locations.');
  };

  const getDirectionsMode = () => {
    switch (travelMode) {
      case 'DRIVING':
        return 'DRIVING';
      case 'TRANSIT':
        return 'TRANSIT';
      case 'WALKING':
        return 'WALKING';
      default:
        return 'DRIVING';
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
      
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
        onPress={handleMapPress}
      >
        {/* Start Location Marker */}
        {startLocation && (
          <Marker
            coordinate={{
              latitude: startLocation.lat,
              longitude: startLocation.lng,
            }}
            title="Start Location"
            pinColor="#4A90E2"
          />
        )}

        {/* End Location Marker */}
        {endLocation && (
          <Marker
            coordinate={{
              latitude: endLocation.lat,
              longitude: endLocation.lng,
            }}
            title="Destination"
            pinColor="#E74C3C"
          />
        )}

        {/* Route Directions */}
        {startLocation && endLocation && (
          <MapViewDirections
            origin={{
              latitude: startLocation.lat,
              longitude: startLocation.lng,
            }}
            destination={{
              latitude: endLocation.lat,
              longitude: endLocation.lng,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#4A90E2"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between locations`);
            }}
            onReady={onDirectionsReady}
            onError={onDirectionsError}
            mode={getDirectionsMode()}
            language="en"
            region="LK"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default GoogleMapComponent;