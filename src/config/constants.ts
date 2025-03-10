/**
 * 应用程序常量配置
 */

// API 配置
export const API_CONFIG = {
  // Supabase 配置
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  
  // Google OAuth 配置
  GOOGLE_OAUTH: {
    CLIENT_ID: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '',
  },

  // Google Maps API 配置
  GOOGLE_MAPS: {
    API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  }
};

// 路由路径
export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  CALLBACK: '/auth/callback',
  LOGIN_ERROR: '/auth/login-error',
};

// 本地存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  LANGUAGE: 'preferred_language',
};

// 支持的语言
export const SUPPORTED_LANGUAGES = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
];

// 错误消息
export const ERROR_MESSAGES = {
  LOGIN_FAILED: '登入失敗，請檢查您的電子郵件和密碼',
  REGISTRATION_FAILED: '註冊失敗，請稍後再試',
  NETWORK_ERROR: '網絡連接錯誤，請檢查您的網絡連接',
  UNKNOWN_ERROR: '發生未知錯誤，請稍後再試',
  SOCIAL_LOGIN_DISABLED: {
    FACEBOOK: 'Facebook 登入功能暫時關閉，正在升級中，敬請期待！',
    APPLE: 'Apple 登入功能暫時關閉，正在升級中，敬請期待！',
  },
  LINE_BROWSER_RESTRICTION: '由於 Google 安全政策限制，無法在 LINE 或其他應用內使用 Google 登入\n\n請使用外部瀏覽器開啟本網站來登入，或使用電子郵件方式註冊。',
};
