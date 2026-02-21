import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Radius } from '../../theme';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    radius?: number;
    style?: ViewStyle;
}

export default function Skeleton({ width, height, radius = Radius.md, style }: SkeletonProps) {
    return (
        <View
            style={[
                styles.skeleton,
                { width, height, borderRadius: radius },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E1E9EE',
    },
});
