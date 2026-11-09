// Used only by browsers without Intl.supportedValuesOf.
const FALLBACK_TIMEZONES = [
  'America/New_York',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Stockholm',
  'Europe/Moscow',
  'Europe/Helsinki',
  'Europe/Madrid',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
];

const supportedTimezones =
  typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : FALLBACK_TIMEZONES;

// supportedValuesOf omits 'UTC' in some engines, so it is always added explicitly.
export const timezones: string[] = [...new Set(['UTC', ...supportedTimezones])];

const allowedTimezones = new Set(timezones);

// Engines disagree on spelling (Asia/Kolkata vs Asia/Calcutta), so a zone is resolved
// to this engine's name first. Returns null for anything that is not an allowed zone.
export const normalizeTimezone = (timezone: string): string | null => {
  try {
    const resolved = new Intl.DateTimeFormat('en-US', { timeZone: timezone }).resolvedOptions().timeZone;
    return allowedTimezones.has(resolved) ? resolved : null;
  } catch {
    return null;
  }
};

export const detectTimezone = (): string | null =>
  normalizeTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

// localStorage is user-writable: an unknown value would make Intl.DateTimeFormat
// throw a RangeError and blank the page, so only allowlisted zones are accepted.
export const readStoredTimezone = (key: string, fallback: string): string => {
  const stored = localStorage.getItem(key);
  return (stored !== null && normalizeTimezone(stored)) || fallback;
};

const getOffsetMinutes = (date: Date, timezone: string): number => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );
  const wallClockAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((wallClockAsUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
};

export const calculateTimeDifference = (timestamp: number, timezone1: string, timezone2: string): string => {
  const date = new Date(timestamp * 1000);
  const difference = getOffsetMinutes(date, timezone1) - getOffsetMinutes(date, timezone2);
  const sign = difference >= 0 ? '+' : '-';
  const absolute = Math.abs(difference);
  return `${sign}${Math.floor(absolute / 60)}:${String(absolute % 60).padStart(2, '0')}`;
};
