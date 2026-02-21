import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Line, Circle } from 'react-native-svg';
import { Colors, Radius, Spacing, Typography } from '../src/theme';
import { useLandmarks } from '../src/hooks/useLandmarks';

const { width: SW } = Dimensions.get('window');

function MockMapView({ activeLandmark, showRoute, landmarks }: { activeLandmark: string | null, showRoute: boolean, landmarks: any[] }) {
    // Map live landmarks to mock coordinates for the visual map
    const visualSlots = [
        { x: 55, y: 10, w: 30, h: 25 }, // l1
        { x: 10, y: 45, w: 20, h: 15 }, // l2
        { x: 15, y: 68, w: 30, h: 18 }, // l3
        { x: 40, y: 40, w: 25, h: 20 }, // l4
        { x: 70, y: 45, w: 20, h: 20 }, // l5
        { x: 55, y: 68, w: 35, h: 18 }, // l6
        { x: 10, y: 15, w: 35, h: 20 }, // l7
    ];

    const mapBuildings = landmarks.slice(0, 7).map((l, i) => ({
        ...l,
        x: visualSlots[i]?.x ?? 50,
        y: visualSlots[i]?.y ?? 50,
        w: visualSlots[i]?.w ?? 10,
        h: visualSlots[i]?.h ?? 10,
        label: l.name.split(' ')[0]
    }));

    const userPos = { x: 45, y: 50 };
    const targetBuilding = mapBuildings.find(b => b.id === activeLandmark);

    return (
        <View style={mapStyles.container}>
            {/* Roads */}
            <View style={[mapStyles.roadH, { top: '38%', backgroundColor: '#E2E8F0', height: 12 }]} />
            <View style={[mapStyles.roadH, { top: '62%', backgroundColor: '#E2E8F0', height: 12 }]} />
            <View style={[mapStyles.roadV, { left: '38%', backgroundColor: '#E2E8F0', width: 12 }]} />
            <View style={[mapStyles.roadV, { left: '68%', backgroundColor: '#E2E8F0', width: 12 }]} />

            {/* Buildings */}
            {mapBuildings.map((b) => {
                const isActive = activeLandmark === b.id;
                return (
                    <View
                        key={b.id}
                        style={[
                            mapStyles.building, 
                            { 
                                left: `${b.x}%`, 
                                top: `${b.y}%`, 
                                width: `${b.w}%`, 
                                height: `${b.h}%`, 
                                backgroundColor: isActive ? Colors.primaryLight : '#FFFFFF',
                                borderColor: isActive ? Colors.primary : Colors.border,
                                borderWidth: isActive ? 2 : 1,
                                zIndex: isActive ? 5 : 1,
                            }
                        ]}
                    >
                        <Text style={[mapStyles.buildingLabel, { color: isActive ? Colors.primary : Colors.textSecondary }]} numberOfLines={1}>
                            {b.label}
                        </Text>
                    </View>
                );
            })}

            {/* Path visualization */}
            {showRoute && targetBuilding && (
                <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Line 
                        x1={`${userPos.x}%`} y1={`${userPos.y}%`} 
                        x2={`${targetBuilding.x + targetBuilding.w/2}%`} 
                        y2={`${targetBuilding.y + targetBuilding.h/2}%`}
                        stroke={Colors.primary} strokeWidth="3" strokeDasharray="6,4"
                    />
                    <Circle
                        cx={`${targetBuilding.x + targetBuilding.w/2}%`}
                        cy={`${targetBuilding.y + targetBuilding.h/2}%`}
                        r="5"
                        fill={Colors.primary}
                    />
                </Svg>
            )}

            {/* User dot */}
            <View style={[mapStyles.userDot, { left: `${userPos.x}%`, top: `${userPos.y}%` }]}>
                <View style={mapStyles.userDotInner} />
                <View style={mapStyles.userDotRing} />
            </View>

            {/* Compass */}
            <View style={mapStyles.compass}>
                <Text style={mapStyles.compassN}>N</Text>
                <Ionicons name="compass-outline" size={20} color={Colors.text} />
            </View>

            {/* Zoom controls */}
            <View style={mapStyles.zoomControls}>
                <TouchableOpacity style={mapStyles.zoomBtn}>
                    <Text style={mapStyles.zoomText}>+</Text>
                </TouchableOpacity>
                <View style={mapStyles.zoomDivider} />
                <TouchableOpacity style={mapStyles.zoomBtn}>
                    <Text style={mapStyles.zoomText}>−</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const mapStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9', position: 'relative' },
    roadH: { position: 'absolute', left: 0, right: 0 },
    roadV: { position: 'absolute', top: 0, bottom: 0 },
    building: { position: 'absolute', borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
    buildingLabel: { fontSize: 9, fontWeight: '700', textAlign: 'center' },
    userDot: { position: 'absolute', alignItems: 'center', justifyContent: 'center', transform: [{ translateX: -6 }, { translateY: -6 }], zIndex: 10 },
    userDotInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, zIndex: 2 },
    userDotRing: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary + '30' },
    compass: { position: 'absolute', top: Spacing.md, left: Spacing.md, alignItems: 'center' },
    compassN: { ...Typography.label, color: Colors.error, fontWeight: '700', fontSize: 10 },
    zoomControls: {
        position: 'absolute',
        bottom: Spacing.md,
        right: Spacing.md,
        backgroundColor: '#FFFFFF',
        borderRadius: Radius.md,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    zoomBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    zoomText: { fontSize: 20, color: Colors.text },
    zoomDivider: { height: 0.5, backgroundColor: Colors.border },
});

export default function CampusMapScreen() {
    const params = useLocalSearchParams<{ highlight?: string }>();
    const [activeLandmark, setActiveLandmark] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);
    
    const { data: landmarks = [], isLoading } = useLandmarks();

    useEffect(() => {
        if (params.highlight && landmarks.length > 0) {
            setActiveLandmark(params.highlight);
            const index = landmarks.findIndex(l => l.id === params.highlight);
            if (index !== -1) {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
                }, 500);
            }
        }
    }, [params.highlight, landmarks]);

    const currentLandmark = activeLandmark ? landmarks.find((l) => l.id === activeLandmark) : null;

    const handleLandmarkPress = (id: string) => {
        if (activeLandmark === id) {
            setActiveLandmark(null);
        } else {
            setActiveLandmark(id);
            const index = landmarks.findIndex(l => l.id === id);
            if (index !== -1) {
                flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
            }
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Campus Map</Text>
                <TouchableOpacity style={styles.layersBtn}>
                    <Ionicons name="layers-outline" size={20} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
                <MockMapView activeLandmark={activeLandmark} showRoute={!!activeLandmark} landmarks={landmarks} />
            </View>

            <View style={styles.bottomSheet}>
                <View style={styles.sheetHeader}>
                    <View style={styles.sheetHandle} />
                    <Text style={styles.sheetTitle}>Landmarks</Text>
                </View>
                
                <FlatList
                    ref={flatListRef}
                    data={landmarks}
                    keyExtractor={(l) => l.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.landmarkList}
                    onScrollToIndexFailed={() => {}}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.landmarkCard, activeLandmark === item.id && styles.landmarkCardActive]}
                            onPress={() => handleLandmarkPress(item.id)}
                            activeOpacity={0.9}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={[styles.landmarkIcon, { backgroundColor: item.color + '20' }]}>
                                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                                </View>
                                <View style={styles.landmarkInfo}>
                                    <Text style={styles.landmarkName}>{item.name}</Text>
                                    <Text style={styles.landmarkMeta}>{item.category} · {item.distance}</Text>
                                </View>
                                <View style={styles.landmarkRight}>
                                    <View style={[styles.statusDot, { backgroundColor: item.available ? Colors.success : Colors.error }]} />
                                    <Text style={[styles.statusText, { color: item.available ? Colors.success : Colors.error }]}>
                                        {item.available ? "Open" : "Closed"}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.background,
    },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: Colors.divider },
    headerTitle: { ...Typography.h3, color: Colors.text, flex: 1, textAlign: 'center' },
    layersBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: Colors.divider },
    mapContainer: {
        height: 320,
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.xxl,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: Colors.background,
        borderTopLeftRadius: Radius.xxl,
        borderTopRightRadius: Radius.xxl,
        marginTop: Spacing.lg,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    sheetHeader: { alignItems: 'center', paddingVertical: Spacing.md },
    sheetHandle: { width: 40, height: 4, backgroundColor: Colors.divider, borderRadius: 2, marginBottom: 12 },
    sheetTitle: { ...Typography.h4, color: Colors.text },
    landmarkList: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.sm },
    landmarkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        padding: Spacing.md,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    landmarkCardActive: { borderColor: Colors.primary, backgroundColor: Colors.card, borderWidth: 1 },
    landmarkIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    landmarkInfo: { flex: 1 },
    landmarkName: { ...Typography.h5, color: Colors.text, fontWeight: '600' },
    landmarkMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    landmarkRight: { alignItems: 'flex-end' },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});
