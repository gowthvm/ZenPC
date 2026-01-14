import { supabase } from './supabaseClient';

export async function fetchParts(category: string) {
  return supabase.from('parts').select('*').eq('category', category).order('name');
}
