import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';
import { events } from '../../src/data/events';

const TODAY = dayjs();
const DATE_FORMAT = 'YYYY-MM-DD';
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CARD_COLORS = ['#FCD34D', '#34D399', '#93C5FD', '#FCA5A5', '#A78BFA'];

const eventsByDate = events.reduce<Record<string, typeof events>>((map, event) => {
    map[event.date] = map[event.date] ?? [];
    map[event.date].push(event);
    return map;
}, {});

function buildWeekDays(date: dayjs.Dayjs) {
    const startOfWeek = date.startOf('week');
    const days = [];
    for (let idx = 0; idx < 7; idx++) {
        const day = startOfWeek.add(idx, 'day');
        days.push({
            label: WEEKDAY_NAMES[day.day()],
            day,
            dateStr: day.format(DATE_FORMAT),
        });
    }
    return days;
}

function formatCardDate(dateStr?: string) {
    return dateStr ? dayjs(dateStr).format('ddd • MMM D') : 'No date';
}

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(TODAY.format(DATE_FORMAT));
    const [viewMode, setViewMode] = useState<'today' | 'all'>('today');
    const todayEvents = eventsByDate[selectedDate] ?? [];
    const timelineCards = useMemo(() => events.slice(0, CARD_COLORS.length), []);

    const sections = useMemo(
        () =>
            Object.entries(eventsByDate)
                .sort(([a], [b]) => (a > b ? 1 : -1))
                .map(([date, items]) => ({
                    title: dayjs(date).format('ddd, MMM D'),
                    data: items,
                })),
        []
    );

    const weekRow = (
        <View style={styles.scrollRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {buildWeekDays(TODAY).map((day) => (
                    <TouchableOpacity
                        key={day.dateStr}
                        style={[
                            styles.weekDay,
                            selectedDate === day.dateStr && styles.weekDayActive,
                        ]}
                        onPress={() => setSelectedDate(day.dateStr)}
                    >
                        <Text style={styles.weekDayLabel}>{day.label}</Text>
                        <Text style={styles.weekDayDate}>{day.day.date()}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const cardsRow = (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsRow}>
            {(viewMode === 'today' ? todayEvents : timelineCards).map((eventItem, idx) => (
                <TouchableOpacity
                    key={`card-${idx}`}
                    style={[styles.card, { backgroundColor: CARD_COLORS[idx % CARD_COLORS.length] }]}
                    onPress={() => eventItem?.id && router.push(`/event/${eventItem.id}`)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.cardDate}>{formatCardDate(eventItem?.date)}</Text>
                    <Text style={styles.cardTitle}>{eventItem?.title}</Text>
                    <Text style={styles.cardMeta}>{eventItem?.time}</Text>
                </TouchableOpacity>
            ))}
            {viewMode === 'today' && todayEvents.length === 0 && (
                <View style={[styles.card, { backgroundColor: Colors.surface }]}>
                    <Text style={styles.cardTitle}>No entries scheduled</Text>
                    <Text style={styles.cardMeta}>Plan something for today!</Text>
                </View>
            )}
        </ScrollView>
    );

    const listHeader = (
        <>
            {weekRow}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Events • {TODAY.format('MMM D')}</Text>
            </View>
            {cardsRow}
        </>
    );

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLabel}>Good Morning</Text>
                    <Text style={styles.headerTitle}>Campus Planner</Text>
                </View>
            </View>
            <View style={styles.viewToggleRow}>
                {['today', 'all'].map((mode) => (
                    <TouchableOpacity
                        key={mode}
                        style={[
                            styles.viewToggleBtn,
                            viewMode === mode && styles.viewToggleBtnActive,
                        ]}
                        onPress={() => {
                            setViewMode(mode as typeof viewMode);
                            if (mode === 'today') {
                                setSelectedDate(TODAY.format(DATE_FORMAT));
                            }
                        }}
                    >
                        <Text
                            style={[
                                styles.viewToggleText,
                                viewMode === mode && styles.viewToggleTextActive,
                            ]}
                        >
                            {mode === 'today' ? 'Today' : 'Full'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {viewMode === 'today' ? (
                <ScrollView contentContainerStyle={styles.content}>
                    {weekRow}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Events • {TODAY.format('MMM D')}</Text>
                    </View>
                    {cardsRow}
                    <View style={styles.agenda}>
                        <Text style={styles.agendaTitle}>Agenda</Text>
                        {todayEvents.map((event) => (
                            <View key={event.id} style={styles.agendaCard}>
                                <View style={styles.agendaMeta}>
                                    <Text style={styles.agendaTime}>{event.time}</Text>
                                    <Text style={styles.agendaLocation}>{event.location}</Text>
                                </View>
                                <Text style={styles.agendaTitleCard}>{event.title}</Text>
                                <Text style={styles.agendaCategory}>{event.category}</Text>
                            </View>
                        ))}
                        {!todayEvents.length && (
                            <Text style={styles.empty}>No meetings today — unwind!</Text>
                        )}
                    </View>
                </ScrollView>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={listHeader}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                    )}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            activeOpacity={0.85}
                            onPress={() => router.push(`/event/${item.id}`)}
                        >
                            <View>
                                <Text style={styles.listTitle}>{item.title}</Text>
                                <Text style={styles.listMeta}>{item.time} · {item.location}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: Spacing.section,
        alignItems: 'center',
    },
    headerLabel: {
        ...Typography.body2,
        color: Colors.textSecondary,
    },
    headerTitle: {
        ...Typography.h2,
        color: Colors.text,
    },
    viewToggleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: Spacing.section,
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    viewToggleBtn: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.xxl,
        backgroundColor: Colors.surface,
    },
    viewToggleBtnActive: {
        backgroundColor: Colors.success,
    },
    viewToggleText: {
        ...Typography.body2,
        color: Colors.text,
    },
    viewToggleTextActive: {
        color: '#fff',
        fontWeight: '600' as const,
    },
    content: {
        paddingBottom: Spacing.xxxl,
        paddingTop: Spacing.sm,
    },
    scrollRow: {
        paddingHorizontal: Spacing.section,
        paddingBottom: Spacing.sm,
    },
    weekDay: {
        marginRight: Spacing.sm,
        alignItems: 'center',
        padding: Spacing.sm,
        borderRadius: Radius.xl,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.divider,
        width: 74,
    },
    weekDayActive: {
        backgroundColor: Colors.success,
        borderColor: Colors.success,
    },
    weekDayLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    weekDayDate: {
        ...Typography.h4,
        color: Colors.text,
    },
    section: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.section,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h4,
        color: Colors.text,
    },
    cardsRow: {
        paddingHorizontal: Spacing.section,
        marginTop: Spacing.md,
        paddingBottom: Spacing.md,
    },
    card: {
        width: 240,
        borderRadius: Radius.xxl,
        padding: Spacing.lg,
        marginRight: Spacing.md,
    },
    cardDate: {
        ...Typography.body2,
        color: '#0F172A',
    },
    cardTitle: {
        ...Typography.h3,
        marginTop: Spacing.sm,
        color: '#0F172A',
    },
    cardMeta: {
        ...Typography.body2,
        color: '#0F172A',
        marginTop: Spacing.xs,
    },
    agenda: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.section,
        paddingBottom: Spacing.xxxl,
    },
    agendaTitle: {
        ...Typography.h4,
        color: Colors.text,
    },
    agendaCard: {
        marginTop: Spacing.md,
        borderRadius: Radius.xxl,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.divider,
    },
    agendaMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    agendaTime: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    agendaLocation: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    agendaTitleCard: {
        ...Typography.body1,
        color: Colors.text,
        marginTop: Spacing.xs,
    },
    agendaCategory: {
        ...Typography.caption,
        color: Colors.success,
        marginTop: Spacing.xs,
    },
    empty: {
        ...Typography.body2,
        color: Colors.textSecondary,
        marginTop: Spacing.md,
        textAlign: 'center',
    },
    sectionHeader: {
        ...Typography.h5,
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
        marginLeft: Spacing.section,
        color: Colors.text,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.section,
        backgroundColor: Colors.surface,
    },
    listTitle: {
        ...Typography.body1,
        color: Colors.text,
    },
    listMeta: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    listContent: {
        paddingBottom: Spacing.xxxl,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.divider,
        marginHorizontal: Spacing.section,
    },
});
