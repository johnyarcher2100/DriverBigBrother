import { createClient } from '@supabase/supabase-js';

// 使用環境變數或使用默認值（用於本地開發）
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ensssogtfnbmbyebwkhe.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuc3Nzb2d0Zm5ibWJ5ZWJ3a2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzEwMzgsImV4cCI6MjA1Njc0NzAzOH0.wpD8ySgRMWuk3_unDs1UAVXLKt-GMVETvg3axsxQ8-Y';

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
  // 检测是否在 LINE 或其他应用内置浏览器中
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isInLineApp = userAgent.includes('line');
  const isInEmbeddedBrowser = userAgent.includes('wechat') || userAgent.includes('fb_iab') || 
                             userAgent.includes('instagram') || userAgent.includes('messenger');
  
  // 如果是 Google 登录且在内置浏览器中，抛出错误
  if (provider === 'google' && (isInLineApp || isInEmbeddedBrowser)) {
    console.warn('检测到在应用内置浏览器中尝试 Google 登录');
    return { 
      data: null, 
      error: new Error('由於 Google 安全政策限制，無法在 LINE 或其他應用內使用 Google 登入\n\n請使用外部瀏覽器開啟本網站來登入，或使用電子郵件方式註冊。') 
    };
  }
  
  // 获取当前域名作为重定向基础 URL
  const redirectBase = window.location.origin;
  
  // 根据不同的提供商配置不同的选项
  let options: any = {};
  
  // 为 Google 登录配置选项
  if (provider === 'google') {
    options = {
      redirectTo: `${redirectBase}/auth/callback`,
      queryParams: {
        access_type: 'offline',  // 获取刷新令牌
        prompt: 'select_account'  // 始终显示账号选择器
      }
    };
    console.log('Google 登录配置:', options);
  }
  // Facebook 登录配置
  else if (provider === 'facebook') {
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
