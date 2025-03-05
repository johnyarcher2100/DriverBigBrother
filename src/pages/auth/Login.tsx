import { useState } from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Lock,
  BrandGoogle,
  BrandFacebook,
  BrandApple,
  AlertCircle
} from 'tabler-icons-react';
import { 
  Button,
  Input,
  Divider,
  Link
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { signIn, signInWithSocial } = useAuth();
  
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form validation
  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  // Handle login
  const handleLogin = async () => {
    if (!isFormValid() || isSubmitting) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const { success, error } = await signIn(email, password);
      
      if (!success) {
        throw new Error(error || '登入失敗，請檢查您的電子郵件和密碼');
      }
      
      // Login successful - the auth state will automatically update and redirect
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || '登入過程中發生錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const { success, error } = await signInWithSocial(provider);
      
      if (!success) {
        throw new Error(error || `使用${provider}登入失敗，請稍後再試`);
      }
      
      // Social login successful - will redirect automatically
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setErrorMessage(error.message || '社交媒體登入失敗，請稍後再試');
      setIsSubmitting(false);
    }
  };

  // Handle navigation back
  const handleGoBack = () => {
    window.history.back();
  };

  // Handle register navigation
  const handleGoToRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center">
          <button 
            className="text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
            onClick={handleGoBack}
            disabled={isSubmitting}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">登入</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col px-6 py-8 gap-6 flex-grow">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}
        
        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Mail size={20} className="text-gray-400" />
            </div>
            <Input
              type="email"
              placeholder="電子郵件"
              className="h-[54px] pl-12 rounded-xl border-gray-200 bg-white focus:border-black focus:ring-0 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock size={20} className="text-gray-400" />
            </div>
            <Input
              type="password"
              placeholder="密碼"
              className="h-[54px] pl-12 rounded-xl border-gray-200 bg-white focus:border-black focus:ring-0 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link 
            href="/forgot-password"
            className="text-sm text-gray-600 hover:text-black"
            onClick={(e) => {
              e.preventDefault();
              // Handle forgot password (to be implemented)
              alert('忘記密碼功能即將推出');
            }}
          >
            忘記密碼？
          </Link>
        </div>

        {/* Login Button */}
        <Button 
          className={`h-[54px] w-full rounded-xl ${isFormValid() && !isSubmitting ? 'bg-black hover:bg-gray-800 active:bg-gray-900' : 'bg-gray-400'} text-white font-semibold`}
          onClick={handleLogin}
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? '處理中...' : '登入'}
        </Button>

        {/* Alternative Login Options */}
        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="flex items-center gap-4">
            <Divider className="w-[60px]" />
            <span className="text-sm text-gray-500">或使用以下方式登入</span>
            <Divider className="w-[60px]" />
          </div>

          <div className="flex gap-6">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full border-gray-200 hover:bg-gray-50 h-12 w-12"
              onClick={() => handleSocialLogin('google')}
              disabled={isSubmitting}
            >
              <BrandGoogle size={22} className="text-gray-700" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full border-gray-200 hover:bg-gray-50 h-12 w-12"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isSubmitting}
            >
              <BrandFacebook size={22} className="text-gray-700" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full border-gray-200 hover:bg-gray-50 h-12 w-12"
              onClick={() => handleSocialLogin('apple')}
              disabled={isSubmitting}
            >
              <BrandApple size={22} className="text-gray-700" />
            </Button>
          </div>

          {/* Register Link */}
          <div className="flex gap-1 mt-2">
            <span className="text-gray-600 text-sm">還沒有帳戶？</span>
            <Link 
              href="/register"
              className="text-black font-semibold text-sm"
              onClick={(e) => {
                e.preventDefault();
                if (!isSubmitting) handleGoToRegister();
              }}
            >
              註冊
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
