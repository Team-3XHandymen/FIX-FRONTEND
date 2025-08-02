# Service Catalog Setup Guide

## 🚀 Quick Setup Instructions

### 1. Start the Backend Server
```bash
cd FIX-BACKEND
npm run dev
```

### 2. Seed the Database with Sample Services
In a new terminal:
```bash
cd FIX-BACKEND
npm run seed
```

You should see output like:
```
Connected to MongoDB
Cleared existing services
Successfully seeded 11 services

Seeded Services:
- Appliance Repair: $75
- Carpentry: $60
- Cleaning: $50
- Electrical: $80
- Gardening: $45
- Home Repair: $65
- Painting: $55
- Pest Control: $90
- Plumbing: $70
- Roofing: $100
- Window Cleaning: $40

✅ Services seeded successfully!
Disconnected from MongoDB
```

### 3. Start the Frontend Server
In another terminal:
```bash
cd FIX-FRONTEND
npm run dev
```

### 4. Access the Service Catalog
Navigate to: `http://localhost:5173/client/service-catalog`

## 🎯 What You'll See

### Service Catalog Features:
- ✅ **Alphabetical Order**: Services are automatically sorted A-Z
- ✅ **Service Images**: Each service displays its image (with fallback icons)
- ✅ **Service Names**: Clear, readable service names
- ✅ **Search Functionality**: Filter services by typing in the search bar
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Loading States**: Shows loading spinner while fetching data
- ✅ **Error Handling**: Displays error message if API fails

### Sample Services Included:
1. **Appliance Repair** - $75
2. **Carpentry** - $60
3. **Cleaning** - $50
4. **Electrical** - $80
5. **Gardening** - $45
6. **Home Repair** - $65
7. **Painting** - $55
8. **Pest Control** - $90
9. **Plumbing** - $70
10. **Roofing** - $100
11. **Window Cleaning** - $40

## 🔧 Technical Implementation

### Backend API:
- **Endpoint**: `GET /api/services`
- **Response**: JSON with services sorted alphabetically
- **Structure**: 
```json
{
  "success": true,
  "message": "Services retrieved successfully.",
  "data": [
    {
      "_id": "...",
      "name": "Appliance Repair",
      "description": "Professional repair services...",
      "baseFee": 75,
      "imageUrl": "https://...",
      "serviceId": "..."
    }
  ]
}
```

### Frontend Integration:
- **Hook**: `useServices()` from `@/hooks/use-api`
- **Component**: `ServiceCatalog.tsx`
- **Features**:
  - Automatic data fetching
  - Loading and error states
  - Search filtering
  - Responsive grid layout
  - Image fallback handling

## 🐛 Troubleshooting

### If services don't load:
1. **Check Backend**: Ensure backend is running on port 3001
2. **Check Database**: Run `npm run seed` to populate services
3. **Check Network**: Open browser dev tools and check Network tab
4. **Check Console**: Look for any error messages

### If images don't display:
- Images are loaded from Unsplash URLs
- Fallback icons will show if images fail to load
- Check internet connection for image loading

### If search doesn't work:
- Search is case-insensitive
- Searches through service names
- Try typing partial service names

## 📱 Mobile Responsiveness

The service catalog is fully responsive:
- **Desktop**: 3 columns grid
- **Tablet**: 2 columns grid  
- **Mobile**: 2 columns grid with smaller cards

## 🎨 Customization

### To add more services:
1. Edit `FIX-BACKEND/src/scripts/seedServices.ts`
2. Add new service objects to the `sampleServices` array
3. Run `npm run seed` again

### To change service icons:
1. Edit the `getServiceIcon()` function in `ServiceCatalog.tsx`
2. Add new icon mappings based on service names

### To modify the layout:
1. Edit the grid classes in `ServiceCatalog.tsx`
2. Adjust card styling as needed

## 🔗 Navigation Flow

1. **Client Dashboard** → **Service Catalog**
2. **Service Catalog** → **Service Details** (click on service)
3. **Service Details** → **Booking Process**

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Backend shows "Server is running at http://localhost:3001"
- ✅ Seed script shows "Services seeded successfully"
- ✅ Frontend loads without errors
- ✅ Service catalog displays 11 services in alphabetical order
- ✅ Search functionality works
- ✅ Clicking services navigates to service details

The service catalog is now fully functional and connected to your backend! 🎉 