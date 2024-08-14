import React, { useRef, useState, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { Gesture, GestureDetector, GestureHandlerRootView, HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from "react-native-gesture-handler";
import VideoControls from "./VideoControls";
import * as ScreenOrientation from "expo-screen-orientation";
import Spinner from "react-native-loading-spinner-overlay";
import { ThemedView } from "./ThemedView";

const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoCamera = () => {
    const [lessons, setLessons] = useState<any>([]);
    const [selectedLesson, setSelectedLesson] = useState<any>({});
    const videoRef = useRef<Video>(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [orientation, setOrientation] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const doubleTapRef = useRef(null);

    // const doubleTap = Gesture.Tap()
    //     .numberOfTaps(2)
    //     .onStart(async (event) => {
    //         // const touchX = event.absoluteX;
    //         // const mid = Dimensions.get('screen').width / 2;

    //         // if (touchX < mid) {
    //         //     // Rewind 10 seconds
    //         //     videoRef.current?.getStatusAsync().then(status => {
    //         //         if (status.isLoaded) {
    //         //             const newPosition = Math.max(status.positionMillis - 10000, 0);
    //         //             videoRef.current?.setPositionAsync(newPosition);
    //         //         }
    //         //     });
    //         // } else {
    //         //     // Fast forward 10 seconds
    //         //     videoRef.current?.getStatusAsync().then(status => {
    //         //         if (status.isLoaded) {
    //         //             const newPosition = Math.min(
    //         //                 status.positionMillis + 10000,
    //         //                 status.durationMillis || 0
    //         //             );
    //         //             videoRef.current?.setPositionAsync(newPosition);
    //         //         }
    //         //     });
    //         // }
    //     });

    // // Single tap gesture for showing/hiding controls
    // const singleTap = Gesture.Tap().onStart((event) => {
    //     setShowControls(prev => !prev);
    // });

    const onSingleTap = (event:HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            setShowControls(prev => !prev);
        }
    };

    const onDoubleTap = (event:HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            const touchX = event.nativeEvent.x;
            const mid = Dimensions.get('screen').width / 2;

            videoRef.current?.getStatusAsync().then(status => {
                if (status.isLoaded) {
                    if (touchX < mid) {
                        const newPosition = Math.max(status.positionMillis - 10000, 0);
                        videoRef.current?.setPositionAsync(newPosition);
                    } else {
                        const newPosition = Math.min(
                            status.positionMillis + 10000,
                            status.durationMillis || 0
                        );
                        videoRef.current?.setPositionAsync(newPosition);
                    }
                }
            });
        }
    };

    // const taps = Gesture.Race(doubleTap, singleTap);


    useEffect(() => {
        // Simulate fetching lessons by course
        setTimeout(() => {
            const fakeLessons = [
                {
                    lessonId: "1",
                    lessonVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                    lessonTitle: "Lesson 1",
                    lessonDescription: "Introduction to React Native 1",
                    videoTotalDuration: 10000,
                    lessonThumbnailImageUrl: "https://via.placeholder.com/150/0000FF/808080",
                },
                {
                    lessonId: "2",
                    lessonVideoUrl: "https://www.w3schools.com/html/movie.mp4",
                    lessonTitle: "Lesson 2",
                    lessonDescription: "Introduction to React Native 2",
                    videoTotalDuration: 12000,
                    lessonThumbnailImageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF",
                },
                // Add more lessons here
            ];
            setLessons(fakeLessons);
            setSelectedLesson(fakeLessons[0]);
            setIsLoading(false); // Set loading to false after lessons are loaded
        }, 2000); // Simulate network delay
    }, []);

    useEffect(() => {
        if (lessons.length > 0) {
            const newLesson = lessons[currentLessonIndex];
            setSelectedLesson(newLesson);
            setCurrentTime(0); // Reset current time when switching lessons
        }
    }, [currentLessonIndex, lessons]);

    ``    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (videoRef.current) {
    //             videoRef.current.getStatusAsync().then(status => {
    //                 if (status.isLoaded) {
    //                     setCurrentTime(status.positionMillis);
    //                 }
    //             });
    //         }
    //     }, 1000); // Update every second

    //     return () => clearInterval(interval); // Clean up the interval on component unmount
    // }, []);``

    //sets the current time, if video is finished, moves to the next video
    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return
        setCurrentTime(status.positionMillis);
        if (status.didJustFinish) {
            playNextVideo();
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

    const playNextVideo = () => {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex((prevIndex) => prevIndex + 1);
        }
    };

    const playPreviousVideo = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex((prevIndex) => prevIndex - 1);
        }
    };

    const togglePlaybackSpeed = () => {
        //gets the next playback speed index
        const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
        if (nextSpeedIndex < playbackSpeedOptions.length) {
            videoRef.current?.setRateAsync(playbackSpeedOptions[nextSpeedIndex], true);
            setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
        }
        //if the last option i.e. 2x speed is applied. then moves to first option 
        else {
            videoRef.current?.setRateAsync(playbackSpeedOptions[0], true);
            setPlaybackSpeed(playbackSpeedOptions[0]);
        }
    };

    const toggleMute = () => {
        videoRef.current?.setIsMutedAsync(isMuted);
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = async () => {
        if (!isFullscreen) {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
            );
            setIsFullscreen(true);
        } else {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            setIsFullscreen(false);
        }
        setOrientation(await ScreenOrientation.getOrientationAsync());
    };

    //const taps = Gesture.Exclusive(doubleTap, singleTap)

    // const videoDuration = parseFloat(selectedLesson.videoTotalDuration || "0");

    return (
        <GestureHandlerRootView style={styles.container}>
            <Spinner visible={isLoading} size="large" />
            {lessons.length > 0 && (
                <>
                    <TapGestureHandler
                        onHandlerStateChange={onSingleTap}
                        waitFor={doubleTapRef}>
                        <TapGestureHandler
                            ref={doubleTapRef}
                            onHandlerStateChange={onDoubleTap}
                            numberOfTaps={2}>
                            <View>
                                <Video
                                    key={selectedLesson.lessonId}
                                    ref={videoRef}
                                    source={{
                                        uri: lessons[currentLessonIndex]?.lessonVideoUrl,
                                    }}
                                    rate={playbackSpeed}
                                    isMuted={isMuted}
                                    shouldPlay={isPlaying}
                                    resizeMode={ResizeMode.COVER}
                                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                                    style={styles.video}
                                />
                            </View>
                        </TapGestureHandler>
                    </TapGestureHandler>


                    {
                        showControls && (
                            <VideoControls
                                onTogglePlayPause={togglePlayPause}
                                onPlayPreviousVideo={playPreviousVideo}
                                onPlayNextVideo={playNextVideo}
                                onToggleMute={toggleMute}
                                onTogglePlaybackSpeed={togglePlaybackSpeed}
                                onSeek={(value) => {
                                    videoRef.current?.setPositionAsync(value);
                                    setCurrentTime(value);
                                }}
                                onToggleFullscreen={toggleFullscreen}
                                duration={selectedLesson?.videoTotalDuration}
                                currentTime={currentTime}
                                rate={playbackSpeed}
                                isMuted={isMuted}
                                shouldPlay={isPlaying}
                                fullScreenValue={isFullscreen}
                            />
                        )
                    }

                </>
            )}

            {orientation == 1 && (
                <ThemedView>
                    {/* Simulate other UI elements here */}
                </ThemedView>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    video: {
        width: 320,
        height: 200,
    },
});

export default VideoCamera;
