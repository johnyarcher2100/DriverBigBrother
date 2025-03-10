import { createClient } from '@supabase/supabase-js';
import { API_CONFIG } from '@/config/constants';

/**
 * Supabase 客戶端初始化
 * 
 * 使用環境變數或配置文件中的默認值
 * 在生產環境中，應該使用環境變數來存儲這些值
 */

// 使用環境變數或使用默認值（用於本地開發）
const supabaseUrl = process.env.VITE_SUPABASE_URL || API_CONFIG.SUPABASE.URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || API_CONFIG.SUPABASE.ANON_KEY;

// 初始化 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用於調試的日誌（僅在開發環境）
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase 初始化完成，使用 URL:', supabaseUrl);
}
