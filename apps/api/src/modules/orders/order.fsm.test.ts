import { assertTransition, canTransition, isTerminal } from './order.fsm';
import { ORDER_TRANSITIONS, type OrderStatus } from '@storefiller/types';

const ALL: OrderStatus[] = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

describe('order FSM', () => {
  it('allows every transition declared in ORDER_TRANSITIONS', () => {
    for (const from of ALL) {
      for (const to of ORDER_TRANSITIONS[from]) {
        expect(canTransition(from, to)).toBe(true);
        expect(() => assertTransition(from, to)).not.toThrow();
      }
    }
  });

  it('rejects every transition NOT in the table (422)', () => {
    for (const from of ALL) {
      for (const to of ALL) {
        if (ORDER_TRANSITIONS[from].includes(to)) continue;
        expect(canTransition(from, to)).toBe(false);
        expect(() => assertTransition(from, to)).toThrow(expect.objectContaining({ status: 422 }));
      }
    }
  });

  it('treats DELIVERED and CANCELLED as terminal', () => {
    expect(isTerminal('DELIVERED')).toBe(true);
    expect(isTerminal('CANCELLED')).toBe(true);
    expect(isTerminal('CONFIRMED')).toBe(false);
    expect(isTerminal('OUT_FOR_DELIVERY')).toBe(false);
  });

  it('never allows a self-transition (no status maps to itself)', () => {
    for (const s of ALL) {
      expect(canTransition(s, s)).toBe(false);
    }
  });
});
