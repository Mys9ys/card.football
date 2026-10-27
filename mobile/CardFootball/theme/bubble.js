// Chosen UI direction: Bubble / «Шарик»
// Spec: docs/design/directions/chosen-bubble.md

export const BubbleTheme = {
  bg: '#DFF6FF',
  bar: '#9BE7FF',
  card: '#FFF7FB',
  text: '#2A2150',
  muted: '#6A6290',
  primary: '#FF6B8A',
  onPrimary: '#FFFFFF',
  line: '#B9E8F7',
  radius: 22,
  tabActive: '#FF6B8A',
  barFill: '#5AD0FF',
  coin: '#FFFFFF',
  coinBg: '#FF6B8A',
  track: '#E5F7FF',
  rarity: {
    common: {
      border: '#A8B0D0',
      badge: '#EEF1FF',
      badgeText: '#5A6288',
    },
    rare: {
      border: '#5AD0FF',
      badge: '#D9F5FF',
      badgeText: '#0A6F96',
    },
    epic: {
      border: '#C77DFF',
      badge: '#F3E4FF',
      badgeText: '#6B2EA8',
    },
    legendary: {
      border: '#FFD166',
      badge: '#FFE8A3',
      badgeText: '#8A5A00',
    },
  },
};

export const RARITY_LABELS = {
  common: 'ОБЫЧН',
  rare: 'РЕДК',
  epic: 'ЭПИК',
  legendary: 'ЛЕГЕН',
};

export default BubbleTheme;
