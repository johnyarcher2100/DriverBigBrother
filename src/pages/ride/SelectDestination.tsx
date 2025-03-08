/// <reference types="vite/client" />
import React, { useState, useEffect, useCallback } from 'react';
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
  ChakraProvider,
  Image
} from '@chakra-ui/react';
import { 
  FiChevronLeft, 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiHome, 
  FiBriefcase, 
  FiMic
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FiAward, FiMonitor, FiPackage } from 'react-icons/fi';
import { RiHotelLine } from 'react-icons/ri';
import BottomNavBar from '@/components/common/BottomNavBar';
// 定義全局樣式
const kStyleGlobal = {
  colors: {
    premium: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      500: '#6D28D9',
      600: '#5B21B6',
      700: '#4C1D95',
      gradient: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)'
    },
    gold: '#D4AF37',
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
  const [startingLocation, setStartingLocation] = useState("正在獲取起始位置...");
  const [estimatedTime, setEstimatedTime] = useState("--");
  const [distance, setDistance] = useState("--");
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [userCoords, setUserCoords] = useState({ lat: 0, lng: 0 });
  const [destinationEntered, setDestinationEntered] = useState(false);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [mapImageUrl, setMapImageUrl] = useState("");
  
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
    { icon: "award", label: "VIP 接送", type: "premium" },
    { icon: "airplay", label: "松山機場", type: "premium" },
    { icon: "hotel", label: "五星酒店", type: "premium" },
    { icon: "briefcase", label: "商務中心", type: "premium" },
    { icon: "home", label: "家", type: "standard" },
    { icon: "building", label: "公司", type: "standard" }
  ];
  
  // 處理目的地變更
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
    if (e.target.value.length > 0) {
      setDestinationEntered(true);
    } else {
      setDestinationEntered(false);
      setRouteCalculated(false);
    }
  };
  
  // 計算路線
  const calculateRoute = useCallback(() => {
    if (!destination || userCoords.lat === 0 || userCoords.lng === 0) return;
    
    // 在實際應用中，應使用 Google Maps Directions API 獲取路線計算
    // 但為了示例，這裡模擬計算時間和距離
    // 根據目的地的長度隨機生成一個時間和距離
    const hash = destination.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomTime = (hash % 20) + 10; // 10-30分鐘
    const randomDistance = ((hash % 50) + 10) / 10; // 1.0-6.0公里
    
    setEstimatedTime(randomTime.toString());
    setDistance(randomDistance.toFixed(1));
    setRouteCalculated(true);
  }, [destination, userCoords]);
  
  // 處理快捷選項點擊
  const handleLocationSelect = (label: string) => {
    // 模擬預設位置
    const presetLocations = {
      "家": "台北市大安區復興南路一段36號",
      "公司": "台北市山北區明德路131號",
      "收藏": "台北市信義區市府路45號",
      "最近": "台北市南港區市場路凯施路口"
    };
    
    const selectedLocation = presetLocations[label as keyof typeof presetLocations] || "";
    setDestination(selectedLocation);
    if (selectedLocation) {
      setDestinationEntered(true);
      calculateRoute();
    }
  };
  
  // 獲取用戶當前位置
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 成功獲取位置
          const { latitude, longitude } = position.coords;
          // 設置座標以便路線計算
          setUserCoords({ lat: latitude, lng: longitude });
          
          // 設置起始位置
          const locationText = `台北市信義區 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setStartingLocation(locationText);
          
          // 設置地圖圖片URL - 使用 Google Maps Static API
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
          setMapImageUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=800x600&scale=2&maptype=hybrid&markers=color:red%7C${latitude},${longitude}&map_id=roadmap&key=${apiKey}`);
          
          setIsLoading(false);
        },
        (error) => {
          // 處理位置獲取錯誤
          console.error("獲取位置失敗:", error.message);
          setLocationError(`無法獲取您的位置: ${error.message}`);
          setStartingLocation("位置未知");
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("無法使用定位服務，請確認您的權限設定");
      setStartingLocation("位置未知");
      setIsLoading(false);
    }
  }, []);
  
  // 目的地輸入變更後計算路線
  useEffect(() => {
    if (destinationEntered && !isLoading && !locationError) {
      calculateRoute();
    }
  }, [destinationEntered, isLoading, locationError, calculateRoute]);
  
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
            尊榮接送服務
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
              完成
            </Text>
          </Button>
        </Flex>
        
        {/* 地圖與搜索區域 */}
        <Flex
          direction={"column"}
          flex={1}
          position={"relative"}
        >
          {/* 顯示用戶初始位置地圖 */}
          <Box
            width={"100%"}
            height={"300px"}
            overflow={"hidden"}
            bg={"gray.100"}
            position={"relative"}
            borderRadius={"xl"}
            boxShadow={"2xl"}
          >
            {!isLoading && !locationError && mapImageUrl ? (
              <Image 
                src={mapImageUrl} 
                alt="您的專屬接送地圖"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            ) : isLoading ? (
              <Flex 
                width="100%" 
                height="100%" 
                justifyContent="center" 
                alignItems="center"
              >
                <Text>正在為您準備專屬地圖...</Text>
              </Flex>
            ) : (
              <Flex 
                width="100%" 
                height="100%" 
                justifyContent="center" 
                alignItems="center"
                bg="gray.200"
              >
                <Text color="gray.500">暫時無法顯示地圖，請稍後再試</Text>
              </Flex>
            )}
          </Box>
          
          {/* 搜索與快速選項 */}
          <Flex
            mt={4}
            mx={4}
            direction={"column"}
            gap={4}
            bg={"white"}
            p={4}
            borderRadius={"lg"}
            shadow="xl" bgGradient={kStyleGlobal.colors.premium.gradient} _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }} transition="all 0.3s ease-in-out"
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
                placeholder={"請輸入您的目的地"}
                fontSize={"md"}
                sx={{
                  borderWidth: 2,
                  borderColor: "premium.100",
                  _placeholder: { color: "gray.400" },
                  _focus: {
                    borderColor: "premium.500",
                    boxShadow: "0 0 0 1px " + kStyleGlobal.colors.premium[500]
                  }
                }}
                pl={12}
                pr={12}
                h={"54px"}
                borderRadius={"full"}
                shadow={"lg"}
                value={destination}
                onChange={handleDestinationChange}
                onBlur={() => destination && calculateRoute()}
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
                  shadow="xl" bgGradient={kStyleGlobal.colors.premium.gradient} _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }} transition="all 0.3s ease-in-out"
                  leftIcon={
                    item.icon === "award" ? <FiAward size={18} color={kStyleGlobal.colors.gold} /> :
                    item.icon === "airplay" ? <FiMonitor size={18} /> :
                    item.icon === "hotel" ? <RiHotelLine size={18} /> :
                    item.icon === "briefcase" ? <FiPackage size={18} /> :
                    item.icon === "home" ? <FiHome size={18} /> :
                    <FiBriefcase size={18} />
                  }
                  borderRadius={"full"}
                  onClick={() => handleLocationSelect(item.label)}
                  sx={{
                    transition: "all 0.2s",
                    _hover: {
                      transform: item.type === "premium" ? "translateY(-2px)" : "translateY(-1px)",
                      shadow: item.type === "premium" ? "2xl" : "lg",
                      bg: item.type === "premium" ? "premium.50" : "white"
                    }
                  }}
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
              stiffness: 300,
              damping: 20,
              mass: 1
            }}
          >
            <Flex
              direction={"column"}
              gap={6}
            >
              {/* 起始位置 */}
              <Flex
                alignItems={"center"}
                gap={4}
              >
                <Box
                  p={3}
                  bgGradient={kStyleGlobal.colors.premium.gradient}
                  borderRadius={"full"}
                >
                  <FiMapPin
                    size={24}
                    color={kStyleGlobal.colors.premium[500]}
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
                    起始位置
                  </Text>
                  <Text
                    fontSize={kStyleGlobal.fontSizes.md}
                    fontWeight={kStyleGlobal.fontWeights.medium}
                  >
                    {locationError ? (
                      <Text color="red.500">{locationError}</Text>
                    ) : isLoading ? (
                      <Text color="gray.500">正在獲取起始位置...</Text>
                    ) : (
                      startingLocation
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
                  bg={"premium.50"}
borderWidth={1}
borderColor={"premium.100"}
                  p={4}
                  borderRadius={"xl"}
                >
                  <Flex
                    alignItems={"center"}
                    gap={3}
                  >
                    <FiClock
                      size={20}
                      color={kStyleGlobal.colors.premium[500]}
                    />
                    <Text
                      fontSize={kStyleGlobal.fontSizes.md}
                    >
                      預計接送時間: {estimatedTime} 分鐘
                    </Text>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    gap={3}
                  >
                    <FiClock
                      size={20}
                      color={kStyleGlobal.colors.premium[500]}
                    />
                    <Text
                      fontSize={kStyleGlobal.fontSizes.md}
                    >
                      預計行駛距離: {distance} 公里
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              
              {/* 確認按鈕 */}
              <Button
                size={"lg"}
                color={"white"}
                h={"56px"}
                fontSize={"md"}
                fontWeight={"semibold"}
                isDisabled={!destinationEntered || !routeCalculated}
                sx={{
                  bgGradient: destinationEntered && routeCalculated ? kStyleGlobal.colors.premium.gradient : "linear-gradient(135deg, #A0AEC0 0%, #718096 100%)",
                  _hover: {
                    transform: destinationEntered && routeCalculated ? 'translateY(-2px)' : 'none',
                    bg: destinationEntered && routeCalculated ? "primary.600" : "gray.400"
                  }
                }}
                onClick={() => goToNavigation("/select-car-type")}
              >
                確認尊榮接送
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
