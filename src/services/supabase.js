import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_API_URL;
export const supabaseKey = import.meta.env.VITE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
