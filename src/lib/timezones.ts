export const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Stockholm',
  'Europe/Moscow',
  'Europe/Helsinki',
  'Europe/Madrid',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney'
]; 

// localStorage is user-writable: an unknown value would make Intl.DateTimeFormat
// throw a RangeError and blank the page, so only allowlisted zones are accepted.
export const readStoredTimezone = (key: string, fallback: string): string => {
  const stored = localStorage.getItem(key);
  return stored !== null && timezones.includes(stored) ? stored : fallback;
};
