import { useState } from 'react';
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
import { FiMapPin, FiSettings, FiTruck, FiRoute } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';

const Home = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // 自定義主題（實際使用中可以放在單獨的文件中）
  const kStyleGlobal = {
    colors: {
      primary: {
        500: '#3182CE' // 使用Chakra UI的藍色作為主色調
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

  const goToNavigation = (path) => {
    navigate(path);
  };

  // 最近行程數據
  const recentTrips = [
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

  // 推薦服務數據
  const recommendedServices = [
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
        bg={"gray.50"}
        minH={"100vh"}
      >
        {/* 頂部區域 */}
        <Box
          bg={"white"}
          p={6}
          borderBottomRadius={"2xl"}
          boxShadow={"sm"}
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
                  台北市
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
                bg: 'blue.600'
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
                    as={FiRoute}
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
                  bg={"white"}
                  borderRadius={"2xl"}
                  overflow={"hidden"}
                  boxShadow={"sm"}
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
          bg="white"
          p={3}
          justifyContent="space-around"
          borderTop="1px"
          borderColor="gray.200"
          boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
        >
          <IconButton
            aria-label="首頁"
            icon={<Icon as={FiMapPin} />}
            variant="ghost"
            isActive={true}
            onClick={() => goToNavigation("/")}
          />
          <IconButton
            aria-label="乘車"
            icon={<Icon as={FaCar} />}
            variant="ghost"
            onClick={() => goToNavigation("/ride-service")}
          />
          <IconButton
            aria-label="行程"
            icon={<Icon as={FiRoute} />}
            variant="ghost"
            onClick={() => goToNavigation("/trip-history")}
          />
          <IconButton
            aria-label="設定"
            icon={<Icon as={FiSettings} />}
            variant="ghost"
            onClick={() => goToNavigation("/settings")}
          />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Home;
