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
    Switch,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';
import { useCalendarStore } from '../../src/store/calendarStore';
import { useAssignments } from '../../src/hooks/useAcademics';
import { useUserStore } from '../../src/store/userStore';
import { useEvents } from '../../src/hooks/useEvents';
import { 
    usePersonalEvents, 
    useCreateCalendarEvent, 
    useDeleteCalendarEvent 
} from '../../src/hooks/useCalendar';
import TagPill from '../../src/components/ui/TagPill';
import SearchBar from '../../src/components/ui/SearchBar';
import Card from '../../src/components/ui/Card';

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
    const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
    const [currentWeekStart, setCurrentWeekStart] = useState(TODAY.startOf('week'));
    const [currentMonth, setCurrentMonth] = useState(TODAY.startOf('month'));

    const { hiddenAcademicIds, hideAcademicEvent } = useCalendarStore();
    const { profile, registeredEvents, unregisterEvent } = useUserStore();
    
    const userId = profile?.id ?? '11111111-1111-1111-1111-111111111111';
    
    // DB Source of Truth via Hooks
    const { data: assignments = [], isLoading: assignmentsLoading } = useAssignments(userId);
    const { data: campusEvents = [], isLoading: eventsLoading } = useEvents();
    const { data: personalEvents = [], isLoading: personalLoading } = usePersonalEvents(userId);
    
    const createEventMutation = useCreateCalendarEvent(userId);
    const deleteEventMutation = useDeleteCalendarEvent(userId);

    const calendarDays = useMemo(() => {
        const start = currentMonth.startOf('month').startOf('week');
        const end = currentMonth.endOf('month').endOf('week');
        const days = [];
        let curr = start;
        while (curr.isBefore(end) || curr.isSame(end, 'day')) {
            days.push(curr);
            curr = curr.add(1, 'day');
        }
        return days;
    }, [currentMonth]);

    const changeMonth = (offset: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrentMonth(prev => prev.add(offset, 'month'));
    };

    const weekDays = useMemo(() => buildWeekDays(currentWeekStart), [currentWeekStart]);

    const changeWeek = (offset: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrentWeekStart(prev => prev.add(offset, 'week'));
    };

    const resetToToday = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCurrentWeekStart(TODAY.startOf('week'));
        setSelectedDate(TODAY.format(DATE_FORMAT));
    };

    const isLoading = (assignmentsLoading || eventsLoading || personalLoading) && viewMode === 'today';

    const handleRemoveItem = (item: any) => {
        const actionLabel = item.type === 'club' ? 'Unregister' : item.type === 'academic' ? 'Hide' : 'Delete';

        Alert.alert(`${actionLabel} Event`, `Are you sure you want to ${actionLabel.toLowerCase()} this ${item.type === 'academic' ? 'assignment' : 'event'}?`, [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: actionLabel, 
                style: 'destructive', 
                onPress: async () => {
                    if (item.type === 'custom') await deleteEventMutation.mutateAsync(item.id);
                    else if (item.type === 'club') unregisterEvent(item.id);
                    else if (item.type === 'academic') hideAcademicEvent(item.id);
                } 
            }
        ]);
    };

    const handleEditItem = (item: any) => {
        // Entry point for edit - for now just alert
        Alert.alert('Edit Feature', `Editing logic for "${item.title}" is being integrated.`);
    };

    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('Personal');
    const [newPriority, setNewPriority] = useState('Medium');
    const [newNotes, setNewNotes] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [estimatedEffort, setEstimatedEffort] = useState('1');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        setEventDate(dayjs(selectedDate).toDate());
    }, [selectedDate]);

    const getCategoryColor = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'exam': return '#EF4444';
            case 'deadline': return '#F59E0B';
            case 'event': return '#3B82F6';
            case 'assignment': return '#8B5CF6';
            case 'study': return '#10B981';
            default: return Colors.primary;
        }
    };

    const handleAddEvent = async () => {
        if (!newTitle.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        
        try {
            await createEventMutation.mutateAsync({
                title: newTitle,
                date: dayjs(eventDate).format(DATE_FORMAT),
                time: isAllDay ? null : dayjs(eventTime).format('hh:mm A'),
                location: 'Campus',
                category: newCategory,
                priority: newPriority,
                notes: newNotes,
                is_all_day: isAllDay,
                estimated_effort: parseInt(estimatedEffort) || 1,
                progress: 0,
                difficulty: 3,
                attachments: [],
                tags: [],
                subtasks: [],
                recurring: null,
                due_date: null,
            });
            
            setNewTitle('');
            setNewNotes('');
            setModalVisible(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (err: any) {
            console.error('[Calendar Debug] Save failed:', err);
            Alert.alert('Error', `Failed to save event: ${err.message || 'Unknown error'}`);
        }
    };

    const onDateChange = (_: any, selected: Date | undefined) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selected) setEventDate(selected);
    };

    const onTimeChange = (_: any, selected: Date | undefined) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selected) setEventTime(selected);
    };

    const allEvents = useMemo(() => {
        // Strict normalization: extract only YYYY-MM-DD from any date input
        const normalize = (d: any) => d ? dayjs(d).format(DATE_FORMAT) : '';

        const clubEvents = (campusEvents || [])
            .filter((e: any) => registeredEvents.includes(e.id))
            .map((e: any) => ({ 
                ...e, 
                type: 'club',
                location: e.venue || e.location,
                priority: 'High',
                color: '#3B82F6',
                date: normalize(e.date)
            }));
            
        const userEvents = (personalEvents || []).map(e => ({ 
            ...e, 
            type: 'custom',
            color: getCategoryColor(e.category),
            date: normalize(e.date)
        }));
        
        const academicEvents = (assignments || [])
            .filter(a => !hiddenAcademicIds.includes(a.id))
            .map(a => ({
                id: a.id,
                title: `Deadline: ${a.title}`,
                date: normalize(a.due_date),
                time: '11:59 PM',
                location: a.subject_name,
                category: 'Assignment',
                type: 'academic',
                priority: 'High',
                color: '#8B5CF6'
            }));

        return [...clubEvents, ...userEvents, ...academicEvents];
    }, [personalEvents, assignments, registeredEvents, campusEvents, hiddenAcademicIds]);

    const filteredEvents = useMemo(() => {
        let all = allEvents;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            all = all.filter(e => 
                e.title.toLowerCase().includes(q) || 
                e.location?.toLowerCase().includes(q) ||
                e.category?.toLowerCase().includes(q)
            );
        }
        if (priorityFilter !== 'All') {
            all = all.filter(e => e.priority === priorityFilter);
        }
        return all;
    }, [allEvents, searchQuery, priorityFilter]);

    const eventsByDate = useMemo(() => {
        const map: Record<string, any[]> = {};
        filteredEvents.forEach(event => {
            const dateKey = event.date; // already normalized string
            if (dateKey) {
                if (!map[dateKey]) map[dateKey] = [];
                map[dateKey].push(event);
            }
        });
        return map;
    }, [filteredEvents]);

    // In Full Timeline, sections should show all events.
    // In Daily View, todayEvents shows only the selected date.
    const todayEvents = useMemo(() => eventsByDate[selectedDate] ?? [], [eventsByDate, selectedDate]);

    const sections = useMemo(() => {
        return Object.keys(eventsByDate)
            .sort()
            .map(date => ({
                title: dayjs(date).format('dddd, MMM D').toUpperCase(),
                data: eventsByDate[date],
                date
            }));
    }, [eventsByDate]);

    const totalEventsToday = useMemo(() => {
        const todayKey = TODAY.format(DATE_FORMAT);
        return eventsByDate[todayKey]?.length ?? 0;
    }, [eventsByDate]);

    return (
        <SafeAreaView style={styles.safe} edges={['top']} key={`calendar-${registeredEvents.length}`}>
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

                <View style={styles.filterRowPriority}>
                    {(['All', 'High', 'Medium', 'Low'] as const).map((p) => {
                        const isActive = priorityFilter === p;
                        const pColor = p === 'High' ? Colors.error : p === 'Medium' ? Colors.warning : p === 'Low' ? Colors.success : Colors.primary;
                        return (
                            <TouchableOpacity 
                                key={p} 
                                style={[styles.filterChipSmall, isActive && { backgroundColor: pColor, borderColor: pColor }]}
                                onPress={() => setPriorityFilter(p)}
                            >
                                <Text style={[styles.filterChipTextSmall, isActive && { color: '#FFF' }]}>{p}</Text>
                            </TouchableOpacity>
                        );
                    })}
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
                                {mode === 'today' ? 'Weekly View' : 'Schedule List'}
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
                            <View style={styles.weekNavHeader}>
                                <TouchableOpacity onPress={() => changeWeek(-1)} style={styles.weekNavBtn}>
                                    <Ionicons name="chevron-back" size={18} color={Colors.text} />
                                </TouchableOpacity>
                                <View style={styles.weekInfo}>
                                    <Text style={styles.weekMonthText}>
                                        {currentWeekStart.format('MMMM YYYY')}
                                    </Text>
                                    {!currentWeekStart.isSame(TODAY, 'week') && (
                                        <TouchableOpacity onPress={resetToToday} style={styles.todayLabelBtn}>
                                            <Text style={styles.todayLabelText}>TODAY</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => changeWeek(1)} style={styles.weekNavBtn}>
                                    <Ionicons name="chevron-forward" size={18} color={Colors.text} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.weekStripContainer}>
                                {weekDays.map((day) => {
                                    const dateStr = day.dateStr;
                                    const isActive = selectedDate === dateStr;
                                    const dayEvents = eventsByDate[dateStr] ?? [];
                                    const hasEvents = dayEvents.length > 0;

                                    // Determine highest priority for the day
                                    let maxPriority = 'Low';
                                    if (dayEvents.some(e => e.priority === 'High')) maxPriority = 'High';
                                    else if (dayEvents.some(e => e.priority === 'Medium')) maxPriority = 'Medium';

                                    let priorityColor = Colors.success;
                                    if (maxPriority === 'High') priorityColor = Colors.error;
                                    else if (maxPriority === 'Medium') priorityColor = Colors.warning;

                                    return (
                                        <TouchableOpacity
                                            key={dateStr}
                                            style={[styles.weekDay, isActive && styles.weekDayActive]}
                                            onPress={() => setSelectedDate(dateStr)}
                                        >
                                            <Text style={[styles.weekDayLabel, isActive && styles.weekDayTextActive]}>{day.label}</Text>
                                            <Text style={[styles.weekDayDate, isActive && styles.weekDayTextActive]}>{day.day.date()}</Text>
                                            {hasEvents && (
                                                <View style={[
                                                    styles.weekEventDot, 
                                                    { backgroundColor: isActive ? '#FFF' : priorityColor }
                                                ]} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
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
                                        onPress={() => event.type === 'club' ? router.push(`/event/${event.id}` as any) : null}
                                    >
                                        <View style={[styles.eventCard, { backgroundColor: Colors.card, borderLeftWidth: 4, borderLeftColor: event.color || Colors.primary, borderColor: Colors.border }]}>
                                            <View style={styles.eventCardHeader}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                    <View style={[styles.priorityDot, { backgroundColor: event.priority === 'High' ? Colors.error : event.priority === 'Medium' ? Colors.warning : Colors.success }]} />
                                                    <Text style={[styles.eventCardTime, { color: Colors.mutedForeground }]}>{event.time || 'All Day'}</Text>
                                                </View>
                                                <TagPill label={event.category?.toUpperCase() || event.type.toUpperCase()} variant="grey" size="sm" />
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
                                        style={[styles.agendaItem, { borderLeftWidth: 4, borderLeftColor: event.color || Colors.primary }]}
                                        onPress={() => event.type === 'club' && router.push(`/event/${event.id}` as any)}
                                        onLongPress={() => handleRemoveItem(event)}
                                    >
                                        <View style={[styles.agendaIconWrap, { backgroundColor: Colors.secondary }]}>
                                            <Ionicons name={event.type === 'academic' ? "school" : event.category === 'Exam' ? "document-text" : "calendar"} size={18} color={event.color || Colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <View style={[styles.priorityDot, { backgroundColor: event.priority === 'High' ? Colors.error : event.priority === 'Medium' ? Colors.warning : Colors.success }]} />
                                                <Text style={styles.agendaItemTitle}>{event.title}</Text>
                                            </View>
                                            <Text style={styles.agendaItemMeta}>{event.time || 'All Day'} · {event.location}</Text>
                                            
                                            {event.subtasks && event.subtasks.length > 0 && (
                                                <View style={styles.subtasksList}>
                                                    {event.subtasks.map((st: any, idx: number) => (
                                                        <View key={st.id || idx} style={styles.subtaskItem}>
                                                            <Ionicons 
                                                                name={st.completed ? "checkbox" : "square-outline"} 
                                                                size={14} 
                                                                color={st.completed ? Colors.success : Colors.mutedForeground} 
                                                            />
                                                            <Text style={[styles.subtaskText, st.completed && styles.subtaskTextDone]}>{st.title}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            <View style={styles.itemActionRow}>
                                                {event.type === 'custom' && (
                                                    <TouchableOpacity onPress={() => handleEditItem(event)} style={styles.itemActionBtn}>
                                                        <Ionicons name="pencil" size={14} color={Colors.primary} />
                                                        <Text style={styles.itemActionText}>Edit</Text>
                                                    </TouchableOpacity>
                                                )}
                                                <TouchableOpacity onPress={() => handleRemoveItem(event)} style={[styles.itemActionBtn, { backgroundColor: Colors.errorLight }]}>
                                                    <Ionicons 
                                                        name={event.type === 'academic' ? "eye-off" : "trash"} 
                                                        size={14} 
                                                        color={Colors.error} 
                                                    />
                                                    <Text style={[styles.itemActionText, { color: Colors.error }]}>
                                                        {event.type === 'club' ? 'Unregister' : event.type === 'academic' ? 'Hide' : 'Delete'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
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
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthNavBtn}>
                                <Ionicons name="chevron-back" size={20} color={Colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.currentMonthText}>{currentMonth.format('MMMM YYYY')}</Text>
                            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthNavBtn}>
                                <Ionicons name="chevron-forward" size={20} color={Colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.calendarGrid}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <Text key={i} style={styles.weekdayLabel}>{day}</Text>
                            ))}
                            {calendarDays.map((day, i) => {
                                const dateStr = day.format(DATE_FORMAT);
                                const isSelected = dateStr === selectedDate;
                                const isCurrentMonth = day.isSame(currentMonth, 'month');
                                const dayEvents = eventsByDate[dateStr] ?? [];
                                const hasEvents = dayEvents.length > 0;
                                
                                // Determine highest priority for the day
                                let maxPriority = 'Low';
                                if (dayEvents.some(e => e.priority === 'High')) maxPriority = 'High';
                                else if (dayEvents.some(e => e.priority === 'Medium')) maxPriority = 'Medium';

                                let priorityColor = Colors.success;
                                if (maxPriority === 'High') priorityColor = Colors.error;
                                else if (maxPriority === 'Medium') priorityColor = Colors.warning;

                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={[
                                            styles.calendarDay,
                                            isSelected && styles.calendarDaySelected,
                                            !isCurrentMonth && styles.calendarDayOutside
                                        ]}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setSelectedDate(dateStr);
                                        }}
                                    >
                                        <Text style={[
                                            styles.calendarDayText,
                                            isSelected && styles.calendarDayTextSelected,
                                            !isCurrentMonth && styles.calendarDayTextOutside
                                        ]}>
                                            {day.date()}
                                        </Text>
                                        {hasEvents && (
                                            <View style={[
                                                styles.eventBadge, 
                                                { backgroundColor: isSelected ? '#FFF' : priorityColor }
                                            ]}>
                                                <Text style={[
                                                    styles.eventBadgeText, 
                                                    { color: isSelected ? priorityColor : '#FFF' }
                                                ]}>
                                                    {dayEvents.length}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.sectionHeaderWrap}>
                            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
                        </View>

                        <View style={styles.agendaList}>
                            {sections.length > 0 ? sections.map((section) => (
                                <View key={section.title} style={{ marginBottom: Spacing.md }}>
                                    <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
                                    {section.data.map((event) => (
                                        <TouchableOpacity 
                                            key={`list-full-${event.id}`} 
                                            style={[styles.agendaItem, { borderLeftWidth: 4, borderLeftColor: event.color || Colors.primary, marginBottom: 8 }]}
                                            onPress={() => event.type === 'club' && router.push(`/event/${event.id}` as any)}
                                            onLongPress={() => handleRemoveItem(event)}
                                        >
                                            <View style={[styles.agendaIconWrap, { backgroundColor: Colors.secondary }]}>
                                                <Ionicons name={event.type === 'academic' ? "school" : event.category === 'Exam' ? "document-text" : "calendar"} size={18} color={event.color || Colors.primary} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                    <View style={[styles.priorityDot, { backgroundColor: event.priority === 'High' ? Colors.error : event.priority === 'Medium' ? Colors.warning : Colors.success }]} />
                                                    <Text style={styles.agendaItemTitle}>{event.title}</Text>
                                                </View>
                                                <Text style={styles.agendaItemMeta}>{event.time || 'All Day'} · {event.location}</Text>

                                                <View style={styles.itemActionRow}>
                                                    {event.type === 'custom' && (
                                                        <TouchableOpacity onPress={() => handleEditItem(event)} style={styles.itemActionBtn}>
                                                            <Ionicons name="pencil" size={14} color={Colors.primary} />
                                                            <Text style={styles.itemActionText}>Edit</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <TouchableOpacity onPress={() => handleRemoveItem(event)} style={[styles.itemActionBtn, { backgroundColor: Colors.errorLight }]}>
                                                        <Ionicons 
                                                            name={event.type === 'academic' ? "eye-off" : "trash"} 
                                                            size={14} 
                                                            color={Colors.error} 
                                                        />
                                                        <Text style={[styles.itemActionText, { color: Colors.error }]}>
                                                            {event.type === 'club' ? 'Unregister' : event.type === 'academic' ? 'Hide' : 'Delete'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>No events or tasks found.</Text>
                                </View>
                            )}
                        </View>
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
                            {['Exam', 'Event', 'Deadline', 'Personal', 'Study'].map((cat) => {
                                const isActive = newCategory === cat;
                                return (
                                    <TouchableOpacity key={cat} style={[styles.catPill, isActive && { backgroundColor: getCategoryColor(cat), borderColor: getCategoryColor(cat) }]} onPress={() => setNewCategory(cat)}>
                                        <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.inputLabel}>PRIORITY</Text>
                        <View style={styles.catRow}>
                            {['Low', 'Medium', 'High'].map((p) => {
                                const isActive = newPriority === p;
                                const pColor = p === 'High' ? Colors.error : p === 'Medium' ? Colors.warning : Colors.success;
                                return (
                                    <TouchableOpacity key={p} style={[styles.catPill, isActive && { backgroundColor: pColor, borderColor: pColor }]} onPress={() => setNewPriority(p)}>
                                        <Text style={[styles.catText, isActive && styles.catTextActive]}>{p}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={styles.inputLabel}>ALL DAY EVENT</Text>
                            <Switch value={isAllDay} onValueChange={setIsAllDay} trackColor={{ true: Colors.primary }} />
                        </View>

                        <Text style={styles.inputLabel}>NOTES</Text>
                        <TextInput 
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                            placeholder="Add any details..." 
                            placeholderTextColor={Colors.textDimmed}
                            value={newNotes} 
                            onChangeText={setNewNotes}
                            multiline
                        />

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
    priorityDot: { width: 6, height: 6, borderRadius: 3 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
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
    filterRowPriority: { flexDirection: 'row', paddingHorizontal: Spacing.section, gap: 8, marginBottom: Spacing.sm },
    filterChipSmall: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill, borderWidth: 0.5, borderColor: Colors.divider, backgroundColor: Colors.surface },
    filterChipTextSmall: { ...Typography.micro, color: Colors.textSecondary, fontFamily: 'Sora_600SemiBold' },
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
    weekNavHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.section,
        marginBottom: Spacing.md,
    },
    weekNavBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    weekMonthText: {
        ...Typography.h4,
        color: Colors.text,
        fontFamily: 'Sora_700Bold',
    },
    todayLabelBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: Radius.sm,
    },
    todayLabelText: {
        fontSize: 9,
        fontFamily: 'Sora_700Bold',
        color: '#FFF',
    },
    weekStripContainer: { 
        flexDirection: 'row', 
        paddingHorizontal: Spacing.section, 
        gap: Spacing.xs 
    },
    weekDay: { 
        flex: 1, 
        height: 70,
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: Radius.lg, 
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
    weekEventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: 8,
    },
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
    itemActionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    itemActionBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4, 
        paddingVertical: 4, 
        paddingHorizontal: 8, 
        borderRadius: Radius.sm, 
        backgroundColor: Colors.secondary 
    },
    itemActionText: { ...Typography.micro, fontFamily: 'Sora_700Bold', color: Colors.primary },
    subtasksList: { marginTop: 8, gap: 4 },
    subtaskItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    subtaskText: { ...Typography.micro, color: Colors.textSecondary },
    subtaskTextDone: { textDecorationLine: 'line-through', color: Colors.mutedForeground },
    emptyState: { paddingVertical: 40, alignItems: 'center' },
    emptyText: { ...Typography.body2, color: Colors.textSecondary, textAlign: 'center' },
    fullTimelineWrap: { paddingHorizontal: Spacing.section },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
        backgroundColor: Colors.surface,
        padding: Spacing.sm,
        borderRadius: Radius.lg,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    monthNavBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radius.md,
        backgroundColor: Colors.secondary,
    },
    currentMonthText: {
        ...Typography.h4,
        color: Colors.text,
        fontFamily: 'Sora_700Bold',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: Spacing.xl,
    },
    weekdayLabel: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        ...Typography.micro,
        color: Colors.textTertiary,
        marginBottom: Spacing.sm,
        fontFamily: 'Sora_700Bold',
    },
    calendarDay: {
        width: `${100 / 7}%`,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        borderRadius: Radius.md,
    },
    calendarDaySelected: {
        backgroundColor: Colors.primary,
    },
    calendarDayOutside: {
        opacity: 0.3,
    },
    calendarDayText: {
        ...Typography.caption,
        color: Colors.text,
        fontFamily: 'Sora_600SemiBold',
    },
    calendarDayTextSelected: {
        color: '#FFF',
        fontFamily: 'Sora_700Bold',
    },
    calendarDayTextOutside: {
        color: Colors.textSecondary,
    },
    eventBadge: {
        width: 14,
        height: 14,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 4,
        right: 4,
    },
    eventBadgeText: {
        fontSize: 8,
        fontFamily: 'Sora_700Bold',
    },
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
