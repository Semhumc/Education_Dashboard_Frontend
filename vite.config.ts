import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    define: {
      'import.meta.env.VITE_KEYCLOAK_URL': JSON.stringify(env.VITE_KEYCLOAK_URL),
      'import.meta.env.VITE_KEYCLOAK_REALM': JSON.stringify(env.VITE_KEYCLOAK_REALM),
      'import.meta.env.VITE_KEYCLOAK_CLIENT_ID': JSON.stringify(env.VITE_KEYCLOAK_CLIENT_ID),
    },
  };
});