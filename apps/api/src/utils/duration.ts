/** Parses a short duration string like '15m', '30d', '12h', '45s' into milliseconds. */
export function parseDurationMs(value: string): number {
  const m = /^(\d+)\s*(ms|s|m|h|d)$/.exec(value.trim());
  if (!m) throw new Error(`Invalid duration: ${value}`);
  const n = Number(m[1]);
  const unit = m[2];
  const mult: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return n * mult[unit];
}
