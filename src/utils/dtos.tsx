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
 * 
 * 
 */
export interface Guidebook {
  propertyID: string;
  propertyName: string;
  propertyType: 'Cabin' | 'City' | 'Beach' | 'Mountain';
  capacity: number;
  amenities: string[];
  pets: 'Allowed' | 'Not Allowed';
  propertyBio: string;
  faq: string;
  policies: string;
  hostRecommended: any; // change later from type any to HostRecommended object
  hostServices: string[];
  propertySpecificQ: any; // change later to Hieu's Survey object
  checkininstr: string[];
  checkoutinstr: string[];
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
export interface ReservationDetail extends Reservation {
  propertyName: string;
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
 * An object containing reservation/property objects grouped by status type
 * (current, upcoming, past)
 */
export type SortedReservationDetailSet = {
  [key in ReservationStatus]: ReservationDetail[];
};
