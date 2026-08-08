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

export function parseScheduledDateValue(value: string): Date {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    throw new Error("Invalid scheduled time provided");
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    const [datePart, timePart] = trimmed.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    if ([year, month, day, hour, minute].some((entry) => Number.isNaN(entry))) {
      throw new Error("Invalid scheduled time provided");
    }

    const utcCandidate = Date.UTC(year, month - 1, day, hour, minute, 0);
    const offsetMs = getTimeZoneOffset(new Date(utcCandidate), "Asia/Kolkata");

    return new Date(utcCandidate - offsetMs);
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid scheduled time provided");
  }

  return parsed;
}
