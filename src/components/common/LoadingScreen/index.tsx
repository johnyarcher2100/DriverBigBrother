import React from 'react';
import { LoadingScreenContainer, SpinnerContainer, SpinnerBorder, SpinnerActive, LoadingText } from './styles';

interface LoadingScreenProps {
  message?: string;
}

/**
 * 加载屏幕组件
 * 显示一个全屏加载指示器，带有可自定义的消息
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = '載入中...' }) => {
  return (
    <LoadingScreenContainer>
      <SpinnerContainer>
        <SpinnerBorder />
        <SpinnerActive />
      </SpinnerContainer>
      <LoadingText>{message}</LoadingText>
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;
