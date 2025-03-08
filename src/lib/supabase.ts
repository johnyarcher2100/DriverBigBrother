import { createClient } from '@supabase/supabase-js';

// 使用環境變數或使用默認值（用於本地開發）
const supabaseUrl = 'https://ensssogtfnbmbyebwkhe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuc3Nzb2d0Zm5ibWJ5ZWJ3a2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzEwMzgsImV4cCI6MjA1Njc0NzAzOH0.wpD8ySgRMWuk3_unDs1UAVXLKt-GMVETvg3axsxQ8-Y';

// 初始化 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用於調試的日誌（僅在開發環境）
if (process.env.NODE_ENV === 'development') {
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
  // 获取当前域名作为重定向基础 URL
  const redirectBase = window.location.origin;
  
  // 根据不同的提供商配置不同的选项
  let options: any = {};
  
  if (provider === 'facebook') {
    console.log('Facebook 登录开始，重定向 URL 基础:', redirectBase);
    
    // 使用更详细的 Facebook 登录配置
    options = {
      redirectTo: `${redirectBase}/auth/callback`,
      scopes: 'email,public_profile',
      queryParams: {
        display: 'popup',  // 使用弹窗模式
        auth_type: 'rerequest',  // 强制重新请求权限
        response_type: 'code'  // 使用授权码流程
      }
    };
    
    // 记录完整的重定向 URL 以便调试
    console.log('Facebook 完整重定向 URL:', `${redirectBase}/auth/callback`);
  }
  
  // 使用 OAuth 登录
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: options
  });
  
  // 记录登录结果
  if (error) {
    console.error(`${provider} 登录错误:`, error);
  } else {
    console.log(`${provider} 登录成功:`, data);
  }
  
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
