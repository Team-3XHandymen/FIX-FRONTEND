// Reference Google Maps types if installed globally (optional)
// If @types/google.maps is not installed, these ambient declarations will suppress TS errors for the global `google` object.

// Minimal ambient declaration to satisfy TypeScript when using Google Maps JS API in browser
declare global {
  interface Window {
    google: typeof google | undefined;
  }

  namespace google {
    namespace maps {
      // Core Map types
      class Map {
        constructor(mapDiv: HTMLElement, opts?: any);
        setCenter(latlng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        addListener(eventName: string, handler: (...args: any[]) => void): any;
      }

      class Marker {
        constructor(opts?: any);
        setPosition(position: LatLng | LatLngLiteral): void;
        getPosition(): LatLng | null;
        setMap(map: Map | null): void;
        addListener(eventName: string, handler: (...args: any[]) => void): any;
      }

      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface MapMouseEvent {
        latLng?: LatLng;
      }

      enum MapTypeId {
        ROADMAP = 'roadmap',
        SATELLITE = 'satellite',
        HYBRID = 'hybrid',
        TERRAIN = 'terrain'
      }

      // Geocoder types
      class Geocoder {
        geocode(request: GeocoderRequest, callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void): void;
      }

      interface GeocoderRequest {
        location?: LatLng | LatLngLiteral;
        address?: string;
        placeId?: string;
      }

      interface GeocoderResult {
        formatted_address: string;
        address_components: GeocoderAddressComponent[];
        geometry: GeocoderGeometry;
        place_id: string;
      }

      interface GeocoderAddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }

      interface GeocoderGeometry {
        location: LatLng;
        location_type: string;
      }

      enum GeocoderStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST'
      }

      // Places API types
      namespace places {
        class Autocomplete {
          constructor(input: HTMLInputElement, opts?: any);
          addListener(eventName: string, handler: () => void): any;
          getPlace(): any;
        }

        class PlaceAutocompleteElement extends HTMLElement {
          constructor(opts?: any);
          value: any;
          addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
          removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
        }
      }

      // Event types
      namespace event {
        function removeListener(listener: any): void;
      }
    }
  }
}

export {};
