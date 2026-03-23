import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://xasnznlnfswwmuwfxoar.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhc256bmxuZnN3d211d2Z4b2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTY5MzcsImV4cCI6MjA4OTY3MjkzN30.90tLeUgmG73Hu9FNw2eDXRhSjKf_ytfqv7OEv6re6iw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
