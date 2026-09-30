/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMBEDDED_APP_URL: string;
  readonly VITE_TOKEN_QUERY_PARAM?: string;
}
