import { supabase } from './client';
import { ROUTES, ERROR_MESSAGES } from '@/config/constants';

/**
 * 使用电子邮件和密码注册
 * @param email 用户电子邮件
 * @param password 用户密码
 * @param metadata 用户元数据
 */
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

/**
 * 使用电子邮件和密码登录
 * @param email 用户电子邮件
 * @param password 用户密码
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

/**
 * 使用第三方提供商登录
 * @param provider 提供商名称
 */
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
      error: new Error(ERROR_MESSAGES.LINE_BROWSER_RESTRICTION) 
    };
  }
  
  // 获取当前域名作为重定向基础 URL
  const redirectBase = window.location.origin;
  
  // 根据不同的提供商配置不同的选项
  let options: any = {
    redirectTo: `${redirectBase}${ROUTES.CALLBACK}`,
  };
  
  // 为 Google 登录配置选项
  if (provider === 'google') {
    options.queryParams = {
      access_type: 'offline',  // 获取刷新令牌
      prompt: 'select_account'  // 始终显示账号选择器
    };
    console.log('Google 登录配置:', options);
  }
  // Facebook 登录配置
  else if (provider === 'facebook') {
    console.log('Facebook 登录开始，重定向 URL 基础:', redirectBase);
    
    // 使用更详细的 Facebook 登录配置
    options.scopes = 'email,public_profile';
    options.queryParams = {
      display: 'popup',  // 使用弹窗模式
      auth_type: 'rerequest',  // 强制重新请求权限
      response_type: 'code'  // 使用授权码流程
    };
    
    // 记录完整的重定向 URL 以便调试
    console.log('Facebook 完整重定向 URL:', `${redirectBase}${ROUTES.CALLBACK}`);
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

/**
 * 退出登录
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * 获取当前用户
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

/**
 * 获取当前会话
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};
