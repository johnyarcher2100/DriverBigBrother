import React, { useState } from 'react';
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
  const navigate = useNavigate();
  const theme = useTheme();

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

  // 推荐路线数据
  const recommendedRoutes = [
    {
      start: "台北車站",
      end: "台北101",
      time: "25分鐘",
      price: "NT$250"
    },
    {
      start: "信義商圈",
      end: "松山機場",
      time: "20分鐘",
      price: "NT$200"
    },
    {
      start: "西門町",
      end: "南港展覽館",
      time: "30分鐘",
      price: "NT$300"
    }
  ];

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
            mt={-20}
            position={"relative"}
            zIndex={1}
          >
            {/* 搜索框 */}
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
                boxShadow={"lg"}
                _focus={{
                  borderColor: "primary.500"
                }}
                onClick={() => {
                  goToNavigation("/select-destination");
                }}
              />
            </InputGroup>

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
                  推薦路線
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
                {recommendedRoutes.map((route, index) => (
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
                          {route.start}
                        </Text>
                        <FiArrowRight
                          size={16}
                          color={kStyleGlobal.colors.gray[400]}
                        />
                        <Text
                          fontWeight={kStyleGlobal.fontWeights.medium}
                        >
                          {route.end}
                        </Text>
                      </Flex>
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
