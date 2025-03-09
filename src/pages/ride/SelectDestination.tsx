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
  Image,
  Icon,
  VStack,
  useToast,
  HStack
} from '@chakra-ui/react';
import { 
  FiChevronLeft, 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiHome, 
  FiBriefcase, 
  FiMic,
  FiX,
  FiNavigation,
  FiStar,
  FiClock as FiClockRecent
} from 'react-icons/fi';
// import { motion } from 'framer-motion';
import BottomNavBar from '@/components/common/BottomNavBar';
import Maps from '@/components/Maps';

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
  const toast = useToast();
  const [destination, setDestination] = useState("");
  const [startingLocation, setStartingLocation] = useState("正在獲取起始位置...");
  const [estimatedTime, setEstimatedTime] = useState("--");
  const [distance, setDistance] = useState("--");
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [userCoords, setUserCoords] = useState({ lat: 0, lng: 0 });
  const [destinationEntered, setDestinationEntered] = useState(false);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [showRecentLocations, setShowRecentLocations] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  // These state variables will be used for swiper navigation in future implementation
  
  // 定義景點類型
  interface Attraction {
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    category: string;
    distance?: number;
    time?: string;
    price?: string;
    estimatedTimeInMinutes?: number;
  }

  // 台灣特色景點資料庫 - 包含各地景點及其坐標和類別
  const attractionsDatabase: Attraction[] = [
    {
      name: "陽明山國家公園",
      latitude: 25.1559,
      longitude: 121.5468,
      description: "擁有豐富的火山地形和溫泉資源，春季賞花、夏季避暑的絕佳去處。",
      category: "觀光景點"
    },
    {
      name: "九份老街",
      latitude: 25.1089,
      longitude: 121.8444,
      description: "充滿懷舊氛圍的山城，紅燈籠點綴的石板路，品嚐道地小吃。",
      category: "觀光景點"
    },
    {
      name: "象山步道",
      latitude: 25.0230,
      longitude: 121.5739,
      description: "台北市區最佳觀景點，輕鬆健行即可俯瞰101與台北盆地。",
      category: "休閒娛樂"
    },
    {
      name: "淡水漁人碼頭",
      latitude: 25.1825,
      longitude: 121.4490,
      description: "欣賞美麗夕陽與海景的浪漫地點，情侶約會首選。",
      category: "休閒娛樂"
    },
    {
      name: "南港展覽館",
      latitude: 25.0553,
      longitude: 121.6076,
      description: "亞洲頂級展覽場地，舉辦各類商業展覽與科技活動。",
      category: "商業區域"
    },
    {
      name: "信義商圈",
      latitude: 25.0344,
      longitude: 121.5638,
      description: "台北市金融與購物中心，雲集國際品牌與美食餐廳。",
      category: "商業區域"
    },
    {
      name: "台北101",
      latitude: 25.0338,
      longitude: 121.5646,
      description: "台灣地標性建築，擁有世界級觀景台與精品購物中心。",
      category: "附近熱門"
    },
    {
      name: "松山文創園區",
      latitude: 25.0436,
      longitude: 121.5602,
      description: "舊菸廠改建的文創空間，展覽、市集與文創商店齊聚。",
      category: "附近熱門"
    },
    {
      name: "台北小巨蛋",
      latitude: 25.0511,
      longitude: 121.5511,
      description: "舉辦演唱會與體育賽事的多功能場館，娛樂活動首選。",
      category: "休閒娛樂"
    },
    {
      name: "國立故宮博物院",
      latitude: 25.1022,
      longitude: 121.5486,
      description: "世界級博物館，收藏豐富中華文物與藝術珍品。",
      category: "觀光景點"
    },
    {
      name: "台北車站",
      latitude: 25.0479,
      longitude: 121.5170,
      description: "台灣交通樞紐，結合購物中心與美食街的便利場所。",
      category: "附近熱門"
    },
    {
      name: "內湖科技園區",
      latitude: 25.0797,
      longitude: 121.5760,
      description: "台灣軟體產業重鎮，眾多科技公司與新創企業基地。",
      category: "商業區域"
    },
    {
      name: "大安森林公園",
      latitude: 25.0296,
      longitude: 121.5363,
      description: "台北市最大綠地，提供都市人放鬆休憩的自然空間。",
      category: "休閒娛樂"
    },
    {
      name: "西門町",
      latitude: 25.0421,
      longitude: 121.5083,
      description: "年輕人潮流集散地，購物、美食與娛樂一應俱全。",
      category: "附近熱門"
    },
    {
      name: "台北市立動物園",
      latitude: 24.9986,
      longitude: 121.5807,
      description: "亞洲知名動物園，適合全家大小一同遊玩的場所。",
      category: "觀光景點"
    },
    {
      name: "南港軟體園區",
      latitude: 25.0600,
      longitude: 121.6153,
      description: "台灣軟體產業重鎮，眾多科技公司與新創企業基地。",
      category: "商業區域"
    }
  ];

  // 計算兩點之間的距離（使用 Haversine 公式）
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 地球半徑（公里）
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // 根據用戶位置獲取附近景點
  const getNearbyAttractionsByCategory = (userLat: number, userLng: number, maxDistance: number = 10) => {
    // 計算每個景點的距離
    const attractionsWithDistance = attractionsDatabase.map(attraction => {
      const distance = calculateDistance(
        userLat, 
        userLng, 
        attraction.latitude, 
        attraction.longitude
      );
      
      return {
        ...attraction,
        distance
      };
    });
    
    // 篩選出10公里範圍內的景點
    const nearbyAttractions = attractionsWithDistance
      .filter(attraction => attraction.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance); // 按距離排序
    
    // 按類別分組
    const categorizedAttractions = {
      "附近熱門": nearbyAttractions.filter(a => a.category === "附近熱門"),
      "商業區域": nearbyAttractions.filter(a => a.category === "商業區域"),
      "休閒娛樂": nearbyAttractions.filter(a => a.category === "休閒娛樂"),
      "觀光景點": nearbyAttractions.filter(a => a.category === "觀光景點")
    };
    
    // 如果某類別沒有足夠的景點，從其他類別補充
    Object.keys(categorizedAttractions).forEach(category => {
      if (categorizedAttractions[category].length === 0) {
        // 從所有附近景點中選擇最近的一個作為該類別的推薦
        if (nearbyAttractions.length > 0) {
          categorizedAttractions[category] = [nearbyAttractions[0]];
        } else {
          // 如果10公里內沒有景點，從全部景點中選擇該類別的最近景點
          const closestAttraction = attractionsWithDistance
            .filter(a => a.category === category)
            .sort((a, b) => a.distance - b.distance)[0];
          
          if (closestAttraction) {
            categorizedAttractions[category] = [closestAttraction];
          } else {
            // 如果該類別沒有景點，選擇任意一個最近的景點
            categorizedAttractions[category] = [attractionsWithDistance[0]];
          }
        }
      }
    });
    
    return categorizedAttractions;
  };

  // 目的地選項數據
  const [destinationData, setDestinationData] = useState([
    {
      "title": "附近熱門",
      "description": "探索您附近的熱門目的地",
      "image": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
      "buttonText": "選擇目的地",
      "suggestion": "",
      "address": ""
    },
    {
      "title": "商業區域",
      "description": "前往主要商業區和辦公地點",
      "image": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
      "buttonText": "選擇目的地",
      "suggestion": "",
      "address": ""
    },
    {
      "title": "休閒娛樂",
      "description": "前往購物中心、電影院和餐廳",
      "image": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      "buttonText": "選擇目的地",
      "suggestion": "",
      "address": ""
    },
    {
      "title": "觀光景點",
      "description": "探索城市的主要觀光景點",
      "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "buttonText": "選擇目的地",
      "suggestion": "",
      "address": ""
    }
  ]);

  
  // 處理返回功能
  const goBack = () => {
    navigate(-1);
  };
  
  // 導航到確認頁面
  const goToConfirmation = () => {
    if (!destination) {
      toast({
        title: "請選擇目的地",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    navigate('/ride/confirm', { 
      state: { 
        startingLocation, 
        destination, 
        estimatedTime, 
        distance 
      } 
    });
  };
  
  // 快速選擇位置列表
  const quickLocations = [
    { icon: FiHome, label: "家", address: "台北市大安區復興南路一段36號" },
    { icon: FiBriefcase, label: "公司", address: "台北市信義區松仁路100號" },
    { icon: FiStar, label: "收藏", address: "台北市信義區市府路45號" },
    { icon: FiClockRecent, label: "最近", address: "台北市南港區研究院路二段128號" }
  ];
  
  // 最近位置列表
  const recentLocations = [
    { name: "台北101", address: "台北市信義區信義路五段7號", time: "昨天" },
    { name: "松山機場", address: "台北市松山區敦化北路340號", time: "3天前" },
    { name: "台北車站", address: "台北市中正區北平西路3號", time: "上週" }
  ];
  
  // 處理目的地變更
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
    if (e.target.value.length > 0) {
      setDestinationEntered(true);
      setShowRecentLocations(false);
    } else {
      setDestinationEntered(false);
      setRouteCalculated(false);
      setShowRecentLocations(true);
    }
  };
  
  // 清除目的地
  const clearDestination = () => {
    setDestination("");
    setDestinationEntered(false);
    setRouteCalculated(false);
    setShowRecentLocations(true);
  };
  
  // 處理語音輸入
  const handleVoiceInput = () => {
    toast({
      title: "語音輸入功能",
      description: "此功能尚未實現，敬請期待",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };
  
  // 處理快速位置選擇
  const handleQuickLocationSelect = (address: string) => {
    setDestination(address);
    setDestinationEntered(true);
    setShowRecentLocations(false);
  };
  
  // 處理最近位置選擇
  const handleRecentLocationSelect = (address: string) => {
    setDestination(address);
    setDestinationEntered(true);
    setShowRecentLocations(false);
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
  
  // 獲取用戶位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          
          // 使用反向地理編碼獲取地址
          // 在實際應用中，應使用 Google Maps Geocoding API
          // 這裡為了示例，使用固定地址
          setStartingLocation("台北市信義區松智路17號");
          setIsLoading(false);
          
          // 獲取附近景點並更新目的地數據
          const nearbyAttractions = getNearbyAttractionsByCategory(latitude, longitude, 10);
          
          // 更新目的地數據，添加推薦景點
          setDestinationData(prev => [
            {
              ...prev[0],
              suggestion: nearbyAttractions["附近熱門"][0]?.name || "台北101",
              address: `${nearbyAttractions["附近熱門"][0]?.name || "台北101"} (${(nearbyAttractions["附近熱門"][0]?.distance || 0).toFixed(1)}公里)`,
              description: nearbyAttractions["附近熱門"][0]?.description || "探索您附近的熱門目的地"
            },
            {
              ...prev[1],
              suggestion: nearbyAttractions["商業區域"][0]?.name || "信義商圈",
              address: `${nearbyAttractions["商業區域"][0]?.name || "信義商圈"} (${(nearbyAttractions["商業區域"][0]?.distance || 0).toFixed(1)}公里)`,
              description: nearbyAttractions["商業區域"][0]?.description || "前往主要商業區和辦公地點"
            },
            {
              ...prev[2],
              suggestion: nearbyAttractions["休閒娛樂"][0]?.name || "大安森林公園",
              address: `${nearbyAttractions["休閒娛樂"][0]?.name || "大安森林公園"} (${(nearbyAttractions["休閒娛樂"][0]?.distance || 0).toFixed(1)}公里)`,
              description: nearbyAttractions["休閒娛樂"][0]?.description || "前往購物中心、電影院和餐廳"
            },
            {
              ...prev[3],
              suggestion: nearbyAttractions["觀光景點"][0]?.name || "國立故宮博物院",
              address: `${nearbyAttractions["觀光景點"][0]?.name || "國立故宮博物院"} (${(nearbyAttractions["觀光景點"][0]?.distance || 0).toFixed(1)}公里)`,
              description: nearbyAttractions["觀光景點"][0]?.description || "探索城市的主要觀光景點"
            }
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("無法獲取您的位置，請檢查位置權限設置");
          setStartingLocation("無法獲取位置");
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setLocationError("您的瀏覽器不支持地理位置功能");
      setStartingLocation("無法獲取位置");
      setIsLoading(false);
    }
  }, []);

  // 當目的地輸入後，自動計算路線
  useEffect(() => {
    if (destination && destinationEntered && userCoords.lat !== 0 && userCoords.lng !== 0) {
      calculateRoute();
    }
  }, [destination, destinationEntered, userCoords, calculateRoute]);

  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Box 
        position={"relative"}
        h={"100vh"}
        bg={kStyleGlobal.colors.background}
      >
        {/* 頂部導航欄 */}
        <Flex 
          as="header" 
          align="center" 
          justify="space-between" 
          p={4} 
          borderBottom="1px" 
          borderColor="gray.200"
          position="relative"
          zIndex={1}
        >
          <Button 
            variant="ghost" 
            leftIcon={<FiChevronLeft />} 
            onClick={goBack}
            p={2}
          >
            返回
          </Button>
          <Text fontWeight="bold" fontSize="lg">選擇目的地</Text>
          <Box w="40px"></Box> {/* 為了平衡布局 */}
        </Flex>
        
        {/* 主要內容 */}
        {destinationEntered ? (
          <Box p={4}>
            {/* 起始位置 */}
            <Flex 
              align="center" 
              mb={4} 
              p={3} 
              bg="gray.50" 
              borderRadius="md"
            >
              <Icon as={FiMapPin} color="green.500" boxSize={5} mr={3} />
              <Box flex="1">
                <Text fontSize="xs" color="gray.500">起點</Text>
                <Text fontWeight="medium">
                  {isLoading ? "正在獲取位置..." : startingLocation}
                </Text>
                {locationError && <Text color="red.500" fontSize="xs">{locationError}</Text>}
              </Box>
            </Flex>
            
            {/* 目的地輸入 */}
            <InputGroup size="lg" mb={4}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.500" />
              </InputLeftElement>
              <Input 
                placeholder="輸入目的地" 
                value={destination}
                onChange={handleDestinationChange}
                borderRadius="full"
                bg="gray.100"
                _focus={{ bg: "white", borderColor: "blue.400", boxShadow: "0 0 0 1px #63B3ED" }}
              />
              {destination && (
                <InputRightElement width="4.5rem">
                  <HStack spacing={2}>
                    <Icon 
                      as={FiMic} 
                      color="gray.500" 
                      cursor="pointer" 
                      onClick={handleVoiceInput}
                    />
                    <Icon 
                      as={FiX} 
                      color="gray.500" 
                      cursor="pointer" 
                      onClick={clearDestination}
                    />
                  </HStack>
                </InputRightElement>
              )}
            </InputGroup>
            
            {/* 快速選擇位置 */}
            <Flex justify="space-between" mb={6}>
              {quickLocations.map((location, index) => (
                <VStack 
                  key={index} 
                  spacing={1} 
                  cursor="pointer" 
                  onClick={() => handleQuickLocationSelect(location.address)}
                >
                  <Flex 
                    justify="center" 
                    align="center" 
                    w="50px" 
                    h="50px" 
                    bg="blue.50" 
                    color="blue.500" 
                    borderRadius="full"
                  >
                    <Icon as={location.icon} boxSize={5} />
                  </Flex>
                  <Text fontSize="xs" fontWeight="medium">{location.label}</Text>
                </VStack>
              ))}
            </Flex>
            
            <Divider mb={4} />
            
            {/* 顯示路線計算結果或最近位置 */}
            {routeCalculated ? (
              <Box>
                <Flex justify="space-between" mb={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">預計時間</Text>
                    <Flex align="center">
                      <Icon as={FiClock} color="blue.500" mr={1} />
                      <Text fontWeight="bold">{estimatedTime} 分鐘</Text>
                    </Flex>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">距離</Text>
                    <Flex align="center">
                      <Icon as={FiNavigation} color="blue.500" mr={1} />
                      <Text fontWeight="bold">{distance} 公里</Text>
                    </Flex>
                  </Box>
                  <Box>
                    <Button 
                      colorScheme="blue" 
                      size="sm" 
                      rightIcon={<FiChevronLeft transform="rotate(180deg)" />}
                      onClick={goToConfirmation}
                    >
                      確認
                    </Button>
                  </Box>
                </Flex>
                
                {/* 地圖顯示 */}
                <Box 
                  borderRadius="lg" 
                  overflow="hidden" 
                  h="200px" 
                  mb={4}
                  boxShadow="md"
                >
                  <Maps 
                    style={{ width: '100%', height: '100%' }} 
                    userCoords={userCoords} 
                  />
                </Box>
              </Box>
            ) : (
              showRecentLocations && (
                <Box>
                  <Text fontWeight="semibold" mb={3}>最近位置</Text>
                  <VStack spacing={3} align="stretch">
                    {recentLocations.map((location, index) => (
                      <Flex 
                        key={index} 
                        align="center" 
                        p={3} 
                        bg="gray.50" 
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleRecentLocationSelect(location.address)}
                        _hover={{ bg: "gray.100" }}
                      >
                        <Icon as={FiClockRecent} color="gray.500" boxSize={5} mr={3} />
                        <Box flex="1">
                          <Text fontWeight="medium">{location.name}</Text>
                          <Text fontSize="xs" color="gray.500">{location.address}</Text>
                        </Box>
                        <Text fontSize="xs" color="gray.400">{location.time}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )
            )}
          </Box>
        ) : (
          // 當未輸入目的地時，顯示滑動選擇界面
          <Box>
            {/* 跳過按鈕 */}
            <Flex
              position={"absolute"}
              top={6}
              right={6}
              zIndex={2}
            >
              <Button
                variant={"ghost"}
                onClick={() => {
                  navigate("/login");
                }}
                _hover={{
                  bg: "rgba(0,0,0,0.05)"
                }}
              >
                <Text
                  fontSize={"16px"}
                  fontWeight={"500"}
                  color={kStyleGlobal.colors.gray[600]}
                >
                  跳過
                </Text>
              </Button>
            </Flex>
            
            {/* 滑動選擇界面 */}
            <Box
              as="div"
              className="swiper-container"
              h="100%"
              position="relative"
            >
              <Box
                as="div"
                className="swiper-wrapper"
                h="100%"
              >
                {destinationData.map((item, index) => (
                  <Flex
                    key={index}
                    direction={"column"}
                    h={"100%"}
                    justify={"space-between"}
                    align={"center"}
                    px={6}
<<<<<<< HEAD
                    py={16}
=======
                    py={20}
>>>>>>> cfd06f7662c1d278f638890c33a217c70ed6b003
                    className={`swiper-slide ${currentIndex === index ? 'swiper-slide-active' : ''}`}
                  >
                    <Box
                      position={"relative"}
                      w={"100%"}
<<<<<<< HEAD
                      h={"40vh"}
=======
                      h={"45vh"}
>>>>>>> cfd06f7662c1d278f638890c33a217c70ed6b003
                      overflow={"hidden"}
                      borderRadius={"3xl"}
                      boxShadow={"xl"}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                      <Box
                        position={"absolute"}
                        bottom={0}
                        w={"100%"}
                        h={"100px"}
                        bgGradient={"linear(to-t, blackAlpha.600, transparent)"}
                      />
                    </Box>
                    <Flex
                      direction={"column"}
                      align={"center"}
                      mt={8}
                      mb={4}
                      gap={3}
                      w="100%"
                    >
                      <Text
                        fontSize={"28px"}
                        fontWeight={"700"}
                        textAlign={"center"}
                        bgGradient="linear(135deg, #000000 0%, #333333 100%)"
                        bgClip="text"
                      >
                        {item.title}
                      </Text>
                      <Text
                        fontSize={"16px"}
                        color={kStyleGlobal.colors.gray[600]}
                        textAlign={"center"}
                        maxW={"300px"}
                        lineHeight={"1.6"}
                      >
                        {item.description}
                      </Text>
                      
                      {/* 推薦景點卡片 */}
                      {item.suggestion && (
                        <Box
                          mt={2}
                          p={4}
                          bg="white"
                          borderRadius="xl"
                          boxShadow="md"
                          w="100%"
                          maxW="320px"
                        >
                          <Flex align="center" mb={2}>
                            <Icon as={FiMapPin} color="blue.500" mr={2} />
                            <Text fontWeight="bold" fontSize="lg">{item.suggestion}</Text>
                          </Flex>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            {item.address}
                          </Text>
                          <Text fontSize="sm" noOfLines={2}>
                            {item.description}
                          </Text>
                        </Box>
                      )}
                    </Flex>
                    <Button
                      size={"lg"}
                      w={"full"}
                      maxW={"320px"}
                      h={"56px"}
                      borderRadius={"full"}
                      bg={"black"}
                      color={"white"}
                      onClick={() => {
                        setDestinationEntered(true);
                        // 使用推薦景點作為目的地
                        if (item.suggestion) {
                          setDestination(item.suggestion);
                        } else {
                          // 備用目的地
                          const destinations = [
                            "台北市信義區松智路17號",
                            "台北市信義區松仁路100號",
                            "台北市信義區松壽路12號",
                            "台北市信義區信義路五段7號"
                          ];
                          setDestination(destinations[index]);
                        }
                      }}
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: "lg"
                      }}
                      transition={"all 0.2s"}
                      leftIcon={<FiNavigation />}
                    >
                      <Text
                        fontSize={"17px"}
                        fontWeight={"600"}
                      >
                        {item.buttonText}
                      </Text>
                    </Button>
                  </Flex>
                ))}
              </Box>
              
              {/* 導航點 */}
              <Flex
                position="absolute"
                bottom="10px"
                left="0"
                right="0"
                justify="center"
                zIndex={2}
              >
                {destinationData.map((_, index) => (
                  <Box
                    key={index}
                    w={currentIndex === index ? "20px" : "6px"}
                    h="6px"
                    borderRadius="3px"
                    bg={currentIndex === index ? kStyleGlobal.colors.primary[500] : "rgba(0,0,0,0.1)"}
                    mx="4px"
                    transition="all 0.3s"
                    onClick={() => setCurrentIndex(index)}
                    cursor="pointer"
                  />
                ))}
              </Flex>
            </Box>
          </Box>
        )}
        
        {/* 底部導航欄 */}
        <BottomNavBar />
      </Box>
    </ChakraProvider>
  );
};

export default SelectDestination;