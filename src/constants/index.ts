// Contract from PRD 3 of 3 (Section 0.4 Constants & 0.5 Tokens)
// ONE config file per project, identical names.

export const GPS_INTERVAL_SEC = 10;
export const GPS_INTERVAL_LOW_BATTERY_SEC = 30;
export const LOW_BATTERY_PCT = 20;
export const OFFLINE_THRESHOLD_MIN = 10;
export const STALE_LOCATION_SEC = 60;
export const ARRIVAL_ALERT_RADIUS_M = 500;
export const DUPLICATE_RADIUS_M = 50;
export const MAX_COMPLAINTS_PER_DEVICE_PER_DAY = 5;
export const MISSED_REPORT_THRESHOLD = 3;
export const ESCALATION_L1_HOURS = 24;
export const ESCALATION_L2_HOURS = 48;
export const AVG_VAN_SPEED_KMPH = 15;
export const MIN_MOVE_M = 15;
export const HEARTBEAT_SEC = 30;

// Godhra District Center Coordinates (for map defaults)
export const GODHRA_CENTER = {
  lat: 22.7758,
  lng: 73.6149,
};

// Design tokens mapping (as per PRD 0.5 & DESIGN.md D-02)
export const DESIGN_TOKENS = {
  colors: {
    primary: '#111A14', // Ink
    onPrimary: '#FFFFFF',
    brand: '#1B7A3F',
    brandMid: '#6DB36F',
    brandLeaf: '#B5CF8A',
    brandSoft: '#E4F1DF',
    accent: '#F0873A', // Selection / Attention
    accentStrong: '#B34A0B',
    accentSoft: '#FFEBD9',
    backgroundLight: '#F3F6F2',
    backgroundDark: '#0E1612',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#16221B',
    textPrimaryLight: '#14201A',
    textPrimaryDark: '#EAF2E6',
    textMutedLight: '#566259',
    textMutedDark: '#9DB0A2',
    statusReceived: {
      fill: '#B87800',
      soft: '#FFF1D1',
      text: '#8A5A00',
    },
    statusAssigned: {
      fill: '#2F6FDE',
      soft: '#E3EDFF',
      text: '#1D4FB8',
    },
    statusResolved: {
      fill: '#1E8E5A',
      soft: '#DDF3E4',
      text: '#146B3A',
    },
    statusEscalated: {
      fill: '#D93025',
      soft: '#FDE3E0',
      text: '#B3261E',
    },
  },
  radius: {
    md: '12px',
    control: '20px',
    card: '28px',
    sheet: '32px',
    pill: '999px',
  },
  spacing: {
    unit: 8,
  },
} as const;
