import { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { Label } from './label';

interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (locationData: LocationData) => void;
  onInputChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const LocationAutocomplete = ({
  value,
  onChange,
  onInputChange,
  label = "Location",
  placeholder = "Enter your location",
  required = false,
  className = "",
  disabled = false
}: LocationAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
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

        // Update the input field
        if (inputRef.current) {
          inputRef.current.value = locationData.address || locationData.city;
        }

      onChange(locationData);
        setShowSuggestions(false);
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
    console.log('🎯 Suggestion clicked:', suggestion);
    handlePlaceSelect(suggestion);
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
      <Input
        ref={inputRef}
        id="location-autocomplete"
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled || !isLoaded}
        className={!isLoaded ? 'bg-gray-100' : ''}
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
    </div>
  );
};