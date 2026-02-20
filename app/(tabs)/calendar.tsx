import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import TagPill from '../../src/components/ui/TagPill';
import { events } from '../../src/data/events';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

const EVENT_COLORS: Record<string, string> = {
    Tech: Colors.info,
    Music: Colors.primary,
    Sports: Colors.success,
    Cultural: '#7B1FA2',
    Workshop: Colors.warning,
    Academic: Colors.info,
    Drama: '#7B1FA2',
};

// Build a map of date string → event categories
const eventsByDate: Record<string, string[]> = {};
events.forEach((e) => {
    const key = e.date;
    if (!eventsByDate[key]) eventsByDate[key] = [];
    eventsByDate[key].push(e.category);
});

export default function CalendarScreen() {
    const today = new Date('2025-02-20');
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    const selectedEvents = events.filter((e) => e.date === selectedDate);

    const prevMonth = () => {
        if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Calendar 📅</Text>
                </View>

                {/* Month Nav */}
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                        <Ionicons name="chevron-back" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
                    <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                        <Ionicons name="chevron-forward" size={20} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarCard}>
                    {/* Day headers */}
                    <View style={styles.dayHeaders}>
                        {DAYS.map((d) => (
                            <Text key={d} style={styles.dayHeader}>{d}</Text>
                        ))}
                    </View>

                    {/* Cells */}
                    <View style={styles.grid}>
                        {cells.map((day, idx) => {
                            if (day === null) return <View key={`empty-${idx}`} style={styles.cell} />;
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isToday = dateStr === today.toISOString().split('T')[0];
                            const isSelected = dateStr === selectedDate;
                            const dayEvents = eventsByDate[dateStr] ?? [];

                            return (
                                <TouchableOpacity
                                    key={dateStr}
                                    style={[styles.cell, isSelected && styles.cellSelected, isToday && !isSelected && styles.cellToday]}
                                    onPress={() => setSelectedDate(dateStr)}
                                >
                                    <Text style={[styles.dayNum, isSelected && styles.dayNumSelected, isToday && !isSelected && styles.dayNumToday]}>
                                        {day}
                                    </Text>
                                    {dayEvents.length > 0 && (
                                        <View style={styles.dotsRow}>
                                            {dayEvents.slice(0, 3).map((cat, i) => (
                                                <View key={i} style={[styles.dot, { backgroundColor: isSelected ? '#FFF' : EVENT_COLORS[cat] ?? Colors.primary }]} />
                                            ))}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Selected Day Events */}
                <View style={styles.timelineSection}>
                    <View style={styles.timelineHeader}>
                        <Text style={styles.timelineTitle}>
                            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </Text>
                        <Text style={styles.timelineCount}>
                            {selectedEvents.length > 0 ? `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''}` : 'Free day 🎉'}
                        </Text>
                    </View>

                    {selectedEvents.length === 0 && (
                        <View style={styles.emptyDay}>
                            <Text style={styles.emptyDayEmoji}>🌿</Text>
                            <Text style={styles.emptyDayText}>No events scheduled</Text>
                            <Text style={styles.emptyDayHint}>Enjoy your free time!</Text>
                        </View>
                    )}

                    {selectedEvents.map((event) => (
                        <Card key={event.id} style={styles.eventCard} padding={Spacing.md} shadow="sm">
                            <View style={[styles.eventColorBar, { backgroundColor: EVENT_COLORS[event.category] ?? Colors.primary }]} />
                            <View style={styles.eventInfo}>
                                <View style={styles.eventTopRow}>
                                    <Text style={styles.eventTime}>{event.time}</Text>
                                    <TagPill label={event.category} variant="blue" size="sm" />
                                </View>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <View style={styles.eventMeta}>
                                    <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                                    <Text style={styles.eventMetaText}>{event.venue}</Text>
                                </View>
                                <View style={styles.eventFooter}>
                                    <Text style={styles.eventPrice}>
                                        {event.tickets[0].price === 0 ? 'Free' : `₹${event.tickets[0].price}`}
                                    </Text>
                                    {event.seatsLeft < 20 && (
                                        <Text style={styles.seatsLeft}>⚡ {event.seatsLeft} left</Text>
                                    )}
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.sectionBg },
    pageHeader: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.background,
    },
    pageTitle: { ...Typography.h2, color: Colors.text },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.background,
    },
    navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.sectionBg, alignItems: 'center', justifyContent: 'center' },
    monthTitle: { ...Typography.h3, color: Colors.text },
    calendarCard: {
        backgroundColor: Colors.cardBg,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        borderRadius: Radius.xl,
        padding: Spacing.md,
        ...Shadows.sm,
        marginBottom: Spacing.md,
    },
    dayHeaders: { flexDirection: 'row', marginBottom: Spacing.xs },
    dayHeader: {
        flex: 1,
        textAlign: 'center',
        ...Typography.label,
        color: Colors.textSecondary,
        paddingVertical: Spacing.xs,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radius.md,
        padding: 3,
    },
    cellSelected: { backgroundColor: Colors.primary },
    cellToday: { backgroundColor: Colors.primaryLight },
    dayNum: { ...Typography.body2, color: Colors.text, fontWeight: '500' },
    dayNumSelected: { color: '#FFF', fontWeight: '700' },
    dayNumToday: { color: Colors.primary, fontWeight: '700' },
    dotsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
    dot: { width: 4, height: 4, borderRadius: 2 },
    timelineSection: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
    timelineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    timelineTitle: { ...Typography.h4, color: Colors.text },
    timelineCount: { ...Typography.body2, color: Colors.textSecondary },
    emptyDay: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
    emptyDayEmoji: { fontSize: 40 },
    emptyDayText: { ...Typography.h4, color: Colors.text },
    emptyDayHint: { ...Typography.body2, color: Colors.textSecondary },
    eventCard: { paddingLeft: 0, flexDirection: 'row', overflow: 'hidden' },
    eventColorBar: { width: 4, marginRight: Spacing.md, borderTopLeftRadius: Radius.md, borderBottomLeftRadius: Radius.md },
    eventInfo: { flex: 1, gap: 5 },
    eventTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    eventTime: { ...Typography.label, color: Colors.textSecondary, fontWeight: '600' },
    eventTitle: { ...Typography.h5, color: Colors.text },
    eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    eventMetaText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
    eventFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    eventPrice: { ...Typography.body2, color: Colors.primary, fontWeight: '700' },
    seatsLeft: { ...Typography.caption, color: Colors.error, fontWeight: '600' },
});
