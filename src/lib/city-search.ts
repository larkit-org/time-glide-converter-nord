import { normalizeTimezone } from './timezones';

interface CityRecord {
  city: string;
  city_ascii: string;
  province: string;
  country: string;
  // The dataset has non-string codes and empty fields for some records.
  iso2: unknown;
  iso3: unknown;
  pop: number;
  timezone: string | null;
}

interface IndexedCity {
  label: string;
  timezone: string;
  city: string;
  province: string;
  country: string;
  iso2: string;
  iso3: string;
}

export interface LocationMatch {
  label: string;
  timezone: string;
}

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 50;

export const normalizeSearchText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[_/,]+/g, ' ')
    .trim();

const buildIndex = (records: CityRecord[]): IndexedCity[] => {
  const resolvedZones = new Map<string, string | null>();
  const resolveZone = (timezone: string) => {
    if (!resolvedZones.has(timezone)) resolvedZones.set(timezone, normalizeTimezone(timezone));
    return resolvedZones.get(timezone);
  };

  const cities: IndexedCity[] = [];
  for (const record of [...records].sort((a, b) => b.pop - a.pop)) {
    const timezone = record.timezone && resolveZone(record.timezone);
    if (!timezone) continue;
    const place = record.province && record.province !== record.city ? `${record.city}, ${record.province}` : record.city;
    cities.push({
      label: `${place}, ${record.country}`,
      timezone,
      city: normalizeSearchText(`${record.city} ${record.city_ascii}`),
      province: normalizeSearchText(record.province ?? ''),
      country: normalizeSearchText(record.country),
      iso2: String(record.iso2 ?? '').toLowerCase(),
      iso3: String(record.iso3 ?? '').toLowerCase(),
    });
  }
  return cities;
};

let indexPromise: Promise<IndexedCity[]> | null = null;

// The dataset is large, so it stays in its own chunk until the first search.
export const loadCityIndex = (): Promise<IndexedCity[]> => {
  indexPromise ??= import('city-timezones/data/cityMap.json')
    .then((module) => buildIndex(module.default as CityRecord[]))
    .catch((error) => {
      indexPromise = null;
      throw error;
    });
  return indexPromise;
};

const isCountryMatch = (city: IndexedCity, query: string): boolean =>
  city.iso2 === query || city.iso3 === query || (query.length >= 3 && city.country.startsWith(query));

const getCityRank = (city: IndexedCity, query: string): number | null => {
  if (city.city.startsWith(query)) return 0;
  if (city.city.includes(` ${query}`)) return 1;
  if (city.province.startsWith(query)) return 2;
  return null;
};

// Cities are indexed largest first, so each bucket stays ordered by population.
export const searchCities = (cities: IndexedCity[], rawQuery: string): LocationMatch[] => {
  const query = normalizeSearchText(rawQuery);
  if (query.length < MIN_QUERY_LENGTH) return [];

  const buckets: IndexedCity[][] = [[], [], []];
  const countryZones = new Map<string, IndexedCity>();
  for (const city of cities) {
    const rank = getCityRank(city, query);
    if (rank !== null) buckets[rank].push(city);
    // A country lists each of its zones once, represented by its largest city.
    else if (isCountryMatch(city, query) && !countryZones.has(city.timezone)) countryZones.set(city.timezone, city);
  }

  return [...buckets.flat(), ...countryZones.values()]
    .slice(0, MAX_RESULTS)
    .map(({ label, timezone }) => ({ label, timezone }));
};
