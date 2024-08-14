import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { FC, useState, useEffect } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Link } from "expo-router";
import { Quality } from "./types/Quality";

interface LiveVideoControlsProps {
    onTogglePlayPause: () => void;
    onToggleMute: () => void;
  //  onSeek: (time: number) => void;
    onToggleFullscreen: () => void;
//currentTime: number;
    isMuted: boolean;
    shouldPlay: boolean;
    fullScreenValue: boolean;
   // liveProgress: number; // Represents how much of the stream has been loaded
    volume: number;
    onReloadStream: () => void; // Nuevo: Función para recargar el stream
    onChangeQuality: (quality:Quality) => void; //  onReloadStream: () => void; // Nuevo: Función para recargar el stream
    onVolumeChange: (volume: number) => void; 
    handleOpenQualitySettings:() => void;
    showModalQualityOptions : boolean;
}

const LiveVideoControls: FC<LiveVideoControlsProps> = ({
    onTogglePlayPause,
    onToggleMute,

    onToggleFullscreen,

    isMuted,
    shouldPlay,
    fullScreenValue,
    volume,
    onReloadStream,
    onChangeQuality,
    onVolumeChange,
    handleOpenQualitySettings,
    showModalQualityOptions
}) => {
    const formatTime = (timeInMillis: number) => {
        if (!isNaN(timeInMillis) && timeInMillis >= 0) {
            const totalSeconds = Math.floor(timeInMillis / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const minutesDisplay = `${minutes < 10 ? '0' : ''}${minutes}:`;
            const secondsDisplay = `${seconds < 10 ? '0' : ''}${seconds}`;
            return `${minutesDisplay}${secondsDisplay}`;
        }
        return '00:00';
    };
    return (
        <View style={styles.controls}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onTogglePlayPause} style={styles.controlButton}>
                    <Ionicons name={shouldPlay ? 'pause' : 'play-sharp'} size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onToggleMute} style={styles.controlButton}>
                    <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onToggleFullscreen} style={styles.controlButton}>
                    <MaterialIcons name={fullScreenValue ? 'fullscreen-exit' : 'fullscreen'} size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onReloadStream} style={styles.controlButton}>
                    <Ionicons name="reload" size={24} color="white" />
                </TouchableOpacity>

                  <TouchableOpacity onPress={handleOpenQualitySettings} style={styles.controlButton}>
                    <Ionicons name={showModalQualityOptions ? 'settings-outline': 'settings'} size={24} color="white" />
                </TouchableOpacity>

                {/* <Link href="/modal">Present modal</Link> */}
                {/* <TouchableOpacity
                    onPress={() => onChangeQuality('low')}
                    style={styles.controlButton}
                >
                    <Text style={styles.qualityText}>Low</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onChangeQuality('medium')}
                    style={styles.controlButton}
                >
                    <Text style={styles.qualityText}>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onChangeQuality('high')}
                    style={styles.controlButton}
                >
                    <Text style={styles.qualityText}>High</Text>
                </TouchableOpacity> */}
            </View>
            <View style={styles.volumeContainer}>
                <Ionicons name="volume-low" size={20} color="white" />
                <Slider
                    style={styles.volumeSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={(value) => onVolumeChange(value)}
                    minimumTrackTintColor="#FFF"
                    maximumTrackTintColor="#AAA"
                    thumbTintColor="#FFF"
                />
                <Ionicons name="volume-high" size={20} color="white" />
            </View>
            {/* <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Slider
                   style={styles.slider}
                    minimumValue={0}
                    maximumValue={liveProgress}
                    value={currentTime}
                    onValueChange={(value) => onSeek(value)}
                    minimumTrackTintColor="#FFF"
                    maximumTrackTintColor="#AAA"
                    thumbTintColor="#FFF"
                />
                <Text style={styles.timeText}>{formatTime(liveProgress)}</Text>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    controls: {
        flexDirection: 'column-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#000',
        
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // Space between buttons and progress container
    },
    controlButton: {
        marginHorizontal: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    slider: {
        flex: 1,
        height: 40, // Ensure slider has a height
        marginHorizontal: 10,
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        width: 50, // Ensure the text has enough space
        textAlign: 'center',
    },
    volumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    volumeSlider: {
        flex: 1,
        height: 40,
        marginHorizontal: 10,
    },
    qualityText: {
        color: 'white',
        fontSize: 16,
    },
});
export default LiveVideoControls;
