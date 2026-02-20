import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography } from '../../theme';

interface ProgressRingProps {
    progress: number; // 0–100
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    sublabel?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 7,
    color = Colors.primary,
    label,
    sublabel,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 800,
            easing: Easing.out(Easing.cubic),
        });
    }, [progress, animatedProgress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - (animatedProgress.value / 100) * circumference;
        return { strokeDashoffset };
    });

    return (
        <View style={styles.wrapper}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={Colors.sectionBg}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={[styles.labelContainer, { width: size, height: size }]}>
                {label ? <Text style={[styles.label, { color }]}>{label}</Text> : null}
                {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
    labelContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { ...Typography.h4, fontWeight: '700' },
    sublabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 1 },
});
