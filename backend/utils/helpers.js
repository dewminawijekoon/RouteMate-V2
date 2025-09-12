// Haversine distance in km
export function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Parse coordinates from location string like "6.93,79.85"
export function parseCoordinates(locationString) {
  if (!locationString || typeof locationString !== 'string') {
    return { lat: null, lng: null };
  }
  
  const match = locationString.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (match) {
    return {
      lat: Number(match[1]),
      lng: Number(match[2])
    };
  }
  
  return { lat: null, lng: null };
}

// Validate required fields
export function validateRequired(fields, data) {
  const missing = [];
  
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }
  
  return missing;
}

// Format error response
export function errorResponse(message, code = 500) {
  return {
    ok: false,
    error: message,
    code
  };
}

// Format success response
export function successResponse(data = {}) {
  return {
    ok: true,
    ...data
  };
}