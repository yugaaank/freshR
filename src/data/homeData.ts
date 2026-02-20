export const quickActions = [
    { id: 'food', label: 'Food', emoji: '🍔', route: '/(tabs)/food' },
    { id: 'events', label: 'Events', emoji: '🎟️', route: '/(tabs)/explore' },
    { id: 'academics', label: 'Grades', emoji: '📚', route: '/grades' },
    { id: 'map', label: 'Map', emoji: '🗺️', route: '/campus-map' },
    { id: 'challenge', label: 'Code', emoji: '💻', route: '/coding-challenge' },
    { id: 'teachers', label: 'Faculty', emoji: '👩‍🏫', route: '/teachers' },
    { id: 'calendar', label: 'Calendar', emoji: '📅', route: '/(tabs)/calendar' },
    { id: 'track', label: 'Track', emoji: '🚚', route: '/order-tracking' },
];

export const campusAlerts = [
    {
        id: 'ca1',
        emoji: '⚡',
        title: 'Library closes early today at 6 PM',
        description: 'Plan your study sessions accordingly',
        type: 'warning',
    },
    {
        id: 'ca2',
        emoji: '🎉',
        title: 'Canteen Central new menu tomorrow',
        description: 'Thali upgraded, Biryani back on menu',
        type: 'info',
    },
];

export const banners = [
    {
        id: 'b1',
        title: 'HackMIT This Weekend',
        subtitle: '12 seats left — Register now',
        colorBg: '#1A1A2E',
    },
    {
        id: 'b2',
        title: 'Revibe Music Fest',
        subtitle: 'Only 3 tickets left',
        colorBg: '#2D1B4E',
    },
];
