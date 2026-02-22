import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Vibration,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Spacing, Typography } from '../src/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SW } = Dimensions.get('window');

const MODES = {
    WORK: { label: 'Focus', time: 25 * 60, colors: ['#0F172A', '#1E293B'] },
    SHORT_BREAK: { label: 'Short Break', time: 5 * 60, colors: ['#10B981', '#059669'] },
    LONG_BREAK: { label: 'Long Break', time: 15 * 60, colors: ['#3B82F6', '#2563EB'] },
};

export default function FocusScreen() {
    const [mode, setMode] = useState<keyof typeof MODES>('WORK');
    const [timeLeft, setTimeLeft] = useState(MODES.WORK.time);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleComplete = useCallback(() => {
        setIsActive(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate([0, 500, 200, 500]);
        alert(`${MODES[mode].label} finished!`);
    }, [mode]);

    const toggleTimer = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    };

    const switchMode = (newMode: keyof typeof MODES) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].time);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = 1 - timeLeft / MODES[mode].time;

    return (
        <SafeAreaView style={styles.safe}>
            <LinearGradient colors={MODES[mode].colors as any} style={StyleSheet.absoluteFill} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Study Focus</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.modeTabs}>
                    {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                        <TouchableOpacity 
                            key={m} 
                            style={[styles.modeTab, mode === m && styles.modeTabActive]}
                            onPress={() => switchMode(m)}
                        >
                            <Text style={[styles.modeTabText, mode === m && styles.modeTabTextActive]}>
                                {MODES[m].label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.timerContainer}>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { height: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    <Text style={styles.modeLabel}>{isActive ? 'STAY FOCUSED' : 'READY?'}</Text>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
                        <Ionicons name="refresh" size={28} color="#FFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.playBtn} onPress={toggleTimer}>
                        <Ionicons name={isActive ? "pause" : "play"} size={40} color={MODES[mode].colors[0]} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsBtn}>
                        <Ionicons name="settings-outline" size={28} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.tipsContainer}>
                    <Ionicons name="bulb-outline" size={20} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.tipText}>
                        Tip: Turn off your social media notifications for better concentration.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
    closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { ...Typography.h3, color: '#FFF' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
    modeTabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.pill, padding: 4, marginBottom: 60 },
    modeTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.pill },
    modeTabActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
    modeTabText: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', fontFamily: 'Sora_600SemiBold' },
    modeTabTextActive: { color: '#FFF' },
    timerContainer: { width: SW * 0.7, height: SW * 0.7, borderRadius: SW * 0.35, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' },
    progressBg: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
    progressFill: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' },
    timerText: { fontSize: 80, fontFamily: 'Sora_700Bold', color: '#FFF' },
    modeLabel: { ...Typography.micro, color: 'rgba(255,255,255,0.6)', letterSpacing: 4, marginTop: -10 },
    controls: { flexDirection: 'row', alignItems: 'center', gap: 40, marginTop: 60 },
    playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
    resetBtn: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
    settingsBtn: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
    tipsContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 40, marginTop: 80 },
    tipText: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', textAlign: 'center', flex: 1 },
});
