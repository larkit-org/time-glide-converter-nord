import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, LocateFixed } from 'lucide-react';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { loadCityIndex, normalizeSearchText, searchCities } from '../lib/city-search';
import { detectTimezone, timezones } from '../lib/timezones';

type CityIndex = Awaited<ReturnType<typeof loadCityIndex>>;

interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
}

const TimezonePicker = ({ value, onChange }: TimezonePickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cityIndex, setCityIndex] = useState<CityIndex>([]);
  const detectedTimezone = useMemo(detectTimezone, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadCityIndex()
      .then((index) => {
        if (!cancelled) setCityIndex(index);
      })
      .catch((error) => console.error('Failed to load city list:', error));
    return () => {
      cancelled = true;
    };
  }, [open]);

  const cityMatches = useMemo(() => searchCities(cityIndex, query), [cityIndex, query]);
  const zoneMatches = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    return timezones.filter((timezone) => normalizeSearchText(timezone).includes(normalizedQuery));
  }, [query]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery('');
  };

  const selectTimezone = (timezone: string) => {
    onChange(timezone);
    handleOpenChange(false);
  };

  return (
    <div className="flex justify-center gap-2 px-4">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select time zone"
            className="w-full md:w-80 justify-between text-base md:text-xl font-normal border-2 border-foreground rounded-none"
          >
            <span className="truncate">{value}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-80 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Search city, country or time zone" value={query} onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>No locations found.</CommandEmpty>
              {cityMatches.length > 0 && (
                <CommandGroup heading="Locations">
                  {cityMatches.map(({ label, timezone }) => (
                    <CommandItem key={label} value={`location|${label}`} onSelect={() => selectTimezone(timezone)}>
                      <span className="truncate">{label}</span>
                      <span className="ml-auto pl-2 shrink-0 text-xs text-muted-foreground">{timezone}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {zoneMatches.length > 0 && (
                <CommandGroup heading="Time zones">
                  {zoneMatches.map((timezone) => (
                    <CommandItem key={timezone} value={`zone|${timezone}`} onSelect={() => selectTimezone(timezone)}>
                      <span className="truncate">{timezone}</span>
                      {timezone === value && <Check className="ml-auto h-4 w-4 shrink-0" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {detectedTimezone && (
        <Button
          variant="outline"
          size="icon"
          title={`Use my location (${detectedTimezone})`}
          aria-label="Use my location"
          className="shrink-0 border-2 border-foreground rounded-none"
          onClick={() => onChange(detectedTimezone)}
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TimezonePicker;
