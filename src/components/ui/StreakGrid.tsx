import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { StreakDay } from '../../store/challengeStore';
import { Colors, Radius } from '../../theme';

interface StreakGridProps {
    data: StreakDay[];
    style?: ViewStyle;
}

const CELL_SIZE = 10;
const CELL_GAP = 3;

function getColor(solved: number): string {
    if (solved === 0) return Colors.surface;
    if (solved === 1) return '#0e4429'; // GitHub Dark L1
    if (solved === 2) return '#006d21'; // GitHub Dark L2
    return '#26a641'; // GitHub Dark L3
}

export default function StreakGrid({ data, style }: StreakGridProps) {
    // Group into weeks (columns of 7)
    const weeks: StreakDay[][] = [];
    for (let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7));
    }

    const cellAnims = useRef(data.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.stagger(
            30,
            cellAnims.map(anim =>
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            )
        ).start();
    }, [cellAnims]);

    let flatIndex = 0;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={style}
            contentContainerStyle={styles.scrollContent}
        >
            {weeks.map((week, wi) => (
                <View key={wi} style={styles.week}>
                    {week.map((day, di) => {
                        const opacity = cellAnims[flatIndex++];
                        return (
                            <Animated.View
                                key={di}
                                style={[
                                    styles.cell,
                                    { backgroundColor: getColor(day.solved) },
                                    day.isToday && styles.todayCell,
                                    { opacity },
                                ]}
                            />
                        );
                    })}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { paddingRight: 8 },
    week: { flexDirection: 'column', gap: CELL_GAP, marginRight: CELL_GAP },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: Radius.sm / 2,
    },
    todayCell: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
});
