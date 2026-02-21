// =============================================================
// CampusOS Design System — World-Class Premium Theme
// Inspired by: Blinkit (bold/warm), Spotify (gradients/depth), Apple (spacing/glass)
// =============================================================

import { Platform } from 'react-native';

export const Colors = {
    // ── Brand Primaries
    primary: '#FC8019',
    primaryGradientStart: '#FF6B35',
    primaryGradientEnd: '#FC8019',
    primaryLight: '#FFF3E8',
    primaryDark: '#E56F0D',

    // ── Secondary Accent — Electric Indigo (coding/academics)
    accent: '#6C63FF',
    accentLight: '#F0EFFF',
    accentDark: '#5549E8',
    accentGradientStart: '#8B7FFF',
    accentGradientEnd: '#6C63FF',

    // ── Teal (Map/Location)
    teal: '#00C9B1',
    tealLight: '#E0FAF7',

    // ── Backgrounds (Apple iOS System Grays)
    background: '#FFFFFF',
    surface: '#F4F8F5',
    sectionBg: '#F4F8F5',
    cardBg: '#FFFFFF',
    darkBg: '#1C1C1E',
    darkBgSecondary: '#2C2C2E',
    heroBg: '#E8F5EC',
    heroBgEnd: '#D7F0E4',

    // ── Text
    text: '#0F1B15',
    textSecondary: '#4F5E55',
    textTertiary: '#7A877B',
    textLight: '#FFFFFF',
    textDimmed: 'rgba(15,27,21,0.65)',

    // ── Semantic
    success: '#4CCE8F',          // Lighter green
    successLight: '#EAFFF4',
    error: '#FF3B30',            // Apple red
    errorLight: '#FFF0EF',
    warning: '#FF9500',          // Apple orange
    warningLight: '#FFF3E0',
    info: '#007AFF',             // Apple blue
    infoLight: '#E5F1FF',

    // ── UI Chrome
    border: '#E8E8E8',
    borderStrong: '#D1D1D6',
    divider: '#F2F2F7',
    overlay: 'rgba(0,0,0,0.50)',
    overlayLight: 'rgba(0,0,0,0.30)',
    overlayDark: 'rgba(0,0,0,0.75)',

    // ── Glass
    glassBg: 'rgba(255,255,255,0.12)',
    glassWhite: 'rgba(255,255,255,0.90)',
    glassDark: 'rgba(28,28,30,0.75)',
    highlight: 'rgba(255,255,255,0.15)',   // top-border highlight on dark cards

    // ── Tag variants
    tagBlue: '#E5F1FF',
    tagBlueTxt: '#007AFF',
    tagGreen: '#E6FBF0',
    tagGreenTxt: '#2F8A5F',
    tagOrange: '#FFF3E8',
    tagOrangeTxt: '#FC8019',
    tagPurple: '#F0EFFF',
    tagPurpleTxt: '#6C63FF',
    tagRed: '#FFF0EF',
    tagRedTxt: '#FF3B30',
    tagTeal: '#E0FAF7',
    tagTealTxt: '#00C9B1',
    tagGrey: '#F2F2F7',
    tagGreyTxt: '#6B6B6B',
};

// ── Gradient Presets (pass to LinearGradient colors prop)
export const Gradients = {
    primary: [Colors.primaryGradientStart, Colors.primaryGradientEnd],
    accent: [Colors.accentGradientStart, Colors.accentGradientEnd],
    dark: [Colors.heroBg, Colors.heroBgEnd],
    heroOverlay: ['transparent', 'rgba(0,0,0,0.85)'],
    cardOverlay: ['transparent', 'rgba(0,0,0,0.70)'],
    headerStrip: ['#FFF8F3', '#FAFAFA'],
    food: ['#FF6B35', '#FC8019'],
    events: ['#7B6FF0', '#6C63FF'],
    map: ['#00D4BC', '#00C9B1'],
    academics: ['#007AFF', '#5856D6'],
    white: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],  // bottom fade
};

export const Typography = {
    // Display
    display: { fontFamily: 'Sora_800ExtraBold', fontSize: 40, letterSpacing: -1.5 },
    hero: { fontFamily: 'Sora_800ExtraBold', fontSize: 32, letterSpacing: -1.0 },
    // Headings
    h1: { fontFamily: 'Sora_800ExtraBold', fontSize: 28, letterSpacing: -0.8 },
    h2: { fontFamily: 'Sora_700Bold', fontSize: 22, letterSpacing: -0.5 },
    h3: { fontFamily: 'Sora_700Bold', fontSize: 18, letterSpacing: -0.3 },
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
    price: { fontSize: 17, fontWeight: '700' as const },
    priceLg: { fontSize: 22, fontWeight: '800' as const },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    section: 20,   // upgraded from 16
};

export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 9999,
};

// ── Shadow system — ultra-subtle (opacity ≤ 0.08)
export const Shadows = {
    none: {},
    xs: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    floating: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 12,
    },
    colored: (hex: string) => ({
        shadowColor: hex,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.30,
        shadowRadius: 12,
        elevation: 6,
    }),
};

const Theme = { Colors, Gradients, Typography, Spacing, Radius, Shadows };
export default Theme;
