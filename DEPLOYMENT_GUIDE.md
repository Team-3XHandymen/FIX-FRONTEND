# Frontend Deployment Guide

## Environment Variables Configuration

### For Netlify Deployment

You need to set the following environment variables in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following variables:

```
VITE_API_BASE_URL=https://fixfinder-backend-zrn7.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=production
```

### For Local Development

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=development
```

## Backend Environment Variables

### For Render Deployment

Set these environment variables in your Render dashboard:

```
CORS_ORIGIN=https://fixfinder-frontend.netlify.app
FRONTEND_URL=https://fixfinder-frontend.netlify.app
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend URL is included in the backend's CORS configuration
2. **Environment Variables**: Ensure all required environment variables are set in both frontend and backend
3. **API Base URL**: Verify that the API base URL points to your deployed backend

### Debug Steps

1. Check browser console for API configuration logs
2. Verify network requests in browser dev tools
3. Check backend logs for authentication and CORS issues
4. Test API endpoints directly using Postman or curl

## Testing API Endpoints

You can test your API endpoints using Postman:

```
GET https://fixfinder-backend-zrn7.onrender.com/api/bookings/my
Headers:
  X-User-ID: your_user_id
  X-User-Type: client
  Content-Type: application/json
```
