/**
 * Represents a real estate property owned and/or operated by a host for rental to a guest
 * (matching Property.java)
 */
export interface Property {
  id?: string;
  hostId: string;
  name: string;
  address: string;
  image?: string; // TODO: add to backend
}

/**
 * Represents a contract agreement between a host and a guest to rent a property
 * for a specified period of time (matching Reservation.java)
 */
export interface Reservation {
  id?: string;
  hostId: string;
  propertyId: string;
  guestId: string;
  numGuests: number;
  checkIn: string;
  checkOut: string;
  reasonForStay: string;
}

/**
 * A reservation object containing additional details about its associated property
 */
export interface ReservationProperty extends Reservation {
  name: string;
  address: string;
  image?: string;
}

/**
 * The status of a reservation
 *
 *  current:  checkIn <= today & checkOut >= now,
 *  upcoming: checkIn > today,
 *  past:     checkOut < now
 */
export type ReservationStatus = 'current' | 'upcoming' | 'past';

/**
 * An object containing reservations grouped by status type
 * (current, upcoming, past), (matching SortedReservationSet.java)
 */
export type SortedReservationSet = {
  [key in ReservationStatus]: Reservation[];
};

/**
 * An object containing reservation/property objects grouped by status type
 * (current, upcoming, past)
 */
export type SortedReservationPropertySet = {
  [key in ReservationStatus]: ReservationProperty[];
};


