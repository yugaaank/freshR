import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TagPill from '../src/components/ui/TagPill';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const LANDMARKS = [
    { id: 'l1', name: 'Main Library', category: 'Academic', floor: 'Ground + 3 floors', distance: '200m', icon: '📚', color: Colors.tagBlue, available: true, opens: '8 AM–10 PM' },
    { id: 'l2', name: 'Canteen Central', category: 'Food', floor: 'Ground Floor', distance: '50m', icon: '🍽️', color: Colors.tagOrange, available: true, opens: '7 AM–10 PM' },
    { id: 'l3', name: 'Sports Complex', category: 'Sports', floor: 'Ground + 2 floors', distance: '500m', icon: '⚽', color: Colors.tagGreen, available: true, opens: '6 AM–9 PM' },
    { id: 'l4', name: 'Innovation Hub', category: 'Tech', floor: 'Level 2', distance: '300m', icon: '💡', color: Colors.tagPurple, available: true, opens: '9 AM–8 PM' },
    { id: 'l5', name: 'Medical Centre', category: 'Health', floor: 'Ground Floor', distance: '150m', icon: '🏥', color: Colors.tagRed, available: false, opens: 'Closed now' },
    { id: 'l6', name: 'Auditorium A', category: 'Events', floor: 'Ground Floor', distance: '400m', icon: '🎭', color: Colors.tagPurple, available: true, opens: '8 AM–11 PM' },
    { id: 'l7', name: 'ATM & Bank', category: 'Finance', floor: 'Admin Block', distance: '250m', icon: '🏦', color: Colors.tagGreen, available: true, opens: '24/7' },
    { id: 'l8', name: 'Girls Hostel A', category: 'Hostel', floor: 'Block A', distance: '700m', icon: '🏠', color: Colors.tagBlue, available: true, opens: 'Check-in 24/7' },
];

const CATEGORY_FILTERS = ['All', 'Academic', 'Food', 'Sports', 'Tech', 'Health', 'Events'];

// Mock map tiles to simulate a campus map
function MockMapView({ activeLandmark }: { activeLandmark: string | null }) {
    const mockBuildings = [
        { x: '10%', y: '15%', w: '35%', h: '20%', color: '#E8F0FE', label: 'CS Block' },
        { x: '55%', y: '10%', w: '30%', h: '25%', color: '#E8F7EF', label: 'Library' },
        { x: '10%', y: '45%', w: '20%', h: '15%', color: '#FFF3E8', label: 'Canteen' },
        { x: '40%', y: '40%', w: '25%', h: '20%', color: '#F3E8FF', label: 'Innovation Hub' },
        { x: '70%', y: '45%', w: '20%', h: '20%', color: '#FDECEA', label: 'Medical' },
        { x: '15%', y: '68%', w: '30%', h: '18%', color: '#E8F7EF', label: 'Sports Complex' },
        { x: '55%', y: '68%', w: '35%', h: '18%', color: '#E8F0FE', label: 'Auditorium' },
    ];

    return (
        <View style={mapStyles.container}>
            {/* Roads */}
            <View style={[mapStyles.roadH, { top: '38%' }]} />
            <View style={[mapStyles.roadH, { top: '62%' }]} />
            <View style={[mapStyles.roadV, { left: '38%' }]} />
            <View style={[mapStyles.roadV, { left: '68%' }]} />

            {/* Buildings */}
            {mockBuildings.map((b) => (
                <View
                    key={b.label}
                    style={[mapStyles.building, { left: b.x as any, top: b.y as any, width: b.w as any, height: b.h as any, backgroundColor: b.color }]}
                >
                    <Text style={mapStyles.buildingLabel} numberOfLines={1}>{b.label}</Text>
                </View>
            ))}

            {/* User dot */}
            <View style={mapStyles.userDot}>
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
    container: { flex: 1, backgroundColor: '#F7F8FA', position: 'relative' },
    roadH: { position: 'absolute', left: 0, right: 0, height: 10, backgroundColor: '#E0E0E0' },
    roadV: { position: 'absolute', top: 0, bottom: 0, width: 10, backgroundColor: '#E0E0E0' },
    building: { position: 'absolute', borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
    buildingLabel: { fontSize: 8, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },
    userDot: { position: 'absolute', top: '50%', left: '45%', alignItems: 'center', justifyContent: 'center' },
    userDotInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, zIndex: 2 },
    userDotRing: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(252,128,25,0.25)' },
    compass: { position: 'absolute', top: Spacing.md, left: Spacing.md, alignItems: 'center' },
    compassN: { ...Typography.label, color: Colors.error, fontWeight: '700', fontSize: 10 },
    zoomControls: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        backgroundColor: Colors.cardBg,
        borderRadius: Radius.sm,
        ...Shadows.sm,
        overflow: 'hidden',
    },
    zoomBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    zoomText: { ...Typography.h4, color: Colors.text },
    zoomDivider: { height: 1, backgroundColor: Colors.divider },
});

export default function CampusMapScreen() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeLandmark, setActiveLandmark] = useState<string | null>(null);

    const filtered = LANDMARKS.filter(
        (l) => activeCategory === 'All' || l.category === activeCategory
    );

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Campus Map 🗺️</Text>
                <TouchableOpacity style={styles.layersBtn}>
                    <Ionicons name="layers-outline" size={20} color={Colors.text} />
                </TouchableOpacity>
            </View>

            {/* Map Takes Upper Half */}
            <View style={styles.mapContainer}>
                <MockMapView activeLandmark={activeLandmark} />
            </View>

            {/* Bottom Sheet */}
            <View style={[styles.bottomSheet, Shadows.floating]}>
                {/* Category Filter */}
                <FlatList
                    horizontal
                    data={CATEGORY_FILTERS}
                    keyExtractor={(c) => c}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                    renderItem={({ item: cat }) => (
                        <TouchableOpacity
                            style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Landmark List */}
                <FlatList
                    data={filtered}
                    keyExtractor={(l) => l.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.landmarkList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.landmarkCard, activeLandmark === item.id && styles.landmarkCardActive, Shadows.sm]}
                            onPress={() => setActiveLandmark(activeLandmark === item.id ? null : item.id)}
                            activeOpacity={0.9}
                        >
                            <View style={[styles.landmarkIcon, { backgroundColor: item.color }]}>
                                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                            </View>
                            <View style={styles.landmarkInfo}>
                                <Text style={styles.landmarkName}>{item.name}</Text>
                                <Text style={styles.landmarkMeta}>{item.floor} · {item.distance}</Text>
                                <Text style={[styles.landmarkStatus, { color: item.available ? Colors.success : Colors.error }]}>
                                    {item.opens}
                                </Text>
                            </View>
                            <View style={styles.landmarkRight}>
                                <TagPill label={item.category} variant="blue" size="sm" />
                                <Ionicons name="navigate-outline" size={18} color={Colors.primary} style={{ marginTop: 6 }} />
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
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.background,
        zIndex: 10,
    },
    headerTitle: { ...Typography.h3, color: Colors.text },
    layersBtn: {
        width: 36,
        height: 36,
        borderRadius: Radius.sm,
        backgroundColor: Colors.sectionBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: { height: 260 },
    bottomSheet: {
        flex: 1,
        backgroundColor: Colors.cardBg,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        paddingTop: Spacing.md,
        marginTop: -Radius.xl,
    },
    filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.sm },
    filterChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs + 2,
        borderRadius: Radius.pill,
        backgroundColor: Colors.sectionBg,
    },
    filterChipActive: { backgroundColor: Colors.primaryLight },
    filterText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
    filterTextActive: { color: Colors.primary },
    landmarkList: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.sm },
    landmarkCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.cardBg,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    landmarkCardActive: { borderColor: Colors.primary },
    landmarkIcon: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    landmarkInfo: { flex: 1, gap: 3 },
    landmarkName: { ...Typography.h5, color: Colors.text },
    landmarkMeta: { ...Typography.caption, color: Colors.textSecondary },
    landmarkStatus: { ...Typography.caption, fontWeight: '600' },
    landmarkRight: { alignItems: 'flex-end', marginLeft: Spacing.sm },
});
