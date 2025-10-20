import { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { MapLocationPicker } from './map-location-picker';

interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

interface LocationPreviewProps {
  locationData: LocationData | null;
  onClear?: () => void;
}

// Location Preview Component
const LocationPreview: React.FC<LocationPreviewProps> = ({ locationData, onClear }) => {
  if (!locationData) return null;

  return (
    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">Selected Location</span>
          </div>
          
          <div className="space-y-1 text-sm text-gray-700">
            {locationData.address && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 w-16 flex-shrink-0">Address:</span>
                <span className="font-medium">{locationData.address}</span>
              </div>
            )}
            
            {(locationData.city || locationData.state) && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 w-16 flex-shrink-0">Area:</span>
                <span>
                  {[locationData.city, locationData.state].filter(Boolean).join(', ')}
                  {locationData.country && `, ${locationData.country}`}
                </span>
              </div>
            )}
            
            {/* Coordinates intentionally hidden from UI */}
          </div>
        </div>
        
        {onClear && (
          <button
            onClick={onClear}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Clear location"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

interface LocationSelectorProps {
  value: string;
  onChange: (locationData: LocationData) => void;
  onInputChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const LocationSelector = ({
  value,
  onChange,
  onInputChange,
  label = "Location",
  placeholder = "Enter your location or click to set on map",
  required = false,
  className = "",
  disabled = false
}: LocationSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState<LocationData | null>(null);
  const [showMapComponent, setShowMapComponent] = useState(false);
  const [selectedCityCoordinates, setSelectedCityCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps script
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key is not configured');
      console.error('VITE_GOOGLE_MAPS_API_KEY is not set in environment variables');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps');
      console.error('Failed to load Google Maps script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Search for places using Place.searchByText API
  const searchPlaces = async (query: string) => {
    if (!isLoaded || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Search for places
      
      // Use Place.searchByText API
      const { Place } = await (google.maps as any).importLibrary("places");
      
      const request = {
        textQuery: query + ' Sri Lanka',
        locationBias: new google.maps.LatLng(7.2906, 80.6337), // Center on Sri Lanka
        includedType: 'locality',
        fields: ['id', 'displayName', 'formattedAddress', 'location']
      };

      const { places } = await Place.searchByText(request);
      
      // Process search results
      
      if (places && places.length > 0) {
        const formattedSuggestions = places.map((place: any) => ({
          place_id: place.id,
          description: place.displayName || place.formattedAddress,
          structured_formatting: {
            main_text: place.displayName || '',
            secondary_text: place.formattedAddress || ''
          },
          place: place
        }));
        
        // Format suggestions for display
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
          } else {
        setSuggestions([]);
        setShowSuggestions(false);
            }
          } catch (error) {
      console.error('🔍 Error searching places:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

        // Handle place selection
  const handlePlaceSelect = async (suggestion: any) => {
    // Handle suggestion selection

    try {
      // Use the data we already have from the search results
      const place = suggestion.place;
      
      // Extract place data

      if (place) {
        // Normalize coordinates: new Places API may return functions for lat/lng
        const latValue = place.location ? (typeof place.location.lat === 'function' ? place.location.lat() : place.location.lat) : 0;
        const lngValue = place.location ? (typeof place.location.lng === 'function' ? place.location.lng() : place.location.lng) : 0;

        // Extract location data directly from the place object
          const locationData: LocationData = {
          address: place.formattedAddress || suggestion.description || '',
          city: place.displayName || suggestion.structured_formatting?.main_text || '',
          state: '',
          country: 'Sri Lanka',
          lat: Number(latValue) || 0,
          lng: Number(lngValue) || 0
        };

        // Location data ready

          // Update the input field through controlled component
        if (onInputChange) {
          onInputChange(locationData.address || locationData.city);
        }

          setSelectedLocationData(locationData);
          onChange(locationData);
        setShowSuggestions(false);

          // Show the map component below with the selected city coordinates
        setSelectedCityCoordinates({ lat: locationData.lat, lng: locationData.lng });
          setShowMapComponent(true);
              } else {
        // No place data available
      }
            } catch (error) {
      // Error handling
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (onInputChange) {
      onInputChange(newValue);
    }
    
    // Clear selected location data if input is cleared
    if (!newValue.trim()) {
      setSelectedLocationData(null);
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    // Search for places with debouncing
    const timeoutId = setTimeout(() => {
      searchPlaces(newValue);
            }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    // Handle suggestion click
    handlePlaceSelect(suggestion);
  };

    // Clear selected location
  const handleClearLocation = () => {
      setSelectedLocationData(null);
    setShowMapComponent(false);
    setSelectedCityCoordinates(null);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Clear input through controlled component
    if (onInputChange) {
      onInputChange('');
    }
  };

  // Handle map location selection
  const handleMapLocationSelect = (locationData: LocationData) => {
    setSelectedLocationData(locationData);
    onChange(locationData);
    setShowMapModal(false);
    
    // Update the input field through controlled component
    if (onInputChange) {
      const displayText = locationData.address || `${locationData.city}, ${locationData.state}`;
      onInputChange(displayText);
    }
  };

  if (error) {
    return (
      <div className={className}>
        {label && <Label className="text-red-500">{label}</Label>}
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="border-red-500"
        />
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <Label htmlFor="location-autocomplete">{label} {required && <span className="text-red-500">*</span>}</Label>}
      
      <div className="relative">
        <div className="flex">
      <Input
        ref={inputRef}
        id="location-autocomplete"
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled || !isLoaded}
            className={`${!isLoaded ? 'bg-gray-100' : ''} rounded-r-none`}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={disabled || !isLoaded}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id || index}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="font-medium text-gray-900">
                  {suggestion.structured_formatting.main_text}
                </div>
                <div className="text-sm text-gray-500">
                  {suggestion.structured_formatting.secondary_text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isLoaded && !error && (
        <p className="text-sm text-gray-500 mt-1">Loading location services...</p>
      )}
      
      {/* Location Preview Component */}
      <LocationPreview 
        locationData={selectedLocationData} 
        onClear={handleClearLocation}
      />
      
      {/* Map Component - Shows below after city selection */}
      {showMapComponent && selectedCityCoordinates && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Pin Exact Location</h3>
            <p className="text-xs text-gray-500">Drag the pin to select the exact location within {selectedLocationData?.city || 'the selected area'}</p>
          </div>
          <MapLocationPicker
            isOpen={true}
            onClose={() => setShowMapComponent(false)}
            onLocationSelect={(locationData) => {
              setSelectedLocationData(locationData);
              onChange(locationData);
              // keep controlled input in sync when selecting from inline map
              if (onInputChange) {
                const displayText = locationData.address || `${locationData.city}, ${locationData.state}`;
                onInputChange(displayText);
              }
              setShowMapComponent(false);
            }}
            initialLocation={selectedCityCoordinates}
          />
        </div>
      )}
      
      {/* Map Modal (for map pin button) */}
      <MapLocationPicker
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelect={handleMapLocationSelect}
        initialLocation={selectedLocationData ? { lat: selectedLocationData.lat, lng: selectedLocationData.lng } : { lat: 7.2906, lng: 80.6337 }}
      />
    </div>
  );
};