# FIX-FRONTEND

This is the frontend for the FIX platform, a handyman service application. It is built with React, TypeScript, and Vite, and communicates with the backend via RESTful APIs.

## Features
- Client and Handyman authentication
- Service browsing and booking
- Profile management
- Reviews and notifications
- Responsive UI with Tailwind CSS

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd FIX-FRONTEND
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables (adjust as needed):
     ```env
     VITE_API_BASE_URL=http://localhost:3001/api
     VITE_API_TIMEOUT=10000
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173` by default.

## Project Structure
```
FIX-FRONTEND/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # API and utility functions
│   ├── pages/           # Page components (routing)
│   ├── assets/          # Images, gifs, and static assets
│   └── ...
├── public/              # Static files
├── package.json         # Project metadata and scripts
├── tailwind.config.ts   # Tailwind CSS configuration
└── ...
```

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code

## API Configuration
- The frontend expects the backend API to be running and accessible at the URL specified in `VITE_API_BASE_URL`.
- Update this variable in your `.env` file if your backend runs on a different host or port.

## Notes
- This project uses Axios for API requests and Tailwind CSS for styling.
- Authentication tokens and user info are stored in `localStorage`.
- For any changes in backend API routes or data structure, update the API service classes in `src/lib/api.ts` accordingly.

## Troubleshooting
- See `TROUBLESHOOTING.md` for common issues and solutions.

## License
MIT
