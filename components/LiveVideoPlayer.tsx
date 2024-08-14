import React, { useState, useRef, FC, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode, VideoFullscreenUpdate, VideoFullscreenUpdateEvent } from 'expo-av';
import LiveVideoControls from './LiveVideoControls';
import * as ScreenOrientation from 'expo-screen-orientation';
import ModalQualitySettings from './ModalQualitySetting';
import { ThemedText } from './ThemedText';
import Checkbox from 'expo-checkbox';
import { Quality } from './types/Quality';
import { ThemedView } from './ThemedView';
import Spinner from 'react-native-loading-spinner-overlay';
import { qualityOptions } from '@/constants/QualityOptions';
import LiveIndicator from './LiveIndicator';
// import { Pre } from 'react-native-gesture-handler';

interface LiveVideoPlayerProps {
    liveStreamUrl: string;
}



const LiveVideoPlayer: FC<LiveVideoPlayerProps> = ({ liveStreamUrl }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false);
    //const [isLive, setIsLive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [volume, setVolume] = useState(0.5); // Initial volume level
    const [showModalQualityOptions, setShowModalQualityOptions] = useState(false);
    const [videoKey, setVideoKey] = useState(0)
    const [selectedQuality, setSelectedQuality] = useState('');
    const videoRef = useRef<Video>(null);

    // const tap = Gesture.Tap().onEnd((event) => {
       
    //     try {
    //          if (event.state === State.END) {
    //         setShowControls(prev => !prev);
    //     }
    //         console.log('Toggled controls visibility');
    //     } catch (error) {
    //         console.error('Error toggling controls:', error);
    //     }
    // });
    
    const toggleShowControls = () => setShowControls(prev => !prev);

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        if (status.isLoaded && isLoading) {

            setIsLoading(false); // El video ha terminado de cargar
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current?.pauseAsync();
        } else {
            videoRef.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        videoRef.current?.setIsMutedAsync(!isMuted);
        setIsMuted(!isMuted);
    };



    const handleVolumeChange = (newVolume: number) => {
        videoRef.current?.setVolumeAsync(newVolume);
        setVolume(newVolume);
    };



    const reloadStream = async () => {
        try {
            console.log('Reloading stream...');

            // Pause the video
            setVideoKey(prev => prev + 1)

            console.log('Stream reloaded successfully.');
        } catch (error) {
            console.error('Error reloading stream:', error);
        }
    };

    const changeQuality = (quality: Quality) => {
        // Call the API to change the quality and update the video source
        // Assume the API returns a new URL for the stream
        const newUrl = `http://localhost/api/streams/stream/${quality}`;
        console.log(newUrl)
        // videoRef.current?.setStatusAsync({ uri: newUrl });
    };

    const handleOpenQualitySettings = () => {
        setShowModalQualityOptions(true); // Cambia el estado para mostrar el modal
    };

    const handleCloseQualitySettings = () => {
        setShowModalQualityOptions(false); // Cambia el estado para ocultar el modal
    };


    const handleQualityChange = (quality: Quality) => {
        setSelectedQuality(quality)
        //  setIsCheked(!isCheked)
        //console.log(quality)

    }

    const toggleFullscreen = async () => {
        if (isFullscreen) {
            // Exit fullscreen
            try {
                await videoRef.current?.dismissFullscreenPlayer();
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP // Reset to portrait
                );
            } catch (error) {
                console.error("Error exiting fullscreen:", error);
            }
        } else {
            // Enter fullscreen
            try {
                await videoRef.current?.presentFullscreenPlayer();
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.LANDSCAPE_LEFT // Lock to landscape
                );
            } catch (error) {
                console.error("Error entering fullscreen:", error);
            }
        }
    };

    // Handle fullscreen updates
    const handleFullscreenUpdate = useCallback((event: VideoFullscreenUpdateEvent) => {
        if (event.fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
            // Entered fullscreen
            setIsFullscreen(true);
        } else if (event.fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_DISMISS) {
            // Exited fullscreen
            setIsFullscreen(false);
            // Reset orientation in case it wasn't already reset
            ScreenOrientation.unlockAsync(); // This unlocks orientation and allows it to return to default behavior
        }
    }, []);




    const videoStyle = isFullscreen ? styles.fullscreenVideo : styles.video;
    const videoResizeMode = isFullscreen ? ResizeMode.CONTAIN : ResizeMode.COVER



    return (
        <View style={styles.container}>
            {/* <Spinner visible={isLoading} size="large" /> */}
            <View style={styles.liveIndicatorContainer}>
                <LiveIndicator />
                <Text style={[styles.liveText, { color: 'red' }]}>
                    EN VIVO
                </Text>
            </View>
            <Pressable
               onPress={toggleShowControls}
               style={{flex:1}}
            >
                    <Video
                        key={videoKey}
                        ref={videoRef}
                        source={{ uri: liveStreamUrl }}
                        shouldPlay={isPlaying}
                        isMuted={isMuted}
                        resizeMode={videoResizeMode}
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        style={videoStyle}
                        onFullscreenUpdate={handleFullscreenUpdate}
                        useNativeControls={false}
                    />
            </Pressable>
            {
                showControls && (
                    <LiveVideoControls
                        onTogglePlayPause={togglePlayPause}
                        onToggleMute={toggleMute}
                        // onSeek={(time) => videoRef.current?.setPositionAsync(time)}
                        onToggleFullscreen={toggleFullscreen}
                        // currentTime={currentTime}
                        isMuted={isMuted}
                        shouldPlay={isPlaying}
                        fullScreenValue={isFullscreen}
                        // liveProgress={liveProgress}
                        onReloadStream={reloadStream}
                        onChangeQuality={changeQuality}
                        onVolumeChange={handleVolumeChange}
                        volume={volume}
                        handleOpenQualitySettings={handleOpenQualitySettings}
                        showModalQualityOptions={showModalQualityOptions}
                    />
                )
            }
            <ModalQualitySettings isVisible={showModalQualityOptions} onClose={() => {
                handleCloseQualitySettings()
            }}>

                {qualityOptions.map((option, index) => (
                    <ThemedView key={option.value} style={[
                        styles.checkboxContainer,
                        index < qualityOptions.length - 1 && styles.separator,
                    ]}>
                        <Checkbox
                            value={selectedQuality === option.value}
                            onValueChange={() => handleQualityChange(option.value)}
                            color={selectedQuality === option.value ? '#003a0d' : '#0c0c0c'}
                            style={styles.checkbox}
                        />
                        <ThemedText style={styles.textCheckbox}>{option.label}</ThemedText>
                    </ThemedView>
                ))}

            </ModalQualitySettings>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    video: {
        flexDirection: 'row',
        height: 300,
    },
    liveIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        left: 10,

    },
    liveIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red'
    },
    liveText: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        gap: 10
    },
    checkbox: {
        borderRadius: 20,
    },
    textCheckbox: {
        fontWeight: '600',
        fontSize: 14
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0', // Color del separador
        paddingBottom: 10, // Opcional: añade un poco de espacio debajo del checkbox
    },
    fullscreenVideo: {
        ...StyleSheet.absoluteFillObject, // Tamaño del video en modo pantalla completa
    },


});

export default LiveVideoPlayer;
