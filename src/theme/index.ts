// =============================================================
// FreshR Design System — Shadcn Inspired (Slate)
// Minimal, clean, and highly usable aesthetic.
// =============================================================

import { Platform } from 'react-native';

export const Colors = {
    // ── Shadcn Slate Palette (Minimal & Professional)
    background: '#F8FAFC',           // background (Slate 50) - changed from pure white for depth
    foreground: '#020817',           // foreground
    
    card: '#FFFFFF',                 // card
    cardForeground: '#020817',       // card-foreground
    
    popover: '#FFFFFF',              // popover
    popoverForeground: '#020817',    // popover-foreground
    
    primary: '#0F172A',              // primary (Slate 900)
    primaryForeground: '#F8FAFC',    // primary-foreground
    
    secondary: '#F1F5F9',            // secondary (Slate 100)
    secondaryForeground: '#0F172A',  // secondary-foreground
    
    muted: '#F1F5F9',                // muted
    mutedForeground: '#64748B',      // muted-foreground (Slate 500)
    
    accent: '#F1F5F9',               // accent
    accentForeground: '#0F172A',     // accent-foreground
    
    destructive: '#EF4444',          // destructive
    destructiveForeground: '#F8FAFC',// destructive-foreground
    
    border: '#E2E8F0',               // border (Slate 200)
    input: '#E2E8F0',                // input
    ring: '#0F172A',                 // ring
    
    // Semantic Helpers (Shadcn style muted variants)
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    error: '#EF4444',
    errorLight: '#FEF2F2',
    info: '#3B82F6',
    infoLight: '#EFF6FF',

    // Legacy Aliases
    surface: '#FFFFFF',
    sectionBg: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textLight: '#FFFFFF',
    textDimmed: 'rgba(15,23,42,0.5)',
    divider: '#E2E8F0',
    highlight: '#F1F5F9',
    primaryLight: '#F1F5F9',
    accentLight: '#F1F5F9',
};

// ── Minimal Palette for Elements (Clean Neutral variants)
export const Palette = [
    { bg: '#F1F5F9', text: '#0F172A', icon: '#0F172A' }, // Slate
    { bg: '#F8FAFC', text: '#334155', icon: '#334155' }, // Slate Light
    { bg: '#F1F5F9', text: '#0F172A', icon: '#0F172A' }, 
    { bg: '#F8FAFC', text: '#334155', icon: '#334155' },
    { bg: '#F1F5F9', text: '#0F172A', icon: '#0F172A' },
    { bg: '#F8FAFC', text: '#334155', icon: '#334155' },
];

export const Typography = {
    // Display
    display: { fontFamily: 'Sora_800ExtraBold', fontSize: 40, letterSpacing: -1.5 },
    hero: { fontFamily: 'Sora_700Bold', fontSize: 32, letterSpacing: -1.0 },
    // Headings
    h1: { fontFamily: 'Sora_700Bold', fontSize: 28, letterSpacing: -0.8 },
    h2: { fontFamily: 'Sora_700Bold', fontSize: 22, letterSpacing: -0.5 },
    h3: { fontFamily: 'Sora_600SemiBold', fontSize: 18, letterSpacing: -0.3 },
    h4: { fontFamily: 'Sora_600SemiBold', fontSize: 16, letterSpacing: -0.2 },
    h5: { fontFamily: 'Sora_600SemiBold', fontSize: 14, letterSpacing: 0 },
    // Body
    body1: { fontFamily: 'Sora_400Regular', fontSize: 15, lineHeight: 22 },
    body2: { fontFamily: 'Sora_400Regular', fontSize: 13, lineHeight: 18 },
    // UI
    caption: { fontFamily: 'Sora_400Regular', fontSize: 12 },
    label: { fontFamily: 'Sora_600SemiBold', fontSize: 11, letterSpacing: 0.3 },
    micro: { fontFamily: 'Sora_600SemiBold', fontSize: 10, letterSpacing: 0.4 },
    // Mono (code blocks)
    mono: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    // Price
    price: { fontSize: 17, fontFamily: 'Sora_700Bold' },
    priceLg: { fontSize: 22, fontFamily: 'Sora_700Bold' },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    section: 20,
};

export const Radius = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12,
    xxl: 16,
    pill: 9999,
};

// ── Shadow system — disabled
export const Shadows = {
    none: {},
    xs: {},
    sm: {},
    md: {},
    lg: {},
    floating: {},
    colored: () => ({}),
};

// ── Simple Gradients (Mostly flat or very subtle)
export const Gradients = {
    primary: ['#0F172A', '#1E293B'],
    accent: ['#F1F5F9', '#F1F5F9'],
    dark: ['#020817', '#0F172A'],
    heroOverlay: ['transparent', 'rgba(2,8,23,0.8)'],
    cardOverlay: ['transparent', 'rgba(2,8,23,0.6)'],
    headerStrip: ['#FFFFFF', '#F8FAFC'],
    food: ['#0F172A', '#1E293B'],
    events: ['#0F172A', '#1E293B'],
    map: ['#0F172A', '#1E293B'],
    academics: ['#0F172A', '#1E293B'],
    white: ['rgba(248,250,252,0)', 'rgba(248,250,252,1)'], // Updated to match Slate 50 background
};

const Theme = { Colors, Gradients, Typography, Spacing, Radius, Shadows };
export default Theme;
