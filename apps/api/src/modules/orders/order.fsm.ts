import { ORDER_TRANSITIONS, type OrderStatus } from '@storefiller/types';
import { unprocessable } from '../../lib/http-error';

// B3-06/07 — Order FSM. The allowed-transition map lives once in
// @storefiller/types (shared with mobile) and is the single source of truth;
// this helper just enforces it. Any transition not in the table throws 422 —
// never silently allowed (arch §4.1: "DELIVERED and CANCELLED are terminal").

/** Throws 422 if `current → next` is not an allowed transition. */
export function assertTransition(current: OrderStatus, next: OrderStatus): void {
  if (!ORDER_TRANSITIONS[current].includes(next)) {
    throw unprocessable(`Cannot move order from ${current} to ${next}`);
  }
}

export function canTransition(current: OrderStatus, next: OrderStatus): boolean {
  return ORDER_TRANSITIONS[current].includes(next);
}

/** Terminal states have no outgoing transitions. */
export function isTerminal(status: OrderStatus): boolean {
  return ORDER_TRANSITIONS[status].length === 0;
}
