import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingScreenContainer = styled.div`
  position: fixed;
  inset: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SpinnerContainer = styled.div`
  width: 4rem;
  height: 4rem;
  position: relative;
`;

export const SpinnerBorder = styled.div`
  position: absolute;
  inset: 0;
  border-width: 4px;
  border-style: solid;
  border-color: #e5e7eb;
  border-radius: 9999px;
`;

export const SpinnerActive = styled.div`
  position: absolute;
  inset: 0;
  border-width: 4px;
  border-style: solid;
  border-color: transparent;
  border-top-color: black;
  border-radius: 9999px;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.p`
  margin-top: 1rem;
  color: #4b5563;
  font-weight: 500;
`;
