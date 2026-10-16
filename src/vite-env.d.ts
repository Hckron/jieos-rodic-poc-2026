/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_GEMINI_BASE_URL: string
  // GEMINI_API_KEY is NOT exposed here. It is a server-side-only variable.
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}