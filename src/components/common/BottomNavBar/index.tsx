import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Flex,
  IconButton,
  Icon
} from '@chakra-ui/react';
import { FiMapPin, FiSettings } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { MdRoute } from 'react-icons/md';

/**
 * 底部导航栏组件
 * 在所有主要页面中保持一致的导航体验
 */
const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 导航到指定路径
  const goToNavigation = (path: string) => {
    navigate(path);
  };
  
  // 检查当前路径是否激活
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Flex
      as="nav"
      bg="white"
      p={6}
      py={5}
      justifyContent="space-around"
      borderTop="1px"
      borderColor="gray.200"
      boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
      position="fixed"
      bottom={0}
      width="100%"
      zIndex={100}
    >
      <IconButton
        aria-label="首頁"
        icon={<Icon as={FiMapPin} boxSize={18} />}
        variant="ghost"
        h="60px"
        w="60px"
        isActive={isActive("/home")}
        onClick={() => goToNavigation("/home")}
        color={isActive("/home") ? "primary.500" : "gray.500"}
        _active={{
          color: "primary.500",
          bg: "transparent"
        }}
      />
      <IconButton
        aria-label="乘車"
        icon={<Icon as={FaCar} boxSize={18} />}
        variant="ghost"
        h="60px"
        w="60px"
        isActive={isActive("/ride-service")}
        onClick={() => goToNavigation("/ride-service")}
        color={isActive("/ride-service") ? "primary.500" : "gray.500"}
        _active={{
          color: "primary.500",
          bg: "transparent"
        }}
      />
      <IconButton
        aria-label="行程"
        icon={<Icon as={MdRoute} boxSize={18} />}
        variant="ghost"
        h="60px"
        w="60px"
        isActive={isActive("/trip-history")}
        onClick={() => goToNavigation("/trip-history")}
        color={isActive("/trip-history") ? "primary.500" : "gray.500"}
        _active={{
          color: "primary.500",
          bg: "transparent"
        }}
      />
      <IconButton
        aria-label="設定"
        icon={<Icon as={FiSettings} boxSize={18} />}
        variant="ghost"
        h="60px"
        w="60px"
        isActive={isActive("/settings")}
        onClick={() => goToNavigation("/settings")}
        color={isActive("/settings") ? "primary.500" : "gray.500"}
        _active={{
          color: "primary.500",
          bg: "transparent"
        }}
      />
    </Flex>
  );
};

export default BottomNavBar;
