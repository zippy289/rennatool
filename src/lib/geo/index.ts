// src/lib/geo/index.ts

export interface GeoResult {
  lat:     number;
  lng:     number;
  city:    string;
  state:   string;
  zipCode: string;
}

export async function geocodeZip(zipCode: string): Promise<GeoResult | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    if (!res.ok) return null;

    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;

    return {
      lat:     parseFloat(place.latitude),
      lng:     parseFloat(place.longitude),
      city:    place['place name'],
      state:   place['state abbreviation'],
      zipCode,
    };
  } catch {
    return null;
  }
}

export function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}

export function buildGeoFilter(lat: number, lng: number, radiusMiles: number) {
  const latDelta = radiusMiles / 69.0;
  const lngDelta = radiusMiles / (Math.cos(toRad(lat)) * 69.0);
  return {
    lat: { gte: lat - latDelta, lte: lat + latDelta },
    lng: { gte: lng - lngDelta, lte: lng + lngDelta },
  };
}
