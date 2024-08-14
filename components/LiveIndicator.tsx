import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const LiveIndicator = () => {
    const opacity = useSharedValue(1); // Valor inicial de opacidad

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.2, { duration: 1000 }), // Disminuir la opacidad a 0.2 en 0.5 segundos
            -1, // Repetir indefinidamente
            true // Alternar entre 1 y 0.2
        );
    }, []);

    // Estilo animado basado en la opacidad
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.liveIndicator, animatedStyle]} />
    );
};

const styles = StyleSheet.create({
    liveIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red'
    },
})

export default LiveIndicator
