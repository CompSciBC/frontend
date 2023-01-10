export interface Property {
  // matches Property.java
  id: number;
  hostId: number;
  name: string;
  address: string;
  image: string; // TODO: add to backend dto
}

export interface Reservation {
  // matches Reservation.java
  id: number;
  propertyId: number;
  guestId: number;
  numGuests: number;
  startDate: Date;
  endDate: Date;
  checkInTime: string; // TODO: add to backend dto
  checkOutTime: string; // TODO: add to backend dto
  reasonForStay: string;
}
