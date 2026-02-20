export const Colors = {
    // Brand
    primary: '#FC8019',
    primaryLight: '#FFF3E8',
    primaryDark: '#E56F0D',

    // Background
    background: '#FFFFFF',
    surface: '#F5F5F7',
    sectionBg: '#F0F0F5',
    cardBg: '#FFFFFF',

    // Text
    text: '#1C1C1E',
    textSecondary: '#6B6B6B',
    textTertiary: '#9E9E9E',
    textLight: '#FFFFFF',

    // Semantic
    success: '#0C9B52',
    successLight: '#E8F7EF',
    error: '#D93025',
    errorLight: '#FDECEA',
    warning: '#FC8019',
    warningLight: '#FFF3E8',
    info: '#1A73E8',
    infoLight: '#E8F0FE',

    // UI
    border: '#E8E8E8',
    divider: '#F0F0F0',
    skeleton: '#F0F0F5',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Tags/Categories
    tagBlue: '#E8F0FE',
    tagBlueTxt: '#1A73E8',
    tagGreen: '#E8F7EF',
    tagGreenTxt: '#0C9B52',
    tagOrange: '#FFF3E8',
    tagOrangeTxt: '#FC8019',
    tagPurple: '#F3E8FF',
    tagPurpleTxt: '#7B1FA2',
    tagRed: '#FDECEA',
    tagRedTxt: '#D93025',
};

export const Typography = {
    h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
    h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
    h3: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2 },
    h4: { fontSize: 16, fontWeight: '600' as const },
    h5: { fontSize: 14, fontWeight: '600' as const },
    body1: { fontSize: 15, fontWeight: '400' as const },
    body2: { fontSize: 13, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '400' as const },
    label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.3 },
    price: { fontSize: 17, fontWeight: '700' as const },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    section: 40,
};

export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
};

export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    floating: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 12,
    },
};

export const Theme = {
    colors: Colors,
    typography: Typography,
    spacing: Spacing,
    radius: Radius,
    shadows: Shadows,
};

export default Theme;
