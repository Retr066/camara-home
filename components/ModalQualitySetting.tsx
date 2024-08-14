import { Modal, Pressable, StyleSheet, useColorScheme } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { FC, ReactElement, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

interface ModalQualitySettingsProps {
    isVisible: boolean
    children: ReactElement[] | ReactElement
    onClose: () => void,
}


const ModalQualitySettings: FC<ModalQualitySettingsProps> = ({ isVisible, children, onClose }) => {

    const theme = useColorScheme()

    const overlayOpacity = useSharedValue(0);
    const modalPosition = useSharedValue(300); // Initial position off-screen

    useEffect(() => {
        if (isVisible) {
          
            overlayOpacity.value = withTiming(1, { duration: 300 });
            modalPosition.value = withTiming(0, { duration: 300 });
        } else{
           //aca si quieres aplicar una animacion para cerrar el modal , si un componente externo 
           //lo quiera cerrar o algun otro motivo de cierre externo se puede animar aca
        }
    }, [isVisible]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: modalPosition.value }],
    }));
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Modal transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
                animationType="none"
            >
                <Pressable onPress={() => {
                    overlayOpacity.value = withTiming(0, { duration: 300 });
                    modalPosition.value = withTiming(400, { duration: 300 }, () => {
                        runOnJS(onClose)(); // Ensure onClose is called after animation
                    });
                }} style={styles.overlay}>
                    <Animated.View style={[styles.overlay, overlayStyle]} />
                </Pressable>
                <Animated.View style={[{...styles.modalContent, backgroundColor:(theme === 'light') ? '#fff' : '#151718'}, modalStyle]}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText style={styles.title}>Calidad de Video</ThemedText>
                        <Pressable onPress={() => {
                            overlayOpacity.value = withTiming(0, { duration: 300 });
                            modalPosition.value = withTiming(300, { duration: 300 }, () => {
                                runOnJS(onClose)(); // Ensure onClose is called after animation
                            });
                        }}>
                            <MaterialIcons name="close" color={theme == 'light' ? '#000' : '#fff'} size={22} />
                        </Pressable>
                    </ThemedView>
                    {children}
                </Animated.View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-translúcido negro
    },
    modalContent: {
        height: '38%',
        width: '100%',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
        //backgroundColor: '#fff'
    },
    titleContainer: {
        height: '16%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '900'
    },
});

export default ModalQualitySettings;
