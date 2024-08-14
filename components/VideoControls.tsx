import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { FC } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface VideoControlsProps {
    onTogglePlayPause: () => void;
    onPlayPreviousVideo: () => void;
    onPlayNextVideo: () => void;
    onToggleMute: () => void;
    onTogglePlaybackSpeed: () => void;
    onSeek: (time: number) => void;
    onToggleFullscreen: () => void;
    duration: number;
    currentTime: number;
    rate: number;
    isMuted: boolean;
    shouldPlay: boolean;
    fullScreenValue: boolean;
  }
  


const VideoControls : FC<VideoControlsProps> = ({
    onTogglePlayPause,
    onPlayPreviousVideo,
    onPlayNextVideo,
    onToggleMute,
    onTogglePlaybackSpeed,
    onSeek,
    onToggleFullscreen,
    duration,
    currentTime: time,
    rate,
    isMuted,
    shouldPlay,
    fullScreenValue,
  }) => {
    const formatTime = (timeInMillis: number) => {
      if (!isNaN(timeInMillis) && timeInMillis >= 0) {
        const totalSeconds = Math.floor(timeInMillis / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const hoursDisplay = hours > 0 ? `${hours}:` : '';
        const minutesDisplay = `${minutes < 10 ? "0" : ""}${minutes}:`;
        const secondsDisplay = `${seconds < 10 ? "0" : ""}${seconds}`;

        return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`;
    }
    return "00:00";
    };

 
    return (
      <>
        <ThemedView style={styles.controls}>
          <TouchableOpacity
            onPress={() => {
              onTogglePlayPause();
            }}
            style={styles.controlButton}
          >
            <Ionicons
              name={shouldPlay ? "pause" : "play-sharp"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPlayPreviousVideo}
            style={styles.controlButton}
          >
            <AntDesign name="stepbackward" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPlayNextVideo}
            style={styles.controlButton}
          >
            <AntDesign name="stepforward" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onToggleMute();
            }}
            style={styles.controlButton}
          >
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onTogglePlaybackSpeed();
            }}
            style={styles.controlButton}
          >
            <ThemedText style={styles.playbackSpeedText}>{`${rate}x`}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onToggleFullscreen();
            }}
            style={styles.controlButton}
          >
            <MaterialIcons
              name={fullScreenValue ? "fullscreen-exit" : "fullscreen"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.progressContainer}>
          <ThemedText style={styles.timeText}>{formatTime(time)}</ThemedText>
          <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={time}
          onValueChange={(value) => onSeek(value)}
          onSlidingComplete={(value) => onSeek(value)}
          minimumTrackTintColor="#FFF"
          maximumTrackTintColor="#AAA"
          thumbTintColor="#FFF"
        />
          <ThemedText style={styles.timeText}>{formatTime(duration)}</ThemedText>
        </ThemedView>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    controls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      backgroundColor: "#000",
      zIndex:100,
    },
    controlButton: {
      marginHorizontal: 10,
    },
    playbackSpeedText: {
      color: "white",
      fontSize: 16,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      alignSelf: "center",
      backgroundColor: "black",
      padding: 10,
    },
    slider: {
      flex: 1,
      marginHorizontal: 10,
    },
    timeText: {
      color: "white",
      fontSize: 12,
    },
  });
  
  export default VideoControls;
