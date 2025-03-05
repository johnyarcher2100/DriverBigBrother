import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ensssogtfnbmbyebwkhe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuc3Nzb2d0Zm5ibWJ5ZWJ3a2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzEwMzgsImV4cCI6MjA1Njc0NzAzOH0.wpD8ySgRMWuk3_unDs1UAVXLKt-GMVETvg3axsxQ8-Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUpWithEmail = async (email: string, password: string, metadata: any = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signInWithProvider = async (provider: 'google' | 'facebook' | 'apple') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};
