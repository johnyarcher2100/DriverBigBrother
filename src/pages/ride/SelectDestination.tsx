/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Divider,
  ChakraProvider
} from '@chakra-ui/react';
import { 
  FiChevronLeft, 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiStar, 
  FiHome, 
  FiBriefcase, 
  FiMic,
  FiClock as FiHistory
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import BottomNavBar from '@/components/common/BottomNavBar';
// 定義全局樣式
const kStyleGlobal = {
  colors: {
    primary: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
    background: '#F7FAFC',
    textColor: '#1A202C',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '36px',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * 選擇目的地頁面
 * 用戶可以輸入目的地地址或選擇預設位置
 */
const SelectDestination: React.FC = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [currentLocation, setCurrentLocation] = useState("正在獲取您的位置...");
  const [estimatedTime, setEstimatedTime] = useState("--");
  const [distance, setDistance] = useState("--");
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  
  // 處理返回功能
  const goBack = () => {
    navigate(-1);
  };
  
  // 處理導航到其他頁面
  const goToNavigation = (path: string) => {
    navigate(path);
  };
  
  // 預設位置清單
  const savedLocations = [
    { icon: "home", label: "家" },
    { icon: "building", label: "公司" },
    { icon: "star", label: "收藏" },
    { icon: "history", label: "最近" }
  ];
  
  // 處理目的地變更
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };
  
  // 獲取用戶當前位置
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 成功獲取位置
          const { latitude, longitude } = position.coords;
          // 這裡應該調用地理編碼API將經緯度轉換為地址
          // 為了示例，我們使用簡單字符串
          setCurrentLocation(`台北市信義區 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`); 
          
          // 模擬計算預估時間和距離
          // 在實際應用中，應使用地圖API計算
          setEstimatedTime("15");
          setDistance("3.2");
          setIsLoading(false);
        },
        (error) => {
          // 處理位置獲取錯誤
          console.error("獲取位置失敗:", error.message);
          setLocationError(`無法獲取您的位置: ${error.message}`);
          setCurrentLocation("位置未知");
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("您的瀏覽器不支持地理位置功能");
      setCurrentLocation("位置未知");
      setIsLoading(false);
    }
  }, []);
  
  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex
        direction={"column"}
        h={"100vh"}
        bg={kStyleGlobal.colors.background}
      >
        {/* 頂部導航欄 */}
        <Flex
          px={6}
          py={4}
          justifyContent={"space-between"}
          alignItems={"center"}
          bg={"white"}
          borderBottomWidth={1}
          borderColor={"gray.100"}
          position={"sticky"}
          top={0}
          zIndex={10}
        >
          <Button
            variant={"ghost"}
            onClick={goBack}
          >
            <FiChevronLeft
              size={24}
              color={kStyleGlobal.colors.textColor}
            />
          </Button>
          <Text
            fontSize={kStyleGlobal.fontSizes.lg}
            fontWeight={kStyleGlobal.fontWeights.semibold}
            color={kStyleGlobal.colors.textColor}
          >
            選擇目的地
          </Text>
          <Button
            variant={"ghost"}
            isDisabled={true}
            _disabled={{
              opacity: 0.4
            }}
          >
            <Text
              fontSize={kStyleGlobal.fontSizes.md}
            >
              確認
            </Text>
          </Button>
        </Flex>
        
        {/* 地圖與搜索區域 */}
        <Flex
          direction={"column"}
          flex={1}
          position={"relative"}
        >
          {/* 假設這裡是地圖組件 */}
          <Box
            width={"100%"}
            height={"100%"}
            bg={"gray.100"}
          />
          
          {/* 搜索與快速選項 */}
          <Flex
            position={"absolute"}
            top={4}
            left={4}
            right={4}
            direction={"column"}
            gap={4}
          >
            <InputGroup size={"lg"}>
              <InputLeftElement
                pointerEvents={"none"}
                pl={4}
              >
                <FiSearch
                  size={20}
                  color={"gray.400"}
                />
              </InputLeftElement>
              <Input
                bg={"white"}
                placeholder={"輸入目的地"}
                fontSize={"md"}
                pl={12}
                pr={12}
                h={"54px"}
                borderRadius={"full"}
                shadow={"lg"}
                value={destination}
                onChange={handleDestinationChange}
                _placeholder={{
                  color: "gray.400"
                }}
                _focus={{
                  borderColor: "primary.500"
                }}
              />
              <InputRightElement pr={4}>
                <FiMic
                  size={20}
                  color={"gray.400"}
                />
              </InputRightElement>
            </InputGroup>
            
            {/* 快速選項按鈕 */}
            <Flex
              overflowX={"auto"}
              gap={3}
              pb={2}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              }}
            >
              {savedLocations.map((item, index) => (
                <Button
                  key={index}
                  bg={"white"}
                  px={6}
                  py={3}
                  shadow={"md"}
                  leftIcon={
                    item.icon === "home" ? <FiHome size={18} /> :
                    item.icon === "building" ? <FiBriefcase size={18} /> :
                    item.icon === "star" ? <FiStar size={18} /> :
                    <FiHistory size={18} />
                  }
                  borderRadius={"full"}
                  _hover={{
                    transform: "translateY(-1px)",
                    shadow: "lg"
                  }}
                  transition={"all 0.2s"}
                >
                  {item.label}
                </Button>
              ))}
            </Flex>
          </Flex>
          
          {/* 底部滑入面板 */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "white",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              padding: "24px",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.1)"
            }}
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              damping: 25
            }}
          >
            <Flex
              direction={"column"}
              gap={6}
            >
              {/* 目前位置 */}
              <Flex
                alignItems={"center"}
                gap={4}
              >
                <Box
                  p={3}
                  bg={"primary.50"}
                  borderRadius={"full"}
                >
                  <FiMapPin
                    size={24}
                    color={kStyleGlobal.colors.primary[500]}
                  />
                </Box>
                <Flex
                  direction={"column"}
                  flex={1}
                  gap={1}
                >
                  <Text
                    fontSize={kStyleGlobal.fontSizes.sm}
                    color={kStyleGlobal.colors.gray[500]}
                  >
                    目前位置
                  </Text>
                  <Text
                    fontSize={kStyleGlobal.fontSizes.md}
                    fontWeight={kStyleGlobal.fontWeights.medium}
                  >
                    {locationError ? (
                      <Text color="red.500">{locationError}</Text>
                    ) : isLoading ? (
                      <Text color="gray.500">正在獲取您的位置...</Text>
                    ) : (
                      currentLocation
                    )}
                  </Text>
                </Flex>
              </Flex>
              
              <Divider />
              
              {/* 預估資訊 */}
              <Flex
                direction={"column"}
                gap={4}
              >
                <Text
                  fontSize={kStyleGlobal.fontSizes.lg}
                  fontWeight={kStyleGlobal.fontWeights.semibold}
                >
                  預估資訊
                </Text>
                <Flex
                  justifyContent={"space-between"}
                  bg={"gray.50"}
                  p={4}
                  borderRadius={"xl"}
                >
                  <Flex
                    alignItems={"center"}
                    gap={3}
                  >
                    <FiClock
                      size={20}
                      color={kStyleGlobal.colors.primary[500]}
                    />
                    <Text
                      fontSize={kStyleGlobal.fontSizes.md}
                    >
                      預估時間: {estimatedTime} 分鐘
                    </Text>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    gap={3}
                  >
                    <FiClock
                      size={20}
                      color={kStyleGlobal.colors.primary[500]}
                    />
                    <Text
                      fontSize={kStyleGlobal.fontSizes.md}
                    >
                      距離: {distance} 公里
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              
              {/* 確認按鈕 */}
              <Button
                size={"lg"}
                bg={"primary.500"}
                color={"white"}
                h={"56px"}
                fontSize={"md"}
                fontWeight={"semibold"}
                _hover={{
                  bg: "primary.600"
                }}
                onClick={() => goToNavigation("/select-car-type")}
              >
                確認目的地
              </Button>
            </Flex>
          </motion.div>
        </Flex>
        
        {/* 底部導航欄 */}
        <BottomNavBar />
      </Flex>
    </ChakraProvider>
  );
};

export default SelectDestination;
