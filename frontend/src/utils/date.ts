const INDIA_TIMEZONE = "Asia/Kolkata";

function getTimeZoneOffset(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const localUtcTime = Date.UTC(
    Number(partMap.year),
    Number(partMap.month) - 1,
    Number(partMap.day),
    Number(partMap.hour),
    Number(partMap.minute),
    Number(partMap.second)
  );

  return localUtcTime - date.getTime();
}

export function getLocalDatetimeInputValue(value?: Date | string | null): string {
  const source = value instanceof Date ? value : value ? new Date(value) : new Date();
  const date = new Date(source);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}`;
}

export function toISOStringFromLocalDatetimeInput(value: string): string | null {
  if (!value) {
    return null;
  }

  const [datePart, timePart] = value.split("T");

  if (!datePart || !timePart) {
    return null;
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if ([year, month, day, hour, minute].some((entry) => Number.isNaN(entry))) {
    return null;
  }

  // Interpret the value as Asia/Kolkata wall time and convert it to the correct UTC instant.
  const utcCandidate = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offsetMs = getTimeZoneOffset(new Date(utcCandidate), INDIA_TIMEZONE);

  return new Date(utcCandidate - offsetMs).toISOString();
}

export function formatDateInIndia(value?: Date | string | null): string {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
