import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GoogleMapComponent from '../../components/GoogleMapComponent';
import LocationInput from '../../components/LocationInput';
import RouteInfo from '../../components/RouteInfo';
import TravelModeSelector from '../../components/TravelModeSelector';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

const GOOGLE_MAPS_APIKEY = 'AIzaSyChJiEeeJHKaqvXh7MFYNSg0jHfR6MAo2o';

export default function RoutesScreen() {
  const {
    mapState,
    updateStartLocation,
    updateEndLocation,
    updateStartAddress,
    updateEndAddress,
    clearStart,
    clearEnd,
    setRouteInfo,
    clearRoute,
    reset,
    handleLocationSelect,
    setTravelMode,
  } = useGoogleMaps();

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_APIKEY}&region=lk`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleStartAddressSubmit = async () => {
    if (!mapState.startAddress.trim()) return;
    
    const coordinates = await geocodeAddress(mapState.startAddress);
    if (coordinates) {
      updateStartLocation(coordinates, mapState.startAddress);
    } else {
      Alert.alert('Error', 'Could not find the starting location. Please check your address.');
    }
  };

  const handleEndAddressSubmit = async () => {
    if (!mapState.endAddress.trim()) return;
    
    const coordinates = await geocodeAddress(mapState.endAddress);
    if (coordinates) {
      updateEndLocation(coordinates, mapState.endAddress);
    } else {
      Alert.alert('Error', 'Could not find the destination. Please check your address.');
    }
  };

  const handleFindRoute = () => {
    if (!mapState.startLocation || !mapState.endLocation) {
      Alert.alert('Error', 'Please select both start and end locations');
      return;
    }
    // Route calculation is handled automatically in GoogleMapComponent
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="map" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Route Planner</Text>
            <Text style={styles.headerSubtitle}>Find the best route anywhere</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="navigate-outline" size={16} color="#666" />
          <Text style={styles.headerRightText}>Global Routes</Text>
        </View>
      </View>

      <View style={styles.container}>
        {/* Controls Panel */}
        <View style={styles.controlsPanel}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Main Controls */}
            <View style={styles.controlsCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="navigate-outline" size={20} color="#4A90E2" />
                <Text style={styles.cardTitle}>Plan Your Route</Text>
              </View>
              
              <TravelModeSelector
                selectedMode={mapState.selectedTravelMode}
                onModeChange={setTravelMode}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Starting Point</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="ellipse-outline" size={20} color="#4A90E2" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Colombo, Kandy, Galle..."
                    placeholderTextColor="#999"
                    value={mapState.startAddress}
                    onChangeText={updateStartAddress}
                    onSubmitEditing={handleStartAddressSubmit}
                    returnKeyType="search"
                  />
                  {mapState.startAddress ? (
                    <TouchableOpacity onPress={clearStart} style={styles.clearButton}>
                      <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Destination</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} color="#E74C3C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Negombo, Nuwara Eliya..."
                    placeholderTextColor="#999"
                    value={mapState.endAddress}
                    onChangeText={updateEndAddress}
                    onSubmitEditing={handleEndAddressSubmit}
                    returnKeyType="search"
                  />
                  {mapState.endAddress ? (
                    <TouchableOpacity onPress={clearEnd} style={styles.clearButton}>
                      <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.findRouteButton,
                  (!mapState.startLocation || !mapState.endLocation) && styles.buttonDisabled
                ]}
                onPress={handleFindRoute}
                disabled={!mapState.startLocation || !mapState.endLocation}
              >
                <Ionicons name="navigate-outline" size={16} color="#fff" />
                <Text style={styles.findRouteButtonText}>Calculate Shortest Route</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.clearAllButton} onPress={reset}>
                <Text style={styles.clearAllButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {/* Route Information */}
            {mapState.routeInfo && (
              <RouteInfo 
                routeInfo={mapState.routeInfo}
                onClearRoute={clearRoute}
                travelMode={mapState.selectedTravelMode}
              />
            )}

            {/* Instructions */}
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>How to use:</Text>
              <Text style={styles.instructionItem}>• Type any location worldwide (Sri Lanka supported)</Text>
              <Text style={styles.instructionItem}>• Or tap on the map to select locations</Text>
              <Text style={styles.instructionItem}>• Choose travel mode: driving, transit, or walking</Text>
              <Text style={styles.instructionItem}>• Get bus routes and public transport info</Text>
              <Text style={styles.instructionItem}>• Use the controls to get your current location</Text>
            </View>
          </ScrollView>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <GoogleMapComponent
            startLocation={mapState.startLocation}
            endLocation={mapState.endLocation}
            route={mapState.route}
            travelMode={mapState.selectedTravelMode}
            onRouteCalculated={setRouteInfo}
            onLocationSelect={handleLocationSelect}
            onReset={reset}
          />
        </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  controlsPanel: {
    width: '40%',
    backgroundColor: '#F7F8FA',
    padding: 16,
  },
  controlsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
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
  clearButton: {
    padding: 4,
  },
  findRouteButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  findRouteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  clearAllButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  instructionsCard: {
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
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: -2, height: 0 },
    elevation: 5,
    margin: 8,
    marginLeft: 0,
  },
});