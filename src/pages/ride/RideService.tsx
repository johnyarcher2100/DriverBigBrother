/// <reference types="vite/client" />
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Radio,
  Select,
  useTheme,
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
  FiSliders,
  FiArrowRight
} from 'react-icons/fi';
import BottomNavBar from '@/components/common/BottomNavBar';

/**
 * 乘车服务页面
 * 当按下左上角乘车服务或者下方导航栏的车标图示时，进入此页面
 */
const RideService: React.FC = () => {
  // 状态管理
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("正在獲取位置...");
  // 存儲用戶坐標，雖然目前未直接使用但保留供未來功能擴展
  const [_coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  // 定義景點類型
  interface Attraction {
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    distance?: number;
    time?: string;
    price?: string;
    estimatedTimeInMinutes?: number;
  }
  
  const [nearbyAttractions, setNearbyAttractions] = useState<Attraction[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Google Maps API Key
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD0LlTAW3UbiCbRM8mE3dL9yHTDrEwAXOE";
  
  // 獲取用戶當前位置
  const getUserLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          
          // 使用 Google Maps Geocoding API 獲取地址
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&language=zh-TW`
            );
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              // 從返回結果中提取地址組件
              const addressComponents = data.results[0].address_components;
              let district = '';
              let city = '';
              
              for (const component of addressComponents) {
                if (component.types.includes('administrative_area_level_3') || 
                    component.types.includes('sublocality_level_1')) {
                  district = component.long_name;
                }
                
                if (component.types.includes('administrative_area_level_1') || 
                    component.types.includes('locality')) {
                  city = component.long_name;
                }
              }
              
              const formattedLocation = district ? `${city}${district}` : city;
              setCurrentLocation(formattedLocation || "未知位置");
            } else {
              setCurrentLocation("未知位置");
            }
            
            setIsLoadingLocation(false);
            
            // 獲取附近景點
            getNearbyAttractions(latitude, longitude);
            
          } catch (error) {
            console.error('Geocoding error:', error);
            setCurrentLocation("未知位置");
            setIsLoadingLocation(false);
          }
        }, (error) => {
          console.error('Geolocation error:', error);
          setCurrentLocation("未知位置");
          setIsLoadingLocation(false);
        });
      } catch (error) {
        console.error('Geolocation error:', error);
        setCurrentLocation("未知位置");
        setIsLoadingLocation(false);
      }
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCurrentLocation("未知位置");
      setIsLoadingLocation(false);
    }
  }, [GOOGLE_MAPS_API_KEY]);
  
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
  
  // 估算行車時間（假設平均速度為 40 公里/小時）
  const estimateDrivingTime = (distanceInKm: number): number => {
    const averageSpeedKmPerHour = 40;
    return (distanceInKm / averageSpeedKmPerHour) * 60; // 返回分鐘數
  };
  
  // 獲取附近景點（30-60分鐘車程內）
  const getNearbyAttractions = (latitude: number, longitude: number): void => {
    // 計算每個景點的距離和預估時間
    const attractionsWithDistance = attractionsDatabase.map(attraction => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        attraction.latitude, 
        attraction.longitude
      );
      
      const estimatedTimeInMinutes = estimateDrivingTime(distance);
      
      // 根據距離估算價格範圍（基本費率 + 距離費率）
      const baseFare = 100; // 基本車資
      const ratePerKm = 10;  // 每公里費率
      const lowPrice = Math.round((baseFare + distance * ratePerKm) / 10) * 10; // 四捨五入到最接近的10
      const highPrice = Math.round((lowPrice * 1.2) / 10) * 10; // 高估價格（低估價格的1.2倍）
      
      // 隨機增減時間（±5分鐘）以提供範圍
      const timeLow = Math.round(Math.max(5, estimatedTimeInMinutes - 5));
      const timeHigh = Math.round(estimatedTimeInMinutes + 5);
      
      return {
        ...attraction,
        distance,
        time: `${timeLow}-${timeHigh}分鐘`,
        price: `NT$${lowPrice}-${highPrice}`,
        estimatedTimeInMinutes
      };
    });
    
    // 篩選出30-60分鐘車程內的景點
    const nearbyAttractions = attractionsWithDistance
      .filter(attraction => 
        attraction.estimatedTimeInMinutes >= 15 && 
        attraction.estimatedTimeInMinutes <= 60
      )
      .sort((a, b) => a.estimatedTimeInMinutes - b.estimatedTimeInMinutes); // 按時間排序
    
    // 如果沒有符合條件的景點，顯示最近的3個景點
    const attractionsToShow = nearbyAttractions.length > 0 
      ? nearbyAttractions.slice(0, 3) 
      : attractionsWithDistance
          .sort((a, b) => a.estimatedTimeInMinutes - b.estimatedTimeInMinutes)
          .slice(0, 3);
    
    setNearbyAttractions(attractionsToShow);
  };
  
  // 在組件載入時獲取用戶位置
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // 切换筛选器状态
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // 导航到其他页面
  const goToNavigation = (path: string) => {
    navigate(path);
  };

  // 自定義主題
  const kStyleGlobal = {
    colors: {
      primary: {
        500: '#2C5282', // 深蓝色
        600: '#1A365D'  // 更深的蓝色，用于悬停效果
      },
      gray: {
        50: '#F7FAFC',
        100: '#EDF2F7',
        200: '#E2E8F0',
        300: '#CBD5E0',
        400: '#A0AEC0',
        500: '#718096',
        600: '#4A5568'
      }
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  };

  // 台灣特色景點資料庫 - 包含各地景點及其坐標
  const attractionsDatabase: Attraction[] = [
    {
      name: "陽明山國家公園",
      latitude: 25.1559,
      longitude: 121.5468,
      description: "擁有豐富的火山地形和溫泉資源，春季賞花、夏季避暑的絕佳去處，遠離城市喧囂。"
    },
    {
      name: "九份老街",
      latitude: 25.1089,
      longitude: 121.8444,
      description: "充滿懷舊氛圍的山城，紅燈籠點綴的石板路，品嚐道地小吃，欣賞絕美海景。"
    },
    {
      name: "象山步道",
      latitude: 25.0230,
      longitude: 121.5739,
      description: "台北市區最佳觀景點，輕鬆健行即可俯瞰101與台北盆地，夜景尤其壯觀。"
    },
    {
      name: "淡水漢生態公園",
      latitude: 25.1825,
      longitude: 121.4490,
      description: "翠綠海岸旅遊動線起點，結合經典金色海岸與珍象漂亮海蟲，提供優質經典駁野海岸。"
    },
    {
      name: "南港展覽館",
      latitude: 25.0553,
      longitude: 121.6076,
      description: "亞洲最大展覽場地，商家財富聚集地，亞洲時尚科技覽覽覽架亂說無一不漂亮。"
    },
    {
      name: "南寧夢幻水域公園",
      latitude: 25.0344,
      longitude: 121.5638,
      description: "台北市區中心綠洞天地，廚房山至今與市區水庫結合，成為市民最愛運動健康步道。"
    },
    {
      name: "利濤街道",
      latitude: 25.0421,
      longitude: 121.5333,
      description: "台灣威士忌藍調酒吧與好酒帖天下，單一地檯，夜時香與色之美盪目浮華。"
    },
    {
      name: "淸河溼地公園",
      latitude: 25.0716,
      longitude: 121.4658,
      description: "陶慶溼地生態保育區，小鳥與老虫犯罪紀北台北中異離酘地方等你迅，紅樹林生態完整設計。"
    }
  ];
  
  // 推薦景點路線 - 將根據用戶位置動態生成

  return (
    <ChakraProvider theme={theme}>
      <Flex
        direction={"column"}
        h={"100vh"}
        bg={"gray.50"}
      >
        {/* 顶部导航栏 */}
        <Flex
          p={4}
          bg={"white"}
          alignItems={"center"}
          justify={"space-between"}
          borderBottomWidth={1}
          borderColor={"gray.100"}
          position={"sticky"}
          top={0}
          zIndex={10}
        >
          <IconButton
            variant={"ghost"}
            icon={<FiChevronLeft size={24} />}
            aria-label={"返回"}
            onClick={() => {
              goToNavigation("/");
            }}
          />
          <Text
            fontSize={kStyleGlobal.fontSizes.xl}
            fontWeight={kStyleGlobal.fontWeights.bold}
          >
            乘車服務
          </Text>
          <IconButton
            variant={"ghost"}
            icon={<FiSliders size={24} />}
            aria-label={"筛选"}
            onClick={toggleFilter}
          />
        </Flex>

        {/* 搜索框 - 移到頂部導航欄下方 */}
        <Box px={4} py={3} bg="white" borderBottomWidth={1} borderColor="gray.100">
          <InputGroup>
            <InputLeftElement
              pointerEvents={"none"}
              pl={4}
            >
              <FiSearch
                size={20}
                color={kStyleGlobal.colors.gray[400]}
              />
            </InputLeftElement>
            <Input
              pl={12}
              placeholder={"您要去哪裡？"}
              bg={"white"}
              h={"54px"}
              fontSize={"md"}
              borderRadius={"xl"}
              boxShadow={"md"}
              _focus={{
                borderColor: "primary.500"
              }}
              onClick={() => {
                goToNavigation("/select-destination");
              }}
            />
          </InputGroup>
        </Box>

        {/* 主要内容区域 */}
        <Box flex={1} pb={"140px"}>
          {/* 顶部图片区域 */}
          <Box
            h={"250px"}
            position={"relative"}
          >
            <Image
              src={"https://images.unsplash.com/photo-1494976388531-d1058494cdd8"}
              alt={"乘车服务"}
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
            />
            <Box
              position={"absolute"}
              bottom={0}
              w={"100%"}
              h={"100px"}
              bgGradient={"linear(to-t, blackAlpha.600, transparent)"}
            />
          </Box>

          {/* 内容区域 */}
          <Flex
            direction={"column"}
            px={4}
            py={6}
            gap={6}
            position={"relative"}
            zIndex={1}
          >

            {/* 快捷按钮 */}
            <Flex
              overflowX={"auto"}
              css={{
                scrollbarWidth: "none",
                "-ms-overflow-style": "none",
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              }}
            >
              <Flex gap={4}>
                <Button
                  leftIcon={<FiBriefcase />}
                  bg={"white"}
                  size={"lg"}
                  boxShadow={"md"}
                  borderRadius={"xl"}
                  px={6}
                  _hover={{
                    transform: "translateY(-2px)"
                  }}
                  transition={"all 0.2s"}
                  onClick={() => {
                    goToNavigation("/select-destination");
                  }}
                >
                  上下班
                </Button>
                <Button
                  leftIcon={<FiHome />}
                  bg={"white"}
                  size={"lg"}
                  boxShadow={"md"}
                  borderRadius={"xl"}
                  px={6}
                  _hover={{
                    transform: "translateY(-2px)"
                  }}
                  transition={"all 0.2s"}
                  onClick={() => {
                    goToNavigation("/select-destination");
                  }}
                >
                  回家
                </Button>
                <Button
                  leftIcon={<FiStar />}
                  bg={"white"}
                  size={"lg"}
                  boxShadow={"md"}
                  borderRadius={"xl"}
                  px={6}
                  _hover={{
                    transform: "translateY(-2px)"
                  }}
                  transition={"all 0.2s"}
                  onClick={() => {
                    goToNavigation("/select-destination");
                  }}
                >
                  收藏
                </Button>
              </Flex>
            </Flex>

            {/* 推荐路线 */}
            <Box>
              <Flex
                justify={"space-between"}
                align={"center"}
                mb={4}
              >
                <Text
                  fontSize={kStyleGlobal.fontSizes.lg}
                  fontWeight={kStyleGlobal.fontWeights.bold}
                >
                  推薦景點 {isLoadingLocation ? "(正在獲取位置...)" : `(依您在${currentLocation}的位置推薦)`}
                </Text>
                <Text
                  fontSize={kStyleGlobal.fontSizes.sm}
                  color={kStyleGlobal.colors.primary[500]}
                  cursor={"pointer"}
                >
                  查看全部
                </Text>
              </Flex>
              <Stack spacing={3}>
                {nearbyAttractions.map((route, index) => (
                  <Box
                    key={index}
                    bg={"white"}
                    p={4}
                    borderRadius={"xl"}
                    boxShadow={"sm"}
                    onClick={() => {
                      goToNavigation("/select-car-type");
                    }}
                    _hover={{
                      transform: "translateY(-2px)"
                    }}
                    transition={"all 0.2s"}
                    cursor={"pointer"}
                  >
                    <Flex
                      direction={"column"}
                      gap={3}
                    >
                      <Flex
                        align={"center"}
                        gap={2}
                      >
                        <FiMapPin
                          size={20}
                          color={kStyleGlobal.colors.primary[500]}
                        />
                        <Text
                          fontWeight={kStyleGlobal.fontWeights.medium}
                        >
                          {currentLocation}
                        </Text>
                        <FiArrowRight
                          size={16}
                          color={kStyleGlobal.colors.gray[400]}
                        />
                        <Text
                          fontWeight={kStyleGlobal.fontWeights.medium}
                        >
                          {route.name}
                        </Text>
                      </Flex>
                      
                      {/* 添加景點描述 */}
                      <Text
                        fontSize={kStyleGlobal.fontSizes.sm}
                        color={kStyleGlobal.colors.gray[600]}
                        noOfLines={2}
                      >
                        {route.description}
                      </Text>
                      
                      <Flex
                        justify={"space-between"}
                        align={"center"}
                      >
                        <Flex
                          align={"center"}
                          gap={2}
                        >
                          <FiClock
                            size={16}
                            color={kStyleGlobal.colors.gray[400]}
                          />
                          <Text
                            fontSize={kStyleGlobal.fontSizes.sm}
                            color={kStyleGlobal.colors.gray[600]}
                          >
                            {route.time}
                          </Text>
                        </Flex>
                        <Text
                          fontWeight={kStyleGlobal.fontWeights.bold}
                          color={kStyleGlobal.colors.primary[500]}
                        >
                          {route.price}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Flex>
        </Box>

        {/* 底部按钮区域 */}
        <Flex
          position={"fixed"}
          bottom={"80px"} // 调整位置，为底部导航栏留出空间
          width={"100%"}
          p={4}
          gap={4}
          bg={"white"}
          borderTopWidth={1}
          borderColor={"gray.100"}
          boxShadow={"lg"}
          zIndex={99} // 确保在底部导航栏上方
        >
          <Button
            flex={1}
            size={"lg"}
            bg={kStyleGlobal.colors.primary[500]}
            color={"white"}
            h={"54px"}
            fontSize={"md"}
            borderRadius={"xl"}
            _hover={{
              bg: kStyleGlobal.colors.primary[600]
            }}
            onClick={() => {
              goToNavigation("/select-car-type");
            }}
          >
            立即用車
          </Button>
          <Button
            flex={1}
            size={"lg"}
            variant={"outline"}
            borderColor={kStyleGlobal.colors.primary[500]}
            color={kStyleGlobal.colors.primary[500]}
            h={"54px"}
            fontSize={"md"}
            borderRadius={"xl"}
            _hover={{
              bg: "primary.50"
            }}
            onClick={() => {
              goToNavigation("/select-car-type");
            }}
          >
            預約用車
          </Button>
        </Flex>
        
        {/* 底部导航栏 */}
        <BottomNavBar />

        {/* 筛选条件弹窗 */}
        <Modal
          isOpen={isFilterOpen}
          onClose={toggleFilter}
        >
          <ModalOverlay />
          <ModalContent
            borderRadius={"2xl"}
            p={0}
          >
            <ModalHeader
              p={4}
              borderBottomWidth={1}
              borderColor={"gray.100"}
            >
              <Text
                fontSize={kStyleGlobal.fontSizes.xl}
                fontWeight={kStyleGlobal.fontWeights.bold}
              >
                篩選條件
              </Text>
            </ModalHeader>
            <ModalBody p={4}>
              <Stack spacing={6}>
                <Flex
                  direction={"column"}
                  gap={3}
                >
                  <Text
                    fontSize={kStyleGlobal.fontSizes.md}
                    fontWeight={kStyleGlobal.fontWeights.bold}
                  >
                    車型偏好
                  </Text>
                  <RadioGroup>
                    <Stack spacing={4}>
                      {[
                        {
                          value: "economy",
                          label: "經濟型",
                          description: "適合一般通勤"
                        },
                        {
                          value: "comfort",
                          label: "舒適型",
                          description: "享受舒適旅程"
                        },
                        {
                          value: "luxury",
                          label: "豪華型",
                          description: "尊榮商務體驗"
                        }
                      ].map(option => (
                        <Radio
                          key={option.value}
                          value={option.value}
                        >
                          <Flex direction={"column"}>
                            <Text
                              fontWeight={kStyleGlobal.fontWeights.medium}
                            >
                              {option.label}
                            </Text>
                            <Text
                              fontSize={kStyleGlobal.fontSizes.sm}
                              color={kStyleGlobal.colors.gray[500]}
                            >
                              {option.description}
                            </Text>
                          </Flex>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Flex>
                <Flex
                  direction={"column"}
                  gap={3}
                >
                  <Text
                    fontSize={kStyleGlobal.fontSizes.md}
                    fontWeight={kStyleGlobal.fontWeights.bold}
                  >
                    付款方式
                  </Text>
                  <Select
                    placeholder={"選擇付款方式"}
                    bg={"white"}
                    h={"45px"}
                    borderRadius={"lg"}
                  >
                    <option value={"cash"}>現金支付</option>
                    <option value={"card"}>信用卡</option>
                    <option value={"line"}>Line Pay</option>
                  </Select>
                </Flex>
              </Stack>
            </ModalBody>
            <ModalFooter
              p={4}
              borderTopWidth={1}
              borderColor={"gray.100"}
            >
              <Button
                w={"100%"}
                size={"lg"}
                onClick={toggleFilter}
                bg={kStyleGlobal.colors.primary[500]}
                color={"white"}
                h={"54px"}
                fontSize={"md"}
                borderRadius={"xl"}
                _hover={{
                  bg: kStyleGlobal.colors.primary[600]
                }}
              >
                確認
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </ChakraProvider>
  );
};

export default RideService;
