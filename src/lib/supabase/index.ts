// 导出 Supabase 客户端
export { supabase } from './client';

// 导出认证相关函数
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithProvider,
  signOut,
  getCurrentUser,
  getSession
} from './auth';
