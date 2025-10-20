import { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { X, MapPin, Navigation } from 'lucide-react';

interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

interface MapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (locationData: LocationData) => void;
  initialLocation?: { lat: number; lng: number };
}

export const MapLocationPicker = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation = { lat: 7.2906, lng: 80.6337 } // Default to Kandy, Sri Lanka
}: MapLocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    // Check if Google Maps is loaded
    if (!window.google || !window.google.maps) {
      console.error('Google Maps not loaded');
      setError('Google Maps failed to load. Please refresh the page and try again.');
      return;
    }

    setIsLoaded(true);
    setError('');

    try {
      // Initialize map
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      // Initialize geocoder
      geocoderRef.current = new google.maps.Geocoder();

      // Create marker
      markerRef.current = new google.maps.Marker({
        position: initialLocation,
        map: mapInstanceRef.current,
        draggable: true,
        title: 'Drag to select location',
      });

      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map. Please try again.');
      return;
    }

    // Handle marker drag
    markerRef.current.addListener('dragend', () => {
      const position = markerRef.current?.getPosition();
      if (position) {
        updateLocationFromPosition(position);
      }
    });

    // Handle map click
    mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        markerRef.current?.setPosition(event.latLng);
        updateLocationFromPosition(event.latLng);
      }
    });

    // Initial geocoding
    updateLocationFromPosition(new google.maps.LatLng(initialLocation.lat, initialLocation.lng));

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, initialLocation]);

  const updateLocationFromPosition = (position: google.maps.LatLng) => {
    if (!geocoderRef.current) {
      console.error('Geocoder not initialized');
      return;
    }

    geocoderRef.current.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        try {
          const result = results[0];
          
          // Extract location components
          let city = '';
          let state = '';
          let country = '';
          let address = result.formatted_address;

          for (const component of result.address_components) {
            const types = component.types;

            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            }
          }

          const locationData: LocationData = {
            address,
            city,
            state,
            country,
            lat: position.lat(),
            lng: position.lng(),
          };

          setSelectedLocation(locationData);
          setError(''); // Clear any previous errors
          console.log('Location updated:', locationData);
        } catch (error) {
          console.error('Error processing geocoding result:', error);
          setError('Failed to get address for selected location.');
        }
      } else {
        console.error('Geocoding failed:', status);
        
        // If geocoding fails, still allow the user to select coordinates
        const locationData: LocationData = {
          address: `Location at ${position.lat().toFixed(6)}, ${position.lng().toFixed(6)}`,
          city: 'Unknown',
          state: 'Unknown',
          country: 'Unknown',
          lat: position.lat(),
          lng: position.lng(),
        };

        setSelectedLocation(locationData);
        
        if (status === 'REQUEST_DENIED') {
          setError('Geocoding API not enabled. Location coordinates saved without address details.');
        } else {
          setError('Failed to get address details, but location coordinates are saved.');
        }
      }
    });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    if (!isLoaded || !mapInstanceRef.current || !markerRef.current) {
      setError('Map is not ready. Please wait and try again.');
      return;
    }

    setIsLoadingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log('Got current location:', userLocation);

          mapInstanceRef.current?.setCenter(userLocation);
          markerRef.current?.setPosition(userLocation);
          updateLocationFromPosition(new google.maps.LatLng(userLocation.lat, userLocation.lng));
        } catch (error) {
          console.error('Error setting location:', error);
          setError('Failed to set current location on map.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your current location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        setError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Move the pin to save your exact location
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative">
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-sm z-10">
              <div className="flex items-center">
                <X className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <div ref={mapRef} className="w-full h-96" />
          
          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Click on the map or drag the marker to select your exact location
            </p>
          </div>

          {/* Current Location Button */}
          <div className="absolute top-4 right-4">
            <Button
              onClick={handleCurrentLocation}
              variant="outline"
              size="sm"
              className="bg-white shadow-sm"
              disabled={isLoadingLocation || !isLoaded}
            >
              {isLoadingLocation ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Current Location
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Selected Location Info */}
        <div className="p-4 border-t">
          {selectedLocation ? (
            <div className="space-y-2">
              <h4 className="font-medium">Selected Location:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Address:</strong> {selectedLocation.address}</p>
                {selectedLocation.city && <p><strong>City:</strong> {selectedLocation.city}</p>}
                {selectedLocation.state && <p><strong>State:</strong> {selectedLocation.state}</p>}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Click on the map to select a location
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedLocation}
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
};
