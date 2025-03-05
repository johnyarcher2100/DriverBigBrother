import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-black rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">載入中...</p>
    </div>
  );
};

export default LoadingScreen;
