import { supabase } from './supabaseClient';

export async function saveBuild(userId: string, name: string, parts: any) {
  return supabase.from('builds').insert([{ user_id: userId, name, parts }]);
}

export async function loadBuilds(userId: string) {
  return supabase.from('builds').select('*').eq('user_id', userId).order('created_at', { ascending: false });
}

export async function loadBuild(buildId: string) {
  return supabase.from('builds').select('*').eq('id', buildId).single();
}
