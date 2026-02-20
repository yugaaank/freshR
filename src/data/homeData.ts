export const homeData = {
    quickActions: [
        { id: 'qa1', label: 'Food', icon: '🍔', color: '#FFF3E8', route: '/(tabs)/food' },
        { id: 'qa2', label: 'Events', icon: '🎟️', color: '#E8F0FE', route: '/(tabs)/events' },
        { id: 'qa3', label: 'Academics', icon: '📚', color: '#E8F7EF', route: '/(tabs)/academics' },
        { id: 'qa4', label: 'Calendar', icon: '📅', color: '#F3E8FF', route: '/(tabs)/calendar' },
        { id: 'qa5', label: 'Map', icon: '🗺️', color: '#FDECEA', route: '/campus-map' },
        { id: 'qa6', label: 'Code', icon: '💻', color: '#E8F0FE', route: '/coding-challenge' },
        { id: 'qa7', label: 'Teachers', icon: '👩‍🏫', color: '#FFF3E8', route: '/teachers' },
        { id: 'qa8', label: 'Track', icon: '🚚', color: '#E8F7EF', route: '/order-tracking' },
    ],
    banners: [
        {
            id: 'b1',
            title: 'HackMIT This Weekend',
            subtitle: '12 seats left — Register now',
            color: '#1A73E8',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        },
        {
            id: 'b2',
            title: 'Revibe Music Fest',
            subtitle: 'Only 3 General tickets left',
            color: '#D93025',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        },
        {
            id: 'b3',
            title: 'Today\'s Coding Challenge',
            subtitle: '14-day streak active 🔥',
            color: '#0C9B52',
            image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
        },
    ],
    campusAlerts: [
        { id: 'ca1', text: '⚡ Library closing early today at 6 PM', type: 'warning' },
        { id: 'ca2', text: '🎉 Canteen Central opens new menu tomorrow', type: 'info' },
        { id: 'ca3', text: '⚠️ CS601 quiz rescheduled to Friday', type: 'danger' },
    ],
};
