import { parseDurationMs } from './duration';

describe('parseDurationMs', () => {
  it.each([
    ['500ms', 500],
    ['45s', 45_000],
    ['15m', 900_000],
    ['12h', 43_200_000],
    ['30d', 2_592_000_000],
    ['1d', 86_400_000],
  ])('parses %s → %i ms', (input, expected) => {
    expect(parseDurationMs(input)).toBe(expected);
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseDurationMs('  15m  ')).toBe(900_000);
  });

  it.each(['', 'abc', '15', 'm', '15min', '15 m s', '-5m', '1.5h'])(
    'rejects invalid input %j',
    (input) => {
      expect(() => parseDurationMs(input)).toThrow(/Invalid duration/);
    },
  );
});
