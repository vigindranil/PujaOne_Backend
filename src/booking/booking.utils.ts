import { BadRequestException } from '@nestjs/common';
import { BOOKING_STATUS_FLOW } from './booking.constants';

export function validateStatusTransition(
  current: string,
  next: string,
) {
  const allowed = BOOKING_STATUS_FLOW[current] || [];

  if (!allowed.includes(next)) {
    throw new BadRequestException(
      `Invalid booking status change: ${current} → ${next}`,
    );
  }
}
