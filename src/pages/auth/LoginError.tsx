import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  AlertTriangle,
  InfoCircle,
  ArrowRight
} from 'tabler-icons-react';
import { 
  Button,
  Link
} from '@/components/ui';

// 定義錯誤類型
interface ErrorInfo {
  title: string;
  description: string;
  solution: string;
  technicalDetails?: string;
}

// 錯誤類型映射
const errorTypes: Record<string, ErrorInfo> = {
  'redirect_uri_mismatch': {
    title: 'OAuth 重定向錯誤',
    description: '登入過程中發生重定向 URI 不匹配的錯誤。',
    solution: '請稍後再試，或使用其他登入方式。',
    technicalDetails: 'OAuth 重定向 URI 不符合 Google 開發者控制台中的設定。若問題持續，請聯繫客服。'
  },
  'popup_closed': {
    title: '登入視窗被關閉',
    description: '您可能意外關閉了登入視窗，導致無法完成登入。',
    solution: '請再次嘗試登入，並確保不要關閉登入視窗。'
  },
  'popup_blocked': {
    title: '彈出視窗被阻止',
    description: '您的瀏覽器阻止了登入所需的彈出視窗。',
    solution: '請允許來自本網站的彈出視窗，然後再次嘗試登入。'
  },
  'invalid_credentials': {
    title: '帳號或密碼錯誤',
    description: '您輸入的帳號或密碼不正確。',
    solution: '請檢查您的帳號和密碼，然後再次嘗試登入。如果忘記密碼，可以使用"忘記密碼"功能。'
  },
  'account_locked': {
    title: '帳號已被鎖定',
    description: '由於多次登入失敗，您的帳號已被暫時鎖定。',
    solution: '請等待30分鐘後再次嘗試，或聯繫客服尋求幫助。'
  },
  'network_error': {
    title: '網絡連接問題',
    description: '登入過程中發生網絡連接問題。',
    solution: '請檢查您的網絡連接，然後再次嘗試登入。'
  },
  'server_error': {
    title: '伺服器錯誤',
    description: '登入過程中發生伺服器錯誤。',
    solution: '請稍後再試。如果問題持續存在，請聯繫客服。'
  },
  'default': {
    title: '登入失敗',
    description: '登入過程中發生未知錯誤。',
    solution: '請稍後再試，或使用其他登入方式。'
  }
};

const LoginError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTechnical, setShowTechnical] = useState(false);
  
  // 從 URL 參數中獲取錯誤類型
  const searchParams = new URLSearchParams(location.search);
  const errorType = searchParams.get('type') || 'default';
  const provider = searchParams.get('provider') || '';
  
  // 獲取錯誤信息
  const errorInfo = errorTypes[errorType] || errorTypes['default'];
  
  // 處理返回
  const handleGoBack = () => {
    navigate('/login');
  };
  
  // 處理重試
  const handleRetry = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center">
          <button 
            className="text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
            onClick={handleGoBack}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">登入問題</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col px-6 py-8 gap-6 flex-grow">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 p-6 rounded-full">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>
        
        {/* Error Title */}
        <h2 className="text-xl font-bold text-center text-gray-900">
          {errorInfo.title}
        </h2>
        
        {/* Error Description */}
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="text-gray-700 mb-4">
            {provider ? `使用 ${provider} 登入時發生問題：` : ''}
            {errorInfo.description}
          </p>
          
          <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
            <InfoCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              <span className="font-medium">建議解決方案：</span> {errorInfo.solution}
            </p>
          </div>
          
          {errorInfo.technicalDetails && (
            <div className="mt-4">
              <button 
                className="text-sm text-gray-600 underline focus:outline-none" 
                onClick={() => setShowTechnical(!showTechnical)}
              >
                {showTechnical ? '隱藏技術詳情' : '查看技術詳情'}
              </button>
              
              {showTechnical && (
                <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600">{errorInfo.technicalDetails}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            className="h-[54px] w-full rounded-xl bg-black hover:bg-gray-800 active:bg-gray-900 text-white font-semibold"
            onClick={handleRetry}
          >
            返回登入頁面
          </Button>
          
          <Link 
            href="/help"
            className="flex justify-center items-center text-sm text-gray-600 hover:text-black py-2"
          >
            需要幫助？聯繫客服 <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LoginError;
