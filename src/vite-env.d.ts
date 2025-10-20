/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_NODE_ENV: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_ENABLE_CHAT: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_PAYMENTS: string
  readonly VITE_API_PROXY_URL: string
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
