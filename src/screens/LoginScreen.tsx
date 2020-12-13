import React, {FC} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    Platform,
    TouchableOpacity,
    TouchableNativeFeedback,
    KeyboardAvoidingView
} from "react-native";
import Animated, {
    block, Clock,
    clockRunning,
    cond,
    Easing,
    eq,
    event,
    set,
    startClock, stopClock,
    timing,
    Value
} from "react-native-reanimated";
import {TapGestureHandler, State} from "react-native-gesture-handler";
import Svg, {Circle, ClipPath, Image} from "react-native-svg";



const {width, height} = Dimensions.get("window");
const Touchable = Platform.OS === "android"? TouchableNativeFeedback : TouchableOpacity;

const runTiming = (clock: Clock, value: number, dest: number) => {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    }

    const config = {
        duration: 500,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    }

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position
    ]);
}

const LoginScreen: FC = () => {
    const {interpolate, Extrapolate} = Animated;

    const buttonOpacity = new Value(0);

    const buttonY = interpolate(buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [250, 0],
        extrapolate: Extrapolate.CLAMP
    })
    const bgY = interpolate(buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [-height / 2, 0],
        extrapolate: Extrapolate.CLAMP
    })
    const loginOpacity = interpolate(buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP
    })
    const loginY = interpolate(buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [-20, -250],
        extrapolate: Extrapolate.CLAMP
    })


    const onHandlerChangeState = event([
        {
            nativeEvent: ({state}) =>
                block([
                    cond(
                        eq(state, State.END), set(buttonOpacity, runTiming(new Clock(), 1, 0))
                    )
                ])
        }
    ])
    const onCloseGestureHandler = event([
        {
            nativeEvent: ({state}) =>
                block([
                    cond(
                        eq(state, State.END), set(buttonOpacity, runTiming(new Clock(), 0, 1))
                    )
                ])
        }
    ])

    return (
        <View style={styles.container}>
            <Animated.View style={{
                ...styles.imageContainer,
                transform: [{translateY: bgY}]
            }}>
                <Svg width={width}
                     height={height}
                     style={styles.image}
                >
                    <ClipPath id="clip">
                        <Circle r={height} cx={width / 2}/>
                    </ClipPath>
                    <Image href={require("../../assets/main.jpg")}
                           width={width}
                           height={height}
                           clipPath="url(#clip)"
                           preserveAspectRatio="xMidYMid slice"
                    />
                </Svg>
            </Animated.View>
            <View style={styles.loginWrap}>
                <TapGestureHandler onHandlerStateChange={onHandlerChangeState}>
                    <Animated.View style={{
                        ...styles.button,
                        backgroundColor: "#fff",
                        opacity: buttonOpacity,
                        transform: [{translateY: buttonY}]
                    }}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Animated.View>
                </TapGestureHandler>
                <TapGestureHandler>
                    <Animated.View style={
                        {...styles.button,
                            backgroundColor: "#2246a1",
                            opacity: buttonOpacity,
                            transform: [{translateY: buttonY}]
                        }
                    }>
                        <Text style={{...styles.buttonText, color: "#fff"}}>Register</Text>
                    </Animated.View>
                </TapGestureHandler>
                <Animated.View style={{
                                    ...styles.inputsWrapper,
                                    opacity: loginOpacity,
                                    transform: [{translateY: loginY}]}}
                >
                    <TapGestureHandler onHandlerStateChange={onCloseGestureHandler}>
                        <Animated.View style={styles.closeWrapper}>
                            <Svg style={styles.close}>
                                <Image href={require("../../assets/close.png")} height={15} width={15} />
                            </Svg>
                        </Animated.View>
                    </TapGestureHandler>
                    <TextInput style={{
                            ...styles.input}}
                               placeholder="Enter your login"
                    />
                    <TextInput style={{
                            ...styles.input}}
                               placeholder="Enter your password"
                    />
                    <Touchable onPress={() => console.log("pressed")}
                               activeOpacity={0.8}>
                        <View style={{
                            ...styles.button,
                            backgroundColor: "#fff"}}
                        >
                            <Text style={styles.buttonText}>Sign in</Text>
                        </View>
                    </Touchable>
                </Animated.View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        width
    },
    loginWrap: {
        width,
        height: height / 2.5,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
        // top: 20,
        zIndex: -1,
        width: width + 100,
        height: height + 200
    },
    image: {},
    button: {
        width: width * 0.7,
        paddingVertical: 20,
        marginBottom: 20,
        borderRadius: (width * 0.7) / 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 20,
        textTransform: "uppercase",
        textAlign: "center"
    },
    inputsWrapper: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: 40,
        width,
        alignItems: "center"
    },
    input: {
        width: width * 0.7,
        marginBottom: 20,
        borderRadius: (width * 0.7) / 2,
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        fontSize: 16,
        textAlign: "center"
    },
    closeWrapper: {
        ...StyleSheet.absoluteFillObject,
        top: -40,
        left: width / 2 - 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    close: {
        width: 15,
        height: 15,
        resizeMode: "contain"
    }
})

export default LoginScreen;