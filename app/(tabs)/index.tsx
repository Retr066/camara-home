import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Button, useWindowDimensions, ViewStyle } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { ThemedView } from '../../components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import LiveVideoPlayer from '@/components/LiveVideoPlayer';

export default function App() {
  const videoRef = React.useRef<Video>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = React.useState<AVPlaybackStatus>();
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  useEffect(() => {

    setVideoUrl('http://192.168.18.96:80/api/streams/stream/low')

  }, [])




  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Memorizar el estilo basado en las dimensiones de la pantalla
  const videoStyle = useMemo<ViewStyle>(() => ({
    width: screenWidth, // Por ejemplo, 90% del ancho de la pantalla
    height: screenHeight * 0.5, // Por ejemplo, 50% de la altura de la pantalla
    alignSelf: 'center',
    flexDirection: 'row',
  }), [screenWidth, screenHeight]);

  return (

    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="camera-sharp" style={styles.headerImage} />}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title} type="title">Lista de camaras</ThemedText>
        <ThemedView style={videoStyle}>
          <LiveVideoPlayer liveStreamUrl={videoUrl} />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  title: {
    marginBottom: 20,
  }
});
