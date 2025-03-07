import React, { useState, useEffect } from 'react';
import { Box, Image, Spinner, Text, Center } from '@chakra-ui/react';

interface MapsProps {
  userCoords: {
    lat: number;
    lng: number;
  };
  style?: React.CSSProperties;
}

/**
 * Maps component to display a static map using Google Maps Static API
 */
const Maps: React.FC<MapsProps> = ({ userCoords, style }) => {
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (userCoords.lat === 0 && userCoords.lng === 0) {
      setError('無效的座標');
      setIsLoading(false);
      return;
    }

    try {
      // Use Google Maps Static API to generate a map image
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      setMapImageUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${userCoords.lat},${userCoords.lng}&zoom=14&size=800x600&scale=2&maptype=roadmap&markers=color:red%7C${userCoords.lat},${userCoords.lng}&map_id=roadmap&key=${apiKey}`);
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating map URL:', err);
      setError('無法載入地圖');
      setIsLoading(false);
    }
  }, [userCoords]);

  if (isLoading) {
    return (
      <Center style={style} bg="gray.100">
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={style} bg="gray.100">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box style={style} position="relative">
      {mapImageUrl ? (
        <Image 
          src={mapImageUrl} 
          alt="Map" 
          width="100%" 
          height="100%" 
          objectFit="cover"
          fallback={
            <Center style={style} bg="gray.100">
              <Spinner size="lg" color="blue.500" />
            </Center>
          }
        />
      ) : (
        <Center style={style} bg="gray.100">
          <Text>無法載入地圖</Text>
        </Center>
      )}
    </Box>
  );
};

export default Maps;
