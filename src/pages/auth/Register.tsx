import { useState } from 'react';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Lock, 
  Phone,
  BrandGoogle,
  BrandFacebook,
  BrandApple,
  AlertCircle
} from 'tabler-icons-react';
import { 
  Button,
  Input,
  Checkbox,
  RadioGroup,
  Radio,
  Divider,
  Link
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const { signUp, signInWithSocial } = useAuth();
  
  // State management
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('zh');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form validation
  const isFormValid = () => {
    return (
      username.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      password === confirmPassword &&
      password.length >= 6 &&
      agreeToTerms
    );
  };

  // Handle registration
  const handleRegister = async () => {
    if (!isFormValid() || isSubmitting) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Prepare user metadata
      const metadata = {
        username,
        phone_number: phoneNumber || null,
        preferred_language: selectedLanguage,
      };
      
      // Register with Supabase
      const { success, error } = await signUp(email, password, metadata);
      
      if (!success) {
        throw new Error(error || '註冊失敗，請稍後再試');
      }
      
      // Registration successful - the auth state will automatically update and redirect
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || '註冊過程中發生錯誤，請稍後再試');
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

  // Handle login navigation
  const handleGoToLogin = () => {
    window.location.href = '/login';
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
          <h1 className="text-xl font-semibold text-gray-900">註冊</h1>
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
              <User size={20} className="text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="用戶名"
              className="h-[54px] pl-12 rounded-xl border-gray-200 bg-white focus:border-black focus:ring-0 w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock size={20} className="text-gray-400" />
            </div>
            <Input
              type="password"
              placeholder="確認密碼"
              className="h-[54px] pl-12 rounded-xl border-gray-200 bg-white focus:border-black focus:ring-0 w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Phone size={20} className="text-gray-400" />
            </div>
            <Input
              type="tel"
              placeholder="手機號碼（選填）"
              className="h-[54px] pl-12 rounded-xl border-gray-200 bg-white focus:border-black focus:ring-0 w-full"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-800">選擇語言</h2>
          <RadioGroup 
            value={selectedLanguage} 
            onValueChange={setSelectedLanguage}
            className="flex gap-6"
            disabled={isSubmitting}
          >
            <div className="flex items-center space-x-2">
              <Radio value="zh" id="zh" />
              <label htmlFor="zh" className="text-sm text-gray-700">中文</label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="en" id="en" />
              <label htmlFor="en" className="text-sm text-gray-700">English</label>
            </div>
          </RadioGroup>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeToTerms}
            onCheckedChange={() => setAgreeToTerms(!agreeToTerms)}
            disabled={isSubmitting}
          />
          <label 
            htmlFor="terms" 
            className="text-sm text-gray-600"
          >
            我已閱讀並同意使用條款和隱私政策
          </label>
        </div>

        {/* Register Button */}
        <Button 
          className={`h-[54px] w-full rounded-xl ${isFormValid() && !isSubmitting ? 'bg-black hover:bg-gray-800 active:bg-gray-900' : 'bg-gray-400'} text-white font-semibold`}
          onClick={handleRegister}
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? '處理中...' : '註冊'}
        </Button>

        {/* Alternative Registration Options */}
        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="flex items-center gap-4">
            <Divider className="w-[60px]" />
            <span className="text-sm text-gray-500">或使用以下方式註冊</span>
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

          {/* Login Link */}
          <div className="flex gap-1 mt-2">
            <span className="text-gray-600 text-sm">已有帳戶？</span>
            <Link 
              href="/login"
              className="text-black font-semibold text-sm"
              onClick={(e) => {
                e.preventDefault();
                if (!isSubmitting) handleGoToLogin();
              }}
            >
              登錄
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
