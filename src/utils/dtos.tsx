export interface Property {
  // matches Property.java
  id?: string;
  hostId: string;
  name: string;
  address: string;
  image?: string; // TODO: add to backend dto
}

export interface Reservation {
  // matches Reservation.java
  id?: string;
  hostId: string;
  propertyId: string;
  guestId: string;
  numGuests: number;
  checkIn: string;
  checkOut: string;
  reasonForStay: string;
}

export interface ReservationProperty extends Reservation {
  name: string;
  address: string;
  image?: string;
}

export type ReservationStatus = 'current' | 'upcoming' | 'past';

export type SortedReservationSet = {
  [key in ReservationStatus]: Reservation[];
};

export type SortedReservationPropertySet = {
  [key in ReservationStatus]: ReservationProperty[];
};
