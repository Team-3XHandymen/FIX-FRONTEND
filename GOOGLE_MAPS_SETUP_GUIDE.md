# Google Maps Integration Setup Guide

This guide explains how to set up and use Google Maps Autocomplete for location selection in your application.

## What We've Implemented

### Frontend Changes:
1. ✅ Created `LocationAutocomplete` component for location search
2. ✅ Integrated Google Maps Autocomplete in **Handyman Registration** form (Step 4)
3. ✅ Set up environment variables for Google Maps API key
4. ✅ Added state management for location and coordinates

### Backend Changes:
1. ✅ Updated `ServiceProvider` model to store coordinates
2. ✅ Updated `ProviderPrivateData` model to store coordinates
3. ✅ Updated `Client` model to store coordinates

## Step 1: Get Google Maps API Key

### 1.1 Create/Access Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** at the top
4. Click **"NEW PROJECT"**
   - **Project name**: `FixFinder` (or your preferred name)
   - Click **"CREATE"**
5. Wait for project creation (takes a few seconds)

### 1.2 Enable Required APIs

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for and enable these APIs:
   - **Maps JavaScript API** (for the autocomplete widget)
   - **Places API** (for location autocomplete and details)
   - **Geocoding API** (optional, for reverse geocoding)

For each API:
- Click on the API name
- Click **"ENABLE"** button
- Wait for enablement confirmation

### 1.3 Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"API key"**
4. Your API key will be created and displayed
5. Copy the API key (format: `AIzaSy...`)

### 1.4 Restrict API Key (Recommended for Security)

1. Click **"EDIT API KEY"** (pencil icon) next to your new key
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Click **"ADD AN ITEM"**
   - Add these referrers:
     ```
     http://localhost:*
     https://localhost:*
     https://your-domain.com/*
     ```
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check:
     - Maps JavaScript API
     - Places API
     - Geocoding API
4. Click **"SAVE"**

### 1.5 Enable Billing (Required)

Google requires billing to be enabled (they offer $200 free credit monthly):

1. Go to **"Billing"** in left sidebar
2. Click **"LINK A BILLING ACCOUNT"** or **"CREATE BILLING ACCOUNT"**
3. Follow the prompts to add payment information
4. Note: You likely won't be charged (unless you exceed $200/month usage)

## Step 2: Add API Key to Your Project

### 2.1 Frontend Configuration

Create or update your `.env` file in the `FIX-FRONTEND` directory:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your-api-key-here
```

**Important**: Never commit this file to Git!

Verify your `.gitignore` includes:
```
.env
.env.local
.env.*.local
```

### 2.2 Restart Development Server

After adding the API key, restart your frontend development server:

```bash
cd FIX-FRONTEND
npm run dev
```

## Step 3: Test the Integration

### 3.1 Test Handyman Registration

1. Navigate to: `http://localhost:8080/signup/handyman`
2. Fill in Steps 1-3
3. On Step 4, find the **"Location"** field
4. Start typing a city name (e.g., "Kandy", "Colombo")
5. You should see autocomplete suggestions appear
6. Select a city from the dropdown
7. The location will be saved with coordinates

### 3.2 What Gets Saved

When a user selects a location, the system saves:
- **location**: City name as string (e.g., "Kandy")
- **coordinates**: `{ lat: 7.2906, lng: 80.6337 }`

This data is saved in both:
- `ServiceProvider` collection
- `ProviderPrivateData` collection

## Step 4: Integrate in Client Profile (TODO)

To integrate location autocomplete in the client profile page:

### 4.1 Find Client Profile Component

The client profile is likely in:
- `FIX-FRONTEND/src/pages/client/ClientProfile.tsx`
- Or similar path in the client pages directory

### 4.2 Add LocationAutocomplete

Import and use the component:

```typescript
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";

// In your component:
const [locationValue, setLocationValue] = useState("");
const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

const handleLocationChange = (locationData: any) => {
  setLocationValue(locationData.city || locationData.address);
  setCoordinates({ lat: locationData.lat, lng: locationData.lng });
};

// In your JSX:
<LocationAutocomplete
  value={locationValue}
  onChange={handleLocationChange}
  onInputChange={setLocationValue}
  label="Location"
  placeholder="Search for your city"
  required={true}
/>
```

### 4.3 Update Profile Update Handler

When saving the profile, include both location and coordinates:

```typescript
const profileData = {
  ...otherFields,
  location: locationValue,
  coordinates: coordinates
};

await ClientAPI.updateClientProfile(userId, profileData);
```

## Step 5: Distance Calculation (Backend)

### 5.1 Create Distance Utility

Create `FIX-BACKEND/src/utils/distance.ts`:

```typescript
/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
```

### 5.2 Update Handyman Controller

Update `FIX-BACKEND/src/controllers/handymanController.ts`:

```typescript
import { calculateDistance } from '../utils/distance';

// In registerHandyman function, save coordinates:
const handymanData = {
  // ... other fields
  location: req.body.location,
  coordinates: req.body.coordinates ? {
    lat: req.body.coordinates.lat,
    lng: req.body.coordinates.lng
  } : undefined
};

// Create ServiceProvider with coordinates
const serviceProvider = new ServiceProvider({
  // ... other fields
  location: req.body.location,
  coordinates: req.body.coordinates
});

// Create ProviderPrivateData with coordinates
const providerPrivateData = new ProviderPrivateData({
  // ... other fields
  location: req.body.location,
  coordinates: req.body.coordinates
});
```

### 5.3 Add Distance-Based Filtering

Add a new endpoint or modify existing search:

```typescript
export const searchHandymenByLocation = async (req: Request, res: Response) => {
  try {
    const { lat, lng, maxDistance = 50 } = req.query; // maxDistance in km
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    // Get all service providers
    const providers = await ServiceProvider.find({});
    
    // Filter by distance and add distance field
    const providersWithDistance = providers
      .map(provider => {
        if (!provider.coordinates?.lat || !provider.coordinates?.lng) {
          return null;
        }
        
        const distance = calculateDistance(
          Number(lat),
          Number(lng),
          provider.coordinates.lat,
          provider.coordinates.lng
        );
        
        return {
          ...provider.toObject(),
          distance
        };
      })
      .filter(p => p !== null && p.distance <= Number(maxDistance))
      .sort((a, b) => a!.distance - b!.distance);
    
    res.json({
      success: true,
      data: providersWithDistance
    });
  } catch (error) {
    console.error('Search by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
```

## Step 6: Sync Location Between Models

### 6.1 Update handymanController.ts

Ensure location is synced between ServiceProvider and ProviderPrivateData:

```typescript
// In updateHandymanProfile function:
if (updates.location || updates.coordinates) {
  const serviceProviderUpdates: any = {};
  
  if (updates.location) {
    serviceProviderUpdates.location = updates.location;
  }
  
  if (updates.coordinates) {
    serviceProviderUpdates.coordinates = updates.coordinates;
  }
  
  await ServiceProvider.findOneAndUpdate(
    { userId },
    serviceProviderUpdates,
    { new: true, runValidators: true }
  );
}
```

## Testing Checklist

- [ ] Google Maps API key is set in `.env`
- [ ] Frontend dev server restarted after adding API key
- [ ] Handyman registration location field shows autocomplete
- [ ] Selecting a location saves both string and coordinates
- [ ] Backend receives and stores coordinates correctly
- [ ] Client profile location field integrated (Step 4)
- [ ] Distance calculation utility created
- [ ] Search by distance works correctly

## Troubleshooting

### Issue: Autocomplete not showing

**Solution**:
1. Check browser console for errors
2. Verify API key is correct in `.env`
3. Ensure billing is enabled in Google Cloud
4. Check API key restrictions (should allow your domain)
5. Verify Maps JavaScript API and Places API are enabled

### Issue: "Failed to load Google Maps"

**Solution**:
1. Check internet connection
2. Verify API key is valid
3. Check browser console for specific error messages
4. Ensure no ad blockers are interfering

### Issue: Coordinates not being saved

**Solution**:
1. Check browser console for registration errors
2. Verify backend models have coordinates fields
3. Check backend logs for validation errors
4. Ensure coordinates are being sent in the request payload

### Issue: Distance calculation incorrect

**Solution**:
1. Verify coordinates are in decimal degrees format
2. Check that lat/lng are not swapped
3. Ensure Haversine formula is implemented correctly

## Cost Considerations

Google Maps Platform pricing (as of 2024):
- **Free tier**: $200 credit per month
- **Maps JavaScript API**: $7 per 1,000 loads
- **Places API - Autocomplete**: $2.83 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

**Typical usage**:
- Small application: Well within free tier
- Medium traffic (10,000 users/month): ~$10-20/month
- High traffic: Consider implementing request caching

## Security Best Practices

1. ✅ Never commit API key to version control
2. ✅ Restrict API key to specific domains
3. ✅ Restrict API key to only required APIs
4. ✅ Monitor usage in Google Cloud Console
5. ✅ Set up billing alerts
6. ✅ Rotate API keys periodically
7. ✅ Use environment variables for configuration

## Next Steps

After completing this setup:

1. **Integrate in Client Profile**: Follow Step 4 above
2. **Add Distance Filtering**: Implement backend distance calculations
3. **Optimize Search**: Add caching for frequently searched locations
4. **Add Map Display**: Show handymen locations on a map
5. **Improve UX**: Add loading states and error handling
6. **Monitor Usage**: Set up Google Cloud billing alerts

## Support Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

---

**Note**: Remember to never share your API key publicly and keep it secure in environment variables only!

