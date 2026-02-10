import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string, viteKey: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[viteKey] || import.meta.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('REACT_APP_SUPABASE_URL', 'VITE_SUPABASE_URL') || 'https://dezlfzqgaehfdgozcxqi.supabase.co';
const supabaseAnonKey = getEnv('REACT_APP_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemxmenFnYWVoZmRnb3pjeHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2Nzg0MDcsImV4cCI6MjA4NjI1NDQwN30.pALeNiZhJTdsVnZYzsuyQIzU2oz-8HWhQinbS-IbIv0';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Nerve OS: Supabase Credentials missing or invalid.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);