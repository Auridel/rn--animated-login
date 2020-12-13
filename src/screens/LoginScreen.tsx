import React, {FC} from 'react';
import {Image, View, StyleSheet, Dimensions, Text} from "react-native";
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
// import {usePanGestureHandler} from "react-native-redash/lib/module/v1";

import {TapGestureHandler, State} from "react-native-gesture-handler";

const {width, height} = Dimensions.get("window");

const runTiming = (clock, value, dest) => {
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


    const buttonOpacity = new Value(1);
    const buttonY = new Value(0);

    const onHandlerChangeState = event([
        {
            nativeEvent: ({state}) =>
                block([
                    cond(
                        eq(state, State.END), [
                            set(buttonOpacity, runTiming(new Clock(), 1, 0)),
                            set(buttonY, runTiming(new Clock(), 0, 200))
                        ]
                    )
                ])
        }
    ])

    return (
        <View style={styles.container}>
            <Animated.View style={styles.imageContainer}>
                <Image source={require("../../assets/main.jpg")}
                       style={styles.image}
                />
            </Animated.View>
            <View style={styles.loginWrap}>
                <TapGestureHandler onHandlerStateChange={onHandlerChangeState}>
                    <Animated.View style={{
                        ...styles.button,
                        backgroundColor: "#fff",
                        opacity: buttonOpacity
                    }}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Animated.View>
                </TapGestureHandler>
                <TapGestureHandler>
                    <Animated.View style={
                        {...styles.button,
                            backgroundColor: "#2246a1",
                            opacity: buttonOpacity
                        }
                    }>
                        <Text style={{...styles.buttonText, color: "#fff"}}>Register</Text>
                    </Animated.View>
                </TapGestureHandler>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    loginWrap: {
        height: height / 3,
        alignItems: "center",
        justifyContent: "center"
    },
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
        width: width + 100,
        height: height + 100
    },
    image: {
        flex: 1,
        width: width,
        height: height,
        resizeMode: "cover"
    },
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
    }
})

export default LoginScreen;