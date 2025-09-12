import { useState, useCallback } from 'react';

export interface Location {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  steps?: any[];
}

export interface MapState {
  startLocation: Location | null;
  endLocation: Location | null;
  startAddress: string;
  endAddress: string;
  route: any | null;
  routeInfo: RouteInfo | null;
  selectedTravelMode: 'DRIVING' | 'TRANSIT' | 'WALKING';
}

export const useGoogleMaps = () => {
  const [mapState, setMapState] = useState<MapState>({
    startLocation: null,
    endLocation: null,
    startAddress: '',
    endAddress: '',
    route: null,
    routeInfo: null,
    selectedTravelMode: 'DRIVING',
  });

  const updateStartLocation = useCallback((location: Location, address: string) => {
    setMapState(prev => ({
      ...prev,
      startLocation: location,
      startAddress: address,
    }));
  }, []);

  const updateEndLocation = useCallback((location: Location, address: string) => {
    setMapState(prev => ({
      ...prev,
      endLocation: location,
      endAddress: address,
    }));
  }, []);

  const updateStartAddress = useCallback((address: string) => {
    setMapState(prev => ({
      ...prev,
      startAddress: address,
    }));
  }, []);

  const updateEndAddress = useCallback((address: string) => {
    setMapState(prev => ({
      ...prev,
      endAddress: address,
    }));
  }, []);

  const clearStart = useCallback(() => {
    setMapState(prev => ({
      ...prev,
      startLocation: null,
      startAddress: '',
    }));
  }, []);

  const clearEnd = useCallback(() => {
    setMapState(prev => ({
      ...prev,
      endLocation: null,
      endAddress: '',
    }));
  }, []);

  const setRouteInfo = useCallback((routeInfo: RouteInfo) => {
    setMapState(prev => ({
      ...prev,
      routeInfo,
    }));
  }, []);

  const clearRoute = useCallback(() => {
    setMapState(prev => ({
      ...prev,
      route: null,
      routeInfo: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setMapState({
      startLocation: null,
      endLocation: null,
      startAddress: '',
      endAddress: '',
      route: null,
      routeInfo: null,
      selectedTravelMode: 'DRIVING',
    });
  }, []);

  const handleLocationSelect = useCallback((location: Location, address: string, type: 'start' | 'end') => {
    if (type === 'start') {
      updateStartLocation(location, address);
    } else {
      updateEndLocation(location, address);
    }
  }, [updateStartLocation, updateEndLocation]);

  const setTravelMode = useCallback((mode: 'DRIVING' | 'TRANSIT' | 'WALKING') => {
    setMapState(prev => ({
      ...prev,
      selectedTravelMode: mode,
    }));
  }, []);

  return {
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
  };
};