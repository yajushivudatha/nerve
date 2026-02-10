import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Safely expose specific env vars without clobbering the entire process.env object
      // This ensures libraries relying on process.env.NODE_ENV still work on Vercel
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(env.REACT_APP_SUPABASE_URL),
      'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(env.REACT_APP_SUPABASE_ANON_KEY),
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  }
})