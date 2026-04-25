export const colors = {
  screenBg: '#F5F8FD',
  cardBg: '#FFFFFF',
  textPrimary: '#111416',
  textSecondary: '#57626F',
  textMuted: '#68727D',
  placeholder: '#A4AAB0',
  chipBg: '#EFF2F7',
  divider: '#EFF2F7',
  tabBorder: '#E8ECEF',
  primary: '#6115CD',
  primarySoft: '#C8A4F0',
  onPrimary: '#FFFFFF',
  iconMuted: '#57626F',
  likeActive: '#FF2B75',
  likeActiveText: '#FFEAF1',
  skeleton: '#EEEFF1',
  overlay: 'rgba(0, 0, 0, 0.5)',
  scrim: 'rgba(255, 255, 255, 0.85)',
  gradientEnd: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  card: 12,
  button: 14,
  pill: 9999,
  skeleton: 22,
} as const;

export const typography = {
  authorName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    lineHeight: 20,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },
  commentText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
  },
  link: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },
  tabActive: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    lineHeight: 18,
  },
  tabInactive: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    lineHeight: 18,
  },
  chip: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    lineHeight: 18,
  },
  buttonLarge: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    lineHeight: 26,
  },
  paidMessage: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
  },
} as const;

export const sizes = {
  avatar: 40,
  cover: 393,
  actionChip: { width: 63, height: 36 },
  icon: 24,
  primaryButtonHeight: 42,
} as const;
