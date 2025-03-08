/// <reference types="vite/client" />

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  IconButton,
  Grid,
  Stack,
  Image,
  useTheme,
  ChakraProvider
} from '@chakra-ui/react';
import { FiMapPin, FiSettings, FiTruck } from 'react-icons/fi';
import { MdRoute } from 'react-icons/md';
import { FaCar } from 'react-icons/fa';

const Home = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  
  // 用于存储用户当前位置
  const [currentLocation, setCurrentLocation] = useState("正在获取位置...");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Google Maps API Key
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD0LlTAW3UbiCbRM8mE3dL9yHTDrEwAXOE";
  
  // 获取用户当前位置
  useEffect(() => {
    const getUserLocation = () => {
      setIsLoadingLocation(true);
      
      // 检查浏览器是否支持地理位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // 使用 Google Maps Geocoding API 将坐标转换为地址
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&language=zh-TW`)
              .then(response => response.json())
              .then(data => {
                if (data.status === "OK") {
                  // 从结果中提取城市和区域信息
                  const addressComponents = data.results[0].address_components;
                  let city = "";
                  let district = "";
                  
                  for (const component of addressComponents) {
                    if (component.types.includes("administrative_area_level_1")) {
                      city = component.short_name;
                    }
                    if (component.types.includes("administrative_area_level_3") || 
                        component.types.includes("locality")) {
                      district = component.short_name;
                    }
                  }
                  
                  // 设置当前位置
                  if (city && district) {
                    setCurrentLocation(`${city}${district}`);
                  } else if (city) {
                    setCurrentLocation(city);
                  } else {
                    setCurrentLocation("未知位置");
                  }
                } else {
                  setCurrentLocation("无法获取位置");
                  console.error("Google Maps Geocoding API 错误:", data.status);
                }
                setIsLoadingLocation(false);
              })
              .catch(error => {
                console.error("获取地址时出错:", error);
                setCurrentLocation("位置服务暂时不可用");
                setIsLoadingLocation(false);
              });
          },
          (error) => {
            console.error("获取位置时出错:", error);
            setCurrentLocation("无法获取位置");
            setIsLoadingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setCurrentLocation("浏览器不支持位置服务");
        setIsLoadingLocation(false);
      }
    };
    
    getUserLocation();
    
    // 每5分钟更新一次位置
    const locationInterval = setInterval(getUserLocation, 5 * 60 * 1000);
    
    return () => clearInterval(locationInterval);
  }, []);
  
  // 自定義主題（實際使用中可以放在單獨的文件中）
  const kStyleGlobal = {
    colors: {
      primary: {
        500: '#2C5282' // 改為更沉穩的深藍色
      },
      secondary: {
        500: '#4A5568' // 深灰色調
      },
      background: {
        main: '#F7FAFC', // 深色背景
        card: '#FFFFFF'
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // 登出後重定向會自動發生，因為身份驗證狀態變更
    } catch (error) {
      console.error('登出錯誤:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const goToNavigation = (path: string) => {
    navigate(path);
  };

  // 定義行程類型
  interface Trip {
    from: string;
    to: string;
    price: string;
  }

  // 最近行程數據
  const recentTrips: Trip[] = [
    {
      "from": "桃園國際機場",
      "to": "台北車站",
      "price": "350"
    },
    {
      "from": "台北車站",
      "to": "信義區",
      "price": "180"
    },
    {
      "from": "士林夜市",
      "to": "西門町",
      "price": "220"
    }
  ];

  // 定義服務類型
  interface Service {
    title: string;
    desc: string;
    price: string;
    image: string;
  }

  // 推薦服務數據
  const recommendedServices: Service[] = [
    {
      "title": "商務用車",
      "desc": "高級舒適的商務座駕",
      "price": "500",
      "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"
    },
    {
      "title": "機場接送",
      "desc": "準時可靠的接送服務",
      "price": "350",
      "image": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d"
    },
    {
      "title": "長途包車",
      "desc": "自由行程的包車體驗",
      "price": "1200",
      "image": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2"
    }
  ];

  return (
    <ChakraProvider theme={theme}>
      <Flex
        direction={"column"}
        bg={kStyleGlobal.colors.background.main}
        minH={"100vh"}
      >
        {/* 頂部區域 */}
        <Box
          bg={kStyleGlobal.colors.background.card}
          p={6}
          borderBottomRadius={"2xl"}
          boxShadow={"md"}
        >
          <Flex
            justify={"space-between"}
            align={"center"}
            mb={8}
          >
            <Flex
              align={"center"}
              gap={2}
            >
              <Icon
                as={FiMapPin}
                boxSize={6}
                color={kStyleGlobal.colors.primary[500]}
              />
              <Flex direction={"column"}>
                <Text
                  fontSize={"12px"}
                  color={"gray.500"}
                >
                  當前位置
                </Text>
                <Text
                  fontSize={"16px"}
                  fontWeight={"600"}
                >
                  {isLoadingLocation ? (
                    <Text as="span" color="gray.400">正在獲取位置...</Text>
                  ) : (
                    currentLocation
                  )}
                </Text>
              </Flex>
            </Flex>
            <Flex gap={2}>
              <IconButton
                aria-label="設定"
                icon={<Icon as={FiSettings} boxSize={5} />}
                variant={"ghost"}
                onClick={() => goToNavigation("/settings")}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                isDisabled={isLoggingOut}
              >
                {isLoggingOut ? '登出中...' : '登出'}
              </Button>
            </Flex>
          </Flex>

          {/* 服務區塊 */}
          <Grid
            templateColumns={"repeat(2, 1fr)"}
            gap={4}
          >
            <Button
              h={"auto"}
              p={6}
              bg={kStyleGlobal.colors.primary[500]}
              color={"white"}
              borderRadius={"2xl"}
              onClick={() => goToNavigation("/ride-service")}
              _hover={{
                bg: 'blue.700'
              }}
            >
              <Flex
                direction={"column"}
                align={"flex-start"}
                gap={4}
              >
                <Icon as={FaCar} boxSize={7} />
                <Flex
                  direction={"column"}
                  align={"flex-start"}
                  gap={1}
                >
                  <Text
                    fontSize={"18px"}
                    fontWeight={"600"}
                  >
                    乘車服務
                  </Text>
                  <Text
                    fontSize={"13px"}
                    opacity={0.9}
                  >
                    快速便捷的專車服務
                  </Text>
                </Flex>
              </Flex>
            </Button>

            <Button
              h={"auto"}
              p={6}
              bg={"white"}
              borderWidth={1}
              borderColor={"gray.200"}
              borderRadius={"2xl"}
              onClick={() => goToNavigation("/charter-service")}
              _hover={{
                bg: 'gray.50'
              }}
            >
              <Flex
                direction={"column"}
                align={"flex-start"}
                gap={4}
              >
                <Icon
                  as={FiTruck}
                  boxSize={7}
                  color={kStyleGlobal.colors.primary[500]}
                />
                <Flex
                  direction={"column"}
                  align={"flex-start"}
                  gap={1}
                >
                  <Text
                    fontSize={"18px"}
                    fontWeight={"600"}
                  >
                    包車服務
                  </Text>
                  <Text
                    fontSize={"13px"}
                    color={"gray.600"}
                  >
                    靈活的長途包車選擇
                  </Text>
                </Flex>
              </Flex>
            </Button>
          </Grid>
        </Box>

        {/* 主內容區域 */}
        <Box
          p={6}
          flex={1}
        >
          {/* 最近行程 */}
          <Flex
            justify={"space-between"}
            align={"center"}
            mb={4}
          >
            <Text
              fontSize={"18px"}
              fontWeight={"600"}
            >
              最近行程
            </Text>
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => goToNavigation("/trip-history")}
              color={kStyleGlobal.colors.primary[500]}
            >
              查看更多
            </Button>
          </Flex>

          <Stack
            spacing={3}
            mb={8}
          >
            {recentTrips.map((trip, index) => (
              <Flex
                key={index}
                bg={"white"}
                p={4}
                borderRadius={"xl"}
                align={"center"}
                justify={"space-between"}
                boxShadow={"sm"}
              >
                <Flex
                  align={"center"}
                  gap={3}
                >
                  <Icon
                    as={MdRoute}
                    boxSize={5}
                    color={kStyleGlobal.colors.primary[500]}
                  />
                  <Flex direction={"column"}>
                    <Text
                      fontSize={"15px"}
                      fontWeight={"500"}
                    >
                      {trip.from + " → " + trip.to}
                    </Text>
                  </Flex>
                </Flex>
                <Text
                  fontSize={"16px"}
                  fontWeight={"600"}
                  color={kStyleGlobal.colors.primary[500]}
                >
                  NT${trip.price}
                </Text>
              </Flex>
            ))}
          </Stack>

          {/* 推薦服務 */}
          <Text
            fontSize={"18px"}
            fontWeight={"600"}
            mb={4}
          >
            為您推薦
          </Text>

          <Flex
            overflowX={"auto"}
            css={{
              "scrollbarWidth": "none",
              "&::-webkit-scrollbar": {
                "display": "none"
              }
            }}
          >
            <Flex
              gap={4}
              pb={4}
            >
              {recommendedServices.map((service, index) => (
                <Box
                  key={index}
                  minW={"280px"}
                  bg={kStyleGlobal.colors.background.card}
                  borderRadius={"2xl"}
                  overflow={"hidden"}
                  boxShadow={"md"}
                >
                  <Image
                    src={service.image}
                    h={"140px"}
                    w={"100%"}
                    objectFit={"cover"}
                    alt={service.title}
                  />
                  <Box p={4}>
                    <Text
                      fontSize={"16px"}
                      fontWeight={"600"}
                      mb={1}
                    >
                      {service.title}
                    </Text>
                    <Text
                      fontSize={"14px"}
                      color={"gray.600"}
                      mb={2}
                    >
                      {service.desc}
                    </Text>
                    <Text
                      fontSize={"16px"}
                      fontWeight={"600"}
                      color={kStyleGlobal.colors.primary[500]}
                    >
                      NT${service.price} 起
                    </Text>
                  </Box>
                </Box>
              ))}
            </Flex>
          </Flex>
        </Box>

        {/* 底部導航欄 */}
        <Flex
          as="nav"
          bg={kStyleGlobal.colors.background.card}
          p={6} /* 增加填充 */
          py={5} /* 垂直方向的填充 */
          justifyContent="space-around"
          borderTop="1px"
          borderColor="gray.200"
          boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
        >
          <IconButton
            aria-label="首頁"
            icon={<Icon as={FiMapPin} boxSize={18} />} /* 增大圖標至3倍 */
            variant="ghost"
            h="60px" /* 增加高度 */
            w="60px" /* 增加寬度 */
            isActive={true}
            onClick={() => goToNavigation("/")}
          />
          <IconButton
            aria-label="乘車"
            icon={<Icon as={FaCar} boxSize={18} />} /* 增大圖標至3倍 */
            variant="ghost"
            h="60px" /* 增加高度 */
            w="60px" /* 增加寬度 */
            onClick={() => goToNavigation("/ride-service")}
          />
          <IconButton
            aria-label="行程"
            icon={<Icon as={MdRoute} boxSize={18} />} /* 增大圖標至3倍 */
            variant="ghost"
            h="60px" /* 增加高度 */
            w="60px" /* 增加寬度 */
            onClick={() => goToNavigation("/trip-history")}
          />
          <IconButton
            aria-label="設定"
            icon={<Icon as={FiSettings} boxSize={18} />} /* 增大圖標至3倍 */
            variant="ghost"
            h="60px" /* 增加高度 */
            w="60px" /* 增加寬度 */
            onClick={() => goToNavigation("/settings")}
          />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Home;
