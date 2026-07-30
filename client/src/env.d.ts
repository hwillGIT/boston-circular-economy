/// <reference types="vite/client" />

// Shim for TypeDoc compilation — Vite provides these at runtime
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
