// src/utils/statusTransitions.js
export const allowedTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['processing'],
  processing: ['nearest-Store'],
  'nearest-Store': ['in-your-area'],
  'in-your-area': ['at-doorstep'],
  'at-doorstep': ['delivered'],
  delivered: [],
  cancelled: [],
  returned: [],
  failed: []
};

export function canTransition(current, next) {
  return allowedTransitions[current]?.includes(next);
}
