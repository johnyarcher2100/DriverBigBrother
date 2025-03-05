import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';

const Home = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect will happen automatically due to auth state change
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">運將大哥</h1>
          <Button 
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm"
          >
            {isLoggingOut ? '登出中...' : '登出'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">歡迎回來！</h2>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">用戶資料</p>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-600">
                用戶名稱: {user?.user_metadata?.username || '未設置'}
              </p>
              <p className="text-sm text-gray-600">
                偏好語言: {user?.user_metadata?.preferred_language === 'zh' ? '中文' : 'English'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">帳戶資訊</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">帳戶 ID</p>
                  <p className="font-mono text-xs truncate">{user?.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">上次登入</p>
                  <p>{new Date(user?.last_sign_in_at || '').toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-center text-gray-500 text-sm">
              這是一個受保護的頁面，只有已登入的用戶才能訪問。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
