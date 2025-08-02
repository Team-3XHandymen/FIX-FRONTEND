# Frontend-Backend Connection Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

#### Frontend Environment (.env)
Create a `.env` file in the `FIX-FRONTEND` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Environment
VITE_NODE_ENV=development

# Payment Configuration (Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PAYMENTS=true

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
VITE_SENTRY_DSN=your_sentry_dsn_here

# External Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

#### Backend Environment (.env)
Create a `.env` file in the `FIX-BACKEND` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/handyman-app

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Authentication (Clerk)
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# JWT Configuration (if using JWT as fallback)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloud Storage (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis Configuration (for caching and sessions)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
```

### 2. Install Dependencies

#### Frontend
```bash
cd FIX-FRONTEND
npm install
```

#### Backend
```bash
cd FIX-BACKEND
npm install
```

### 3. Start the Servers

#### Backend (Terminal 1)
```bash
cd FIX-BACKEND
npm run dev
```

#### Frontend (Terminal 2)
```bash
cd FIX-FRONTEND
npm run dev
```

## 🔧 Configuration Details

### API Integration

The frontend is now configured with:

1. **API Client** (`src/lib/api.ts`):
   - Axios instance with interceptors
   - Automatic token handling
   - Error handling and redirects
   - CORS configuration

2. **React Query Hooks** (`src/hooks/use-api.ts`):
   - Pre-built hooks for all API operations
   - Automatic caching and invalidation
   - Optimistic updates
   - Error handling

3. **Service Classes**:
   - `ServicesAPI` - Service management
   - `BookingsAPI` - Booking operations
   - `AuthAPI` - Authentication
   - `UsersAPI` - User management
   - `ReviewsAPI` - Review system
   - `NotificationsAPI` - Notifications

### CORS Configuration

The backend is configured to accept requests from:
- Development: `http://localhost:5173`
- Production: Update `CORS_ORIGIN` in backend `.env`

### Authentication Flow

1. **Clerk Integration**: Primary authentication
2. **JWT Fallback**: For API token management
3. **Token Storage**: LocalStorage for persistence
4. **Auto-refresh**: Automatic token refresh

## 📡 API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/client/:clientId` - Get client bookings
- `GET /api/bookings/provider/:providerId` - Get provider bookings
- `PATCH /api/bookings/:id/status` - Update booking status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar

### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🛠️ Usage Examples

### Using API Hooks in Components

```tsx
import { useServices, useCreateBooking } from '@/hooks/use-api';

const ServiceList = () => {
  const { data: services, isLoading, error } = useServices();
  const createBooking = useCreateBooking();

  const handleBooking = async (serviceId: string) => {
    try {
      await createBooking.mutateAsync({
        serviceId,
        clientId: 'user-id',
        scheduledTime: new Date(),
        description: 'Service request'
      });
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading services</div>;

  return (
    <div>
      {services?.map(service => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <button onClick={() => handleBooking(service.id)}>
            Book Service
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Direct API Calls

```tsx
import { ServicesAPI } from '@/lib/api';

const fetchServices = async () => {
  try {
    const services = await ServicesAPI.getAllServices();
    console.log('Services:', services);
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Configure properly for production
3. **Authentication**: Use Clerk for secure auth
4. **Input Validation**: Validate all inputs
5. **Rate Limiting**: Implement on backend
6. **HTTPS**: Use in production

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `CORS_ORIGIN` in backend `.env`
   - Ensure frontend URL matches

2. **Connection Refused**:
   - Verify backend is running on port 3001
   - Check if MongoDB is running

3. **Authentication Issues**:
   - Verify Clerk keys are correct
   - Check token storage

4. **API Timeout**:
   - Increase `VITE_API_TIMEOUT` if needed
   - Check network connectivity

### Debug Mode

Enable debug logging in backend:
```env
LOG_LEVEL=debug
```

## 📦 Production Deployment

1. **Environment Variables**: Set production values
2. **CORS**: Update to production domain
3. **Database**: Use production MongoDB
4. **SSL**: Enable HTTPS
5. **Monitoring**: Add error tracking
6. **Caching**: Implement Redis caching

## 🔄 Development Workflow

1. Start backend server
2. Start frontend development server
3. Make API changes in backend
4. Update frontend API calls if needed
5. Test integration
6. Commit changes

The frontend and backend are now fully connected and ready for development! 