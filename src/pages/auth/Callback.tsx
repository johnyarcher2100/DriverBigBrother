import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/LoadingScreen';

/**
 * OAuth回调处理页面
 * 处理第三方登录（如Facebook、Google）后的回调
 * 自动处理会话并重定向到主页
 */
const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // 处理OAuth回调
    const handleOAuthCallback = async () => {
      try {
        // 获取URL中的哈希参数
        const hashParams = window.location.hash;
        console.log('OAuth回调参数:', hashParams);
        
        // 获取当前会话
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('获取会话错误:', error);
          setError('登录过程中发生错误，请重试');
          // 3秒后重定向到登录页
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        if (data.session) {
          console.log('成功获取会话:', data.session);
          // 登录成功，重定向到主页
          navigate('/home');
        } else {
          console.warn('未找到有效会话');
          // 未找到会话，重定向到登录页
          navigate('/login');
        }
      } catch (err) {
        console.error('处理OAuth回调时出错:', err);
        setError('登录过程中发生错误，请重试');
        // 3秒后重定向到登录页
        setTimeout(() => navigate('/login'), 3000);
      }
    };
    
    handleOAuthCallback();
  }, [navigate]);
  
  // 显示加载状态或错误信息
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p>{error}</p>
          <p className="text-sm mt-2">正在返回登录页面...</p>
        </div>
      ) : (
        <LoadingScreen message="正在完成登录，请稍候..." />
      )}
    </div>
  );
};

export default Callback;
