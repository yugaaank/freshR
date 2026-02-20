import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '../../src/data/events';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const NOW = new Date(2025, 1, 20); // Feb 20 2025 (dev fixture)
const TODAY_STR = '2025-02-20';
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAYS_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

// ─── Category colors (light-mode friendly: subtle bg + dark text) ─────────────

const CAT_COLORS: Record<string, { bg: string; border: string; text: string; meta: string }> = {
    Tech: { bg: '#EEF2FF', border: '#6366F1', text: '#312E81', meta: '#6366F1' },
    Music: { bg: '#FDF4FF', border: '#A855F7', text: '#581C87', meta: '#A855F7' },
    Sports: { bg: '#F0FDF4', border: '#22C55E', text: '#14532D', meta: '#22C55E' },
    Cultural: { bg: '#FFF7ED', border: '#F97316', text: '#7C2D12', meta: '#F97316' },
    Workshop: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E3A8A', meta: '#3B82F6' },
    Academic: { bg: '#F0FDFA', border: '#14B8A6', text: '#134E4A', meta: '#14B8A6' },
    Drama: { bg: '#FFF1F2', border: '#F43F5E', text: '#881337', meta: '#F43F5E' },
};
const DEFAULT_CAT = { bg: '#F5F5F5', border: Colors.primary, text: Colors.text, meta: Colors.primary };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(y: number, m: number, d: number) {
    return `${y} -${String(m + 1).padStart(2, '0')} -${String(d).padStart(2, '0')} `;
}
function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

// ─── Build agenda sections ────────────────────────────────────────────────────

interface AgendaSection {
    title: string;        // "20 Feb, Thu"
    dateStr: string;
    isToday: boolean;
    isNewMonth: boolean;
    month: string;
    data: typeof events;
}

function buildAgenda(): AgendaSection[] {
    // Get all unique dates with events
    const dateSet = new Set<string>();
    events.forEach((e) => dateSet.add(e.date));
    dateSet.add(TODAY_STR); // always include today

    const sorted = Array.from(dateSet).sort();
    let lastMonth = '';
    const sections: AgendaSection[] = [];

    for (const ds of sorted) {
        const [y, m, d] = ds.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        const dayEvents = events.filter((e) => e.date === ds);
        if (dayEvents.length === 0 && ds !== TODAY_STR) continue; // skip empty days (except today)

        const month = MONTHS[date.getMonth()];
        const isNewMonth = month !== lastMonth;
        if (isNewMonth) lastMonth = month;
        const dayAbbr = DAYS_ABBR[date.getDay()];
        const daySuffix = d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th';
        sections.push({
            title: `${d}${daySuffix} ${month.slice(0, 3)}, ${dayAbbr} `,
            dateStr: ds,
            isToday: ds === TODAY_STR,
            isNewMonth,
            month: `${month} ${y} `,
            data: dayEvents,
        });
    }
    return sections;
}

// ─── Mini Month Calendar ──────────────────────────────────────────────────────

interface MiniCalProps {
    year: number;
    month: number;
    selectedDate: string;
    onSelect: (ds: string) => void;
    eventDates: Set<string>;
}

function MiniCal({ year, month, selectedDate, onSelect, eventDates }: MiniCalProps) {
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    // Build grid
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
        <View style={mc.wrap}>
            {/* Day-of-week header */}
            <View style={mc.dayRow}>
                {DAYS_SHORT.map((d, i) => (
                    <Text key={i} style={mc.dayHead}>{d}</Text>
                ))}
            </View>
            {/* Weeks */}
            {weeks.map((week, wi) => (
                <View key={wi} style={mc.weekRow}>
                    {week.map((day, di) => {
                        if (day === null) return <View key={di} style={mc.cell} />;
                        const ds = toDateStr(year, month, day);
                        const isToday = ds === TODAY_STR;
                        const isSelected = ds === selectedDate;
                        const hasEvent = eventDates.has(ds);
                        return (
                            <TouchableOpacity
                                key={di}
                                style={mc.cell}
                                onPress={() => onSelect(ds)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    mc.dayCircle,
                                    isToday && mc.todayCircle,
                                    isSelected && !isToday && mc.selectedCircle,
                                ]}>
                                    <Text style={[
                                        mc.dayNum,
                                        isToday && mc.todayNum,
                                        isSelected && !isToday && mc.selectedNum,
                                    ]}>{day}</Text>
                                </View>
                                {hasEvent && (
                                    <View style={[
                                        mc.dot,
                                        isToday && mc.dotToday,
                                    ]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const mc = StyleSheet.create({
    wrap: { paddingHorizontal: Spacing.section, paddingBottom: Spacing.sm },
    dayRow: { flexDirection: 'row', marginBottom: 4 },
    dayHead: { flex: 1, textAlign: 'center', ...Typography.micro, color: Colors.textTertiary, fontWeight: '600' as const },
    weekRow: { flexDirection: 'row' },
    cell: { flex: 1, alignItems: 'center', paddingVertical: 3 },
    dayCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    todayCircle: { backgroundColor: Colors.primary },
    selectedCircle: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.primary },
    dayNum: { ...Typography.caption, color: Colors.text, fontWeight: '500' as const },
    todayNum: { color: '#FFF', fontWeight: '700' as const },
    selectedNum: { color: Colors.primary, fontWeight: '700' as const },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 1 },
    dotToday: { backgroundColor: 'rgba(255,107,53,0.5)' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

const SECTIONS = buildAgenda();
const EVENT_DATE_SET = new Set(events.map((e) => e.date));

export default function CalendarScreen() {
    const [calYear, setCalYear] = useState(NOW.getFullYear());
    const [calMonth, setCalMonth] = useState(NOW.getMonth());
    const [selectedDate, setSelectedDate] = useState(TODAY_STR);
    const [calExpanded, setCalExpanded] = useState(true);
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const listRef = useRef<SectionList>(null);

    const monthLabel = `${MONTHS[calMonth]} ${calYear} `;

    const searchLower = search.trim().toLowerCase();

    // Filter sections based on search
    const filteredSections = useMemo(() => {
        if (!searchLower) return SECTIONS;
        return SECTIONS.map(sec => ({
            ...sec,
            data: sec.data.filter(ev =>
                ev.title.toLowerCase().includes(searchLower) ||
                ev.category.toLowerCase().includes(searchLower)
            )
        })).filter(sec => sec.data.length > 0);
    }, [searchLower]);

    const prevMonth = useCallback(() => {
        setCalMonth((m) => { if (m === 0) { setCalYear((y) => y - 1); return 11; } return m - 1; });
    }, []);
    const nextMonth = useCallback(() => {
        setCalMonth((m) => { if (m === 11) { setCalYear((y) => y + 1); return 0; } return m + 1; });
    }, []);

    const handleDaySelect = useCallback((ds: string) => {
        setSelectedDate(ds);
        const idx = SECTIONS.findIndex((s) => s.dateStr === ds);
        if (idx !== -1 && listRef.current) {
            listRef.current.scrollToLocation({ sectionIndex: idx, itemIndex: 0, animated: true, viewOffset: 0 });
        }
    }, []);

    const todayEvents = useMemo(() => events.filter((e) => e.date === TODAY_STR), []);

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* ═══ HEADER ═══ */}
            <View style={styles.header}>
                {isSearching ? (
                    <View style={styles.searchBarActive}>
                        <Ionicons name="search" size={18} color={Colors.textTertiary} />
                        <TextInput
                            autoFocus
                            style={styles.searchInput}
                            placeholder="Search events..."
                            placeholderTextColor={Colors.textTertiary}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <TouchableOpacity onPress={() => { setIsSearching(false); setSearch(''); }}>
                            <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.headerLeft}>
                            <Text style={styles.headerMonth}>{monthLabel}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => setIsSearching(true)} style={styles.navBtn}>
                                <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                                <Ionicons name="chevron-back" size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                                <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.expandBtn}
                                onPress={() => setCalExpanded((v) => !v)}
                            >
                                <Ionicons
                                    name={calExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color={Colors.textSecondary}
                                />
                            </TouchableOpacity>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>Y</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* ═══ MINI MONTH GRID (collapsible) ═══ */}
            {calExpanded && (
                <View style={styles.calCard}>
                    <MiniCal
                        year={calYear}
                        month={calMonth}
                        selectedDate={selectedDate}
                        onSelect={handleDaySelect}
                        eventDates={EVENT_DATE_SET}
                    />
                </View>
            )}

            {/* ═══ AGENDA DIVIDER ═══ */}
            <View style={styles.divider}>
                <Text style={styles.dividerText}>UPCOMING EVENTS</Text>
            </View>

            {/* ═══ AGENDA LIST ═══ */}
            <SectionList
                ref={listRef}
                sections={filteredSections}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={styles.listContent}
                renderSectionHeader={({ section }) => (
                    <View>
                        {section.isNewMonth && (
                            <View style={styles.monthBadge}>
                                <Text style={styles.monthBadgeText}>{section.month}</Text>
                            </View>
                        )}
                        <View style={[
                            styles.dayHeader,
                            section.isToday && styles.dayHeaderToday,
                        ]}>
                            <View style={[
                                styles.dayNumCircle,
                                section.isToday && styles.dayNumCircleToday,
                            ]}>
                                <Text style={[styles.dayNumBig, section.isToday && styles.dayNumBigToday]}>
                                    {section.dateStr.split('-')[2].replace(/^0/, '')}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.dayHeaderTitle, section.isToday && styles.dayHeaderTitleToday]}>
                                    {section.title.split(',')[1]?.trim() ?? ''} {section.isToday ? '· Today' : ''}
                                </Text>
                                <Text style={styles.dayEventCount}>
                                    {section.data.length === 0
                                        ? 'No events'
                                        : `${section.data.length} event${section.data.length > 1 ? 's' : ''} `}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                renderItem={({ item: ev }) => {
                    const col = CAT_COLORS[ev.category] ?? DEFAULT_CAT;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[styles.eventCard, { borderLeftColor: col.border }]}
                        >
                            <View style={[styles.eventCardBg, { backgroundColor: col.bg }]}>
                                <View style={styles.eventCardTop}>
                                    <View style={[styles.catPill, { backgroundColor: col.border }]}>
                                        <Text style={styles.catPillText}>{ev.category}</Text>
                                    </View>
                                    {ev.seatsLeft <= 15 && (
                                        <View style={styles.urgencyPill}>
                                            <Text style={styles.urgencyText}>⚡ {ev.seatsLeft} left</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.eventTitle, { color: col.text }]} numberOfLines={2}>
                                    {ev.emoji ? `${ev.emoji} ` : ''}{ev.title}
                                </Text>
                                <View style={styles.eventMeta}>
                                    <Ionicons name="time-outline" size={12} color={col.meta} />
                                    <Text style={[styles.eventMetaText, { color: col.meta }]}>{ev.time}</Text>
                                    <Text style={styles.eventMetaDot}>·</Text>
                                    <Ionicons name="location-outline" size={12} color={col.meta} />
                                    <Text style={[styles.eventMetaText, { color: col.meta }]}>{ev.venue}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

            {/* ═══ FAB ═══ */}
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={26} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F7F7F8' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.sm,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerLeft: { flex: 1 },
    headerMonth: { ...Typography.h3, color: Colors.text },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    searchBarActive: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: Radius.pill,
        paddingHorizontal: Spacing.md,
        height: 40,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        ...Typography.body2,
        color: Colors.text,
        padding: 0,
    },
    navBtn: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.surface,
    },
    expandBtn: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.surface,
    },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#34A853',
        alignItems: 'center', justifyContent: 'center',
        marginLeft: 4,
    },
    avatarText: { ...Typography.label, color: '#FFF', fontWeight: '700' as const },

    // Mini calendar card
    calCard: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingTop: Spacing.sm,
    },

    // Divider
    divider: {
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.sm,
        backgroundColor: '#F7F7F8',
    },
    dividerText: {
        ...Typography.micro,
        color: Colors.textTertiary,
        letterSpacing: 1.2,
        fontWeight: '700' as const,
    },

    // Agenda list
    listContent: { paddingBottom: 100 },

    // Month badge
    monthBadge: {
        marginHorizontal: Spacing.section,
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
        alignSelf: 'flex-start',
        backgroundColor: Colors.primary,
        borderRadius: Radius.pill,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    monthBadgeText: { ...Typography.label, color: '#FFF', fontWeight: '700' as const, fontSize: 11 },

    // Day header
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.section,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xs,
    },
    dayHeaderToday: {},
    dayNumCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#ECECEC',
        alignItems: 'center', justifyContent: 'center',
    },
    dayNumCircleToday: { backgroundColor: Colors.primary },
    dayNumBig: { ...Typography.h4, color: Colors.text, fontWeight: '700' as const },
    dayNumBigToday: { color: '#FFF' },
    dayHeaderTitle: { ...Typography.label, color: Colors.textSecondary, fontSize: 13 },
    dayHeaderTitleToday: { color: Colors.primary, fontWeight: '700' as const },
    dayEventCount: { ...Typography.micro, color: Colors.textTertiary, marginTop: 1 },

    // Event cards (Apple Calendar style: left colored border + subtle bg)
    eventCard: {
        marginHorizontal: Spacing.section,
        marginBottom: Spacing.sm,
        borderRadius: Radius.lg,
        borderLeftWidth: 4,
        overflow: 'hidden',
        ...Shadows.sm,
    },
    eventCardBg: {
        padding: Spacing.md,
        gap: 6,
    },
    eventCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    catPill: {
        borderRadius: Radius.pill,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    catPillText: { ...Typography.micro, color: '#FFF', fontWeight: '700' as const, fontSize: 9 },
    urgencyPill: {
        backgroundColor: '#FFF3E8',
        borderRadius: Radius.pill,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    urgencyText: { ...Typography.micro, color: Colors.primary, fontWeight: '700' as const, fontSize: 9 },
    eventTitle: { ...Typography.h5, lineHeight: 20 },
    eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    eventMetaText: { ...Typography.micro, fontSize: 11 },
    eventMetaDot: { ...Typography.micro, color: Colors.textTertiary },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 28,
        right: Spacing.section,
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.colored(Colors.primary),
    },
});
