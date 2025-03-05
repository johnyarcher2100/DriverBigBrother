import { createClient } from '@supabase/supabase-js';

// 使用環境變數或使用默認值（用於本地開發）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ensssogtfnbmbyebwkhe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuc3Nzb2d0Zm5ibWJ5ZWJ3a2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzEwMzgsImV4cCI6MjA1Njc0NzAzOH0.wpD8ySgRMWuk3_unDs1UAVXLKt-GMVETvg3axsxQ8-Y';

// 初始化 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用於調試的日誌（僅在開發環境）
if (import.meta.env.DEV) {
  console.log('Supabase 初始化完成，使用 URL:', supabaseUrl);
}

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
