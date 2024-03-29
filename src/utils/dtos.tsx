import { WeatherType } from '../components/dashboard/weather/WeatherForecastTile';

export type UserRole = 'guest' | 'host' | undefined;

/**
 * Represents a user of the application
 */
export interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  joinedOn?: Date;
}

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
  address: Address;
  image?: string; // TODO: add to backend
}

/**
 * Represents a key/value data pair
 */
export interface KeyValue {
  key: string;
  value: string;
}

/**
 * The valid types of a guidebook section
 */
export type GuidebookSectionType = 'text' | 'list' | 'keyValue' | 'bio';

/**
 * The base shape of a guidebook section
 */
export interface GuidebookSection<T> {
  title: string;
  type: GuidebookSectionType;
  content: T;
}

/**
 * The property bio information for a property guidebook
 */
export interface GuidebookPropertyBio {
  about: string;
  amenities: string[];
  facts: KeyValue[];
  checkInInstr?: string;
  checkOutInstr?: string;
}

/**
 * Represents a guidebook json object that is used to save information from the Host
 * and displays to guests.
 */
export type GuidebookDto = {
  propertyId: string;
  propertyName: string;
  sections: string[];
  propertyBio: GuidebookSection<GuidebookPropertyBio>;
} & {
  [key: string]: GuidebookSection<string | string[] | KeyValue[]>;
};

/**
 * Represents a place that a guest can view that is nearby their property rental.
 * (Matching Place.java)
 */
export interface Place {
  name: string;
  openNow: boolean;
  rating: number;
  types: string[];
  loc: { latitude: string; longitude: string };
  vicinity: string;
  priceLvl: number;
  placeID: string;
  userPhotoReference: string;
  photo: any;
}

/*
 * Metadata for a guidebook image
 */
export interface GuidebookImageMetadata {
  name: string;
  tags: string[];
}

/**
 * Contains a list of image files and associated metadata (matching GuidebookImageMetadata.java)
 */
export interface GuidebookImageFiles {
  files: FileList;
  metadata: GuidebookImageMetadata[];
}

/**
 * Represents a Guidebook image (matching GuidebookImage.java)
 */
export interface GuidebookImage {
  url: string;
  metadata: GuidebookImageMetadata;
}

/**
 * Represents a contract agreement between a host and a guest to rent a property
 * for a specified period of time (matching Reservation.java)
 */
export interface Reservation {
  id: string;
  hostId: string;
  propertyId: string;
  guestId: string;
  numGuests: number;
  checkIn: string;
  checkOut: string;
  reasonForStay: string;
  inviteCode: string;
  checkedIn: boolean;
  property: Property;
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
 * An object containing reservation objects grouped by status type
 * (current, upcoming, past)
 */
export type SortedReservationDetailSet = {
  [key in ReservationStatus]: Reservation[];
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
 * Specifies filters for a restaurant search (matching RestaurantFilters.java)
 */
export interface RestaurantFilters {
  address: Address;
  radius?: number;
  keywords?: string[];
  maxPrice?: number;
  openNow?: boolean;
  numResults?: number;
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
  timestamp?: string;
  weather: WeatherType;
  number: number;
  name: string;
  shortName?: string;
  temp: number;
  detailedForecast: string;
  shortForecast: string;
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

export interface SurveyData {
  reservationId: string;
  property: Property;
  guest: User;
  qualityMetrics: {};
  qualityMetricsAverage: number;
  submissionTime: Date;
  surveyResponse: string;
}

export interface PieChartData {
  name: string;
  count: number;
  ratingFrequencyMap: { [key: string]: number };
}

export interface SurveyMetrics {
  hostId: string;
  surveyResponses: SurveyData[];
  pieChartData: { [key: string]: PieChartData[] };
}

/**
 * The bounding box surrounding an amenity suggestion
 */
export interface BoundingBox {
  height: number;
  width: number;
  top: number;
  left: number;
}

/**
 * An amenity suggestion based on image recognition (matching AmenitySuggestion.java)
 */
export interface AmenitySuggestion {
  name: string;
  confidence: number;
  parents: string[];
  boxes: BoundingBox[];
}
