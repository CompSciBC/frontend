import { WeatherType } from '../components/dashboard/WeatherForecastTile';

/**
 * Represents a physical address (matching Address.java)
 */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  stateProvince?: string;
  postalCode?: string;
  country: string;
}

/**
 * Represents a set of geographic coordinates (matching Coordinates.java)
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Represents a real estate property owned and/or operated by a host for rental to a guest
 * (matching Property.java)
 */
export interface Property {
  id?: string;
  hostId: string;
  name: string;
  address: string; // TODO: convert to Address type
  image?: string; // TODO: add to backend
}

/**
 * Represents a guidebook json object that is used to save information from the Host
 * and displays to guests.
 */
export interface GuidebookDto {
  propertyID: string;
  propertyName: string;
  propertyType?: 'Cabin' | 'City' | 'Beach' | 'Mountain';
  capacity: number;
  pets: 'Allowed' | 'Not Allowed';
  amenities?: string[];
  propertyBio: string;
  faq?: Array<{Question:string; Answer:string}>; 
  // faq?: string[];
  policies?: string[];
  hostRecommended?: string[]; // change later from type any to HostRecommended object
  hostServices?: string[];
  propertySpecificQ?: any; // change later to Hieu's Survey object
  checkininstr?: string[];
  checkoutinstr?: string[];
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
  address: string; // TODO: convert to Address type
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

/**
 * Represents an invitation to join a reservation (matching Invitation.java)
 */
export interface Invitation {
  recipients: string[];
  guestName: string;
  message?: string;
}

/**
 * Represents a restaurant (matching Restaurant.java)
 */
export interface Restaurant {
  id: string;
  alias: string;
  name: string;
  imageUrl: string;
  isOpen: boolean;
  url: string;
  numReviews: number;
  categories: string[];
  rating: number;
  coordinates: Coordinates;
  transactions: string[];
  price: number;
  address: Address;
  description: string;
  phone: string;
  displayPhone: string;
  distance: number;
}

/**
 * Represents an event or place
 */
export interface EventOrPlace {
  imageUrl: string;
  url: string;
}

/**
 * Represents a weather forecast (matching Forecast.java)
 */
export interface Forecast {
  office: string;
  gridX_gridY: string;
  timestamp: string;

  // TODO: this is too general; need to break down into component parts (like temp, humidity, etc.)
  forecast_content: any;

  // TODO: replace these with actual fields from the forecast_content
  weather: WeatherType;
  temp: number;
}

// TODO: replace with Elena's version
/**
 * Represents a chat message
 */
export interface Message {
  name: string;
  me: boolean;
  time: Date;
  message: string;
}
