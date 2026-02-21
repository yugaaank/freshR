import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import React, { useMemo, useState, useEffect } from 'react';
import {
    ScrollView,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';
import { useCalendarStore } from '../../src/store/calendarStore';
import { useAssignments } from '../../src/hooks/useAcademics';
import { useUserStore } from '../../src/store/userStore';
import { useEvents } from '../../src/hooks/useEvents';
import TagPill from '../../src/components/ui/TagPill';
import SearchBar from '../../src/components/ui/SearchBar';

const TODAY = dayjs();
const DATE_FORMAT = 'YYYY-MM-DD';
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(TODAY.format(DATE_FORMAT));
    const [viewMode, setViewMode] = useState<'today' | 'all'>('today');
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { customEvents, addEvent, removeEvent, hiddenAcademicIds, hideAcademicEvent } = useCalendarStore();
    const { profile, registeredEvents, unregisterEvent } = useUserStore();
    
    const { data: assignments = [], isLoading: assignmentsLoading } = useAssignments(profile?.id ?? null);
    const { data: campusEvents = [], isLoading: eventsLoading } = useEvents();

    const isLoading = (assignmentsLoading || eventsLoading) && viewMode === 'today';

    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState<'Assignment' | 'Deadline' | 'Personal' | 'Study'>('Personal');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        setEventDate(dayjs(selectedDate).toDate());
    }, [selectedDate]);

    useEffect(() => {
        const userId = profile?.id ?? '11111111-1111-1111-1111-111111111111';
        useCalendarStore.getState().fetchEvents(userId);
    }, [profile]);

    const allEvents = useMemo(() => {
        const clubEvents = campusEvents
            .filter((e: any) => registeredEvents.includes(e.id))
            .map((e: any) => ({ 
                ...e, 
                type: 'club',
                location: e.venue || e.location
            }));
            
        const userEvents = customEvents.map(e => ({ ...e, type: 'custom' }));
        
        const academicEvents = assignments
            .filter(a => !hiddenAcademicIds.includes(a.id))
            .map(a => ({
                id: a.id,
                title: `Deadline: ${a.title}`,
                date: a.due_date,
                time: '11:59 PM',
                location: a.subject_name,
                category: 'Assignment',
                type: 'academic'
            }));

        return [...clubEvents, ...userEvents, ...academicEvents];
    }, [customEvents, assignments, registeredEvents, campusEvents, hiddenAcademicIds]);

    const filteredEvents = useMemo(() => {
        if (!searchQuery.trim()) return allEvents;
        const q = searchQuery.toLowerCase();
        return allEvents.filter(e => 
            e.title.toLowerCase().includes(q) || 
            e.location?.toLowerCase().includes(q) ||
            e.category?.toLowerCase().includes(q)
        );
    }, [allEvents, searchQuery]);

    const eventsByDate = useMemo(() => {
        return filteredEvents.reduce<Record<string, any[]>>((map, event) => {
            map[event.date] = map[event.date] ?? [];
            map[event.date].push(event);
            return map;
        }, {});
    }, [filteredEvents]);

    const weekDays = useMemo(() => buildWeekDays(TODAY), []);
    const todayEvents = eventsByDate[selectedDate] ?? [];

    const sections = useMemo(
        () =>
            Object.entries(eventsByDate)
                .sort(([a], [b]) => (a > b ? 1 : -1))
                .map(([date, items]) => ({
                    title: dayjs(date).format('ddd, MMM D'),
                    data: items,
                })),
        [eventsByDate]
    );

    const handleAddEvent = () => {
        if (!newTitle.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        addEvent({
            title: newTitle,
            date: dayjs(eventDate).format(DATE_FORMAT),
            time: dayjs(eventTime).format('hh:mm A'),
            location: 'Personal',
            category: newCategory,
        }, profile?.id ?? '11111111-1111-1111-1111-111111111111');
        setNewTitle('');
        setModalVisible(false);
    };

    const handleRemoveItem = (item: any) => {
        const actionLabel = item.type === 'club' ? 'Unregister' : item.type === 'academic' ? 'Hide' : 'Delete';

        Alert.alert(`${actionLabel} Event`, `Are you sure you want to ${actionLabel.toLowerCase()} this ${item.type === 'academic' ? 'assignment' : 'event'}?`, [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: actionLabel, 
                style: 'destructive', 
                onPress: () => {
                    if (item.type === 'custom') removeEvent(item.id);
                    else if (item.type === 'club') unregisterEvent(item.id);
                    else if (item.type === 'academic') hideAcademicEvent(item.id);
                } 
            }
        ]);
    };

    const onDateChange = (_: any, selected: Date | undefined) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selected) setEventDate(selected);
    };

    const onTimeChange = (_: any, selected: Date | undefined) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selected) setEventTime(selected);
    };

    const totalEventsToday = eventsByDate[TODAY.format(DATE_FORMAT)]?.length ?? 0;

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Your Schedule,</Text>
                    <Text style={styles.nameText}>Campus Planner</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={24} color={Colors.textLight} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="always"
                stickyHeaderIndices={[1]}
            >
                <View style={styles.summaryWrap}>
                    <View style={styles.summaryIconWrap}>
                        <Ionicons name="sparkles" size={14} color={Colors.accent} />
                    </View>
                    <Text style={styles.summaryText}>
                        You have <Text style={styles.summaryHighlight}>{totalEventsToday} item{totalEventsToday !== 1 ? 's' : ''}</Text> on your agenda for today.
                    </Text>
                </View>

                <View style={styles.searchContainerSticky}>
                    <SearchBar
                        placeholder="Search your agenda..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onClear={() => setSearchQuery('')}
                    />
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
                                if (mode === 'today') setSelectedDate(TODAY.format(DATE_FORMAT));
                            }}
                        >
                            <Text style={[styles.viewToggleText, viewMode === mode && styles.viewToggleTextActive]}>
                                {mode === 'today' ? 'Daily View' : 'Full Timeline'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {isLoading ? (
                    <View style={styles.centerLoading}>
                        <ActivityIndicator color={Colors.primary} size="large" />
                    </View>
                ) : viewMode === 'today' ? (
                    <View>
                        <View style={styles.weekRowWrap}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekScrollContent}>
                                {weekDays.map((day) => {
                                    const isActive = selectedDate === day.dateStr;
                                    return (
                                        <TouchableOpacity
                                            key={day.dateStr}
                                            style={[styles.weekDay, isActive && styles.weekDayActive]}
                                            onPress={() => setSelectedDate(day.dateStr)}
                                        >
                                            <Text style={[styles.weekDayLabel, isActive && styles.weekDayTextActive]}>{day.label}</Text>
                                            <Text style={[styles.weekDayDate, isActive && styles.weekDayTextActive]}>{day.day.date()}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        <View style={styles.sectionHeaderWrap}>
                            <Text style={styles.sectionTitle}>Agenda • {dayjs(selectedDate).format('MMM D')}</Text>
                        </View>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRowContent}>
                            {todayEvents.length > 0 ? todayEvents.map((event) => {
                                return (
                                    <TouchableOpacity 
                                        key={event.id} 
                                        style={styles.eventCardWrap}
                                        onPress={() => event.type === 'club' && router.push(`/event/${event.id}` as any)}
                                    >
                                        <View style={[styles.eventCard, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                                            <View style={styles.eventCardHeader}>
                                                <Text style={[styles.eventCardTime, { color: Colors.mutedForeground }]}>{event.time}</Text>
                                                <TagPill label={event.type.toUpperCase()} variant="grey" size="sm" />
                                            </View>
                                            <Text style={[styles.eventCardTitle, { color: Colors.foreground }]} numberOfLines={2}>{event.title}</Text>
                                            <View style={styles.eventCardFooter}>
                                                <Ionicons name="location-outline" size={12} color={Colors.mutedForeground} />
                                                <Text style={[styles.eventCardLoc, { color: Colors.mutedForeground }]} numberOfLines={1}>{event.location}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }) : (
                                <View style={styles.emptyCard}>
                                    <Ionicons name="calendar-outline" size={32} color={Colors.divider} />
                                    <Text style={styles.emptyCardText}>No events for this day</Text>
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.sectionHeaderWrap}>
                            <Text style={styles.sectionTitle}>Details</Text>
                        </View>
                        <View style={styles.agendaList}>
                            {todayEvents.map((event) => {
                                return (
                                    <TouchableOpacity 
                                        key={`list-${event.id}`} 
                                        style={styles.agendaItem}
                                        onPress={() => event.type === 'club' && router.push(`/event/${event.id}` as any)}
                                        onLongPress={() => handleRemoveItem(event)}
                                    >
                                        <View style={[styles.agendaIconWrap, { backgroundColor: Colors.secondary }]}>
                                            <Ionicons name={event.type === 'academic' ? "school" : "calendar"} size={18} color={Colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.agendaItemTitle}>{event.title}</Text>
                                            <Text style={styles.agendaItemMeta}>{event.time} · {event.location}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => handleRemoveItem(event)}>
                                            <Ionicons 
                                                name={event.type === 'academic' ? "eye-off-outline" : "trash-outline"} 
                                                size={16} 
                                                color={Colors.mutedForeground} 
                                            />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                );
                            })}
                            {!todayEvents.length && (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>Nothing scheduled for today. Take a break!</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.fullTimelineWrap}>
                        <SectionList
                            scrollEnabled={false}
                            sections={sections}
                            keyExtractor={(item) => item.id}
                            renderSectionHeader={({ section }) => (
                                <Text style={styles.sectionHeader}>{section.title}</Text>
                            )}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        style={styles.timelineItem}
                                        activeOpacity={0.85}
                                        onPress={() => item.type === 'club' && router.push(`/event/${item.id}` as any)}
                                        onLongPress={() => handleRemoveItem(item)}
                                    >
                                        <View style={[styles.timelineIconWrap, { backgroundColor: Colors.secondary }]}>
                                            <Ionicons name="flash" size={16} color={Colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.timelineTitle}>{item.title}</Text>
                                            <Text style={styles.timelineMeta}>{item.time} · {item.location}</Text>
                                        </View>
                                        <TagPill 
                                            label={item.type.toUpperCase()} 
                                            variant="grey" 
                                            size="sm" 
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={styles.listContent}
                        />
                    </View>
                )}
                <View style={{ height: 120 }} />
            </ScrollView>

            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Event</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color={Colors.text} />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.inputLabel}>WHAT'S THE PLAN?</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="e.g. Study Session with Team" 
                            placeholderTextColor={Colors.textDimmed}
                            value={newTitle} 
                            onChangeText={setNewTitle} 
                        />
                        <View style={styles.pickerRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>WHEN?</Text>
                                <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowDatePicker(true)}>
                                    <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                                    <Text style={styles.pickerText}>{dayjs(eventDate).format('MMM D, YYYY')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>AT WHAT TIME?</Text>
                                <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowTimePicker(true)}>
                                    <Ionicons name="time-outline" size={18} color={Colors.primary} />
                                    <Text style={styles.pickerText}>{dayjs(eventTime).format('hh:mm A')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {showDatePicker && <DateTimePicker value={eventDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />}
                        {showTimePicker && <DateTimePicker value={eventTime} mode="time" is24Hour={false} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onTimeChange} />}
                        
                        <Text style={styles.inputLabel}>CATEGORY</Text>
                        <View style={styles.catRow}>
                            {['Assignment', 'Deadline', 'Personal', 'Study'].map((cat) => {
                                const isActive = newCategory === cat;
                                return (
                                    <TouchableOpacity key={cat} style={[styles.catPill, isActive && styles.catPillActive]} onPress={() => setNewCategory(cat as any)}>
                                        <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleAddEvent}>
                            <Text style={styles.saveBtnText}>Add to Calendar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingBottom: 110 },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: Spacing.section, 
        paddingTop: Spacing.md, 
        paddingBottom: Spacing.md, 
        backgroundColor: Colors.background 
    },
    welcomeText: { ...Typography.caption, color: Colors.textSecondary },
    nameText: { ...Typography.h2, color: Colors.text },
    addBtn: { 
        width: 40, 
        height: 40, 
        borderRadius: Radius.md, 
        backgroundColor: Colors.primary, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    summaryWrap: { 
        paddingHorizontal: Spacing.section, 
        marginBottom: Spacing.sm, 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10 
    },
    summaryIconWrap: { 
        width: 24, 
        height: 24, 
        borderRadius: Radius.pill, 
        backgroundColor: Colors.accentLight, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    summaryText: { flex: 1, ...Typography.caption, color: Colors.textSecondary },
    summaryHighlight: { color: Colors.text, fontFamily: 'Sora_700Bold' },
    searchContainerSticky: { 
        paddingHorizontal: Spacing.section, 
        paddingVertical: Spacing.sm, 
        backgroundColor: Colors.background, 
        zIndex: 10 
    },
    viewToggleRow: { 
        flexDirection: 'row', 
        paddingHorizontal: Spacing.section, 
        gap: Spacing.sm, 
        marginTop: Spacing.md,
        marginBottom: Spacing.lg 
    },
    viewToggleBtn: { 
        flex: 1,
        paddingVertical: 10, 
        borderRadius: Radius.lg, 
        backgroundColor: Colors.surface,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    viewToggleBtnActive: { 
        backgroundColor: Colors.primaryLight,
        borderColor: Colors.primary + '40',
    },
    viewToggleText: { ...Typography.caption, color: Colors.textSecondary, fontFamily: 'Sora_600SemiBold' },
    viewToggleTextActive: { color: Colors.primary, fontFamily: 'Sora_700Bold' },
    centerLoading: { height: 300, justifyContent: 'center', alignItems: 'center' },
    weekRowWrap: { marginBottom: Spacing.lg },
    weekScrollContent: { paddingHorizontal: Spacing.section, gap: Spacing.sm },
    weekDay: { 
        width: 60, 
        height: 80,
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: Radius.xl, 
        backgroundColor: Colors.surface, 
        borderWidth: 0.5, 
        borderColor: Colors.divider 
    },
    weekDayActive: { 
        backgroundColor: Colors.primary, 
        borderColor: Colors.primary,
    },
    weekDayLabel: { ...Typography.micro, color: Colors.textSecondary, marginBottom: 4 },
    weekDayDate: { ...Typography.h4, color: Colors.text },
    weekDayTextActive: { color: Colors.textLight },
    sectionHeaderWrap: { paddingHorizontal: Spacing.section, marginBottom: Spacing.md },
    sectionTitle: { ...Typography.h4, color: Colors.text },
    cardsRowContent: { paddingHorizontal: Spacing.section, gap: Spacing.md, paddingBottom: Spacing.md },
    eventCardWrap: { width: 220, height: 140 },
    eventCard: { 
        flex: 1,
        borderRadius: Radius.xxl, 
        padding: Spacing.lg, 
        borderWidth: 0.5,
        justifyContent: 'space-between',
    },
    eventCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    eventCardTime: { ...Typography.micro, fontFamily: 'Sora_700Bold' },
    eventCardTitle: { ...Typography.h5, marginTop: 8, lineHeight: 20 },
    eventCardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    eventCardLoc: { ...Typography.micro, flex: 1 },
    emptyCard: { 
        width: 220, 
        height: 140, 
        borderRadius: Radius.xxl, 
        backgroundColor: Colors.surface, 
        borderWidth: 0.5, 
        borderColor: Colors.divider,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    emptyCardText: { ...Typography.caption, color: Colors.textSecondary },
    agendaList: { paddingHorizontal: Spacing.section, gap: 12 },
    agendaItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        padding: 12, 
        borderRadius: Radius.lg, 
        backgroundColor: Colors.surface, 
        borderWidth: 0.5, 
        borderColor: Colors.divider 
    },
    agendaIconWrap: { 
        width: 36, 
        height: 36, 
        borderRadius: Radius.md, 
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    agendaItemTitle: { ...Typography.h5, fontSize: 13, color: Colors.text },
    agendaItemMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    emptyState: { paddingVertical: 40, alignItems: 'center' },
    emptyText: { ...Typography.body2, color: Colors.textSecondary, textAlign: 'center' },
    fullTimelineWrap: { paddingHorizontal: Spacing.section },
    sectionHeader: { ...Typography.micro, color: Colors.textTertiary, letterSpacing: 1, marginTop: Spacing.lg, marginBottom: Spacing.sm },
    timelineItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: Colors.divider 
    },
    timelineIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    timelineTitle: { ...Typography.h5, color: Colors.text, flex: 1 },
    timelineMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    listContent: { paddingBottom: 40 },
    modalOverlay: { flex: 1, backgroundColor: Colors.overlayDark, justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.cardBg, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl, padding: Spacing.xl, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
    modalTitle: { ...Typography.h3, color: Colors.text },
    closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
    inputLabel: { ...Typography.micro, color: Colors.textTertiary, marginBottom: 8, letterSpacing: 1 },
    input: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, color: Colors.text, fontSize: 16, borderWidth: 0.5, borderColor: Colors.divider, marginBottom: Spacing.lg },
    pickerRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
    pickerTrigger: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.surface, padding: 12, borderRadius: Radius.lg, borderWidth: 0.5, borderColor: Colors.divider },
    pickerText: { fontSize: 14, color: Colors.text, fontFamily: 'Sora_600SemiBold' },
    catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.xl },
    catPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 0.5, borderColor: Colors.divider, backgroundColor: Colors.surface },
    catPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    catText: { ...Typography.caption, color: Colors.textSecondary },
    catTextActive: { color: Colors.textLight, fontFamily: 'Sora_700Bold' },
    saveBtn: { backgroundColor: Colors.primary, borderRadius: Radius.xl, paddingVertical: Spacing.md, alignItems: 'center' },
    saveBtnText: { ...Typography.body1, color: Colors.textLight, fontFamily: 'Sora_700Bold' },
});
