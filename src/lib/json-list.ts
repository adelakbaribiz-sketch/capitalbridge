// SQLite has no native array column type, so list-valued fields are stored
// as JSON strings (see prisma/schema.prisma header comment). These helpers
// keep that encoding in one place instead of scattered JSON.parse calls.

export function encodeList(values: string[]): string {
  return JSON.stringify(values);
}

export function decodeList(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}
